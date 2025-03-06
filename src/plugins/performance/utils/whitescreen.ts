import { reportWhiteScreen } from '@/api/index';
import { WhiteScreenReport } from '@/api/interface';
import { getOperatingSystem, getBrowserName, getDeviceType } from '@/api/commonInfo';
import { reportQueue } from './reportQueue';

// 标志位，用于记录是否已经提示过白屏,避免重复检测
let hasReportedWhiteScreen = false;

/**
 * 检测当前页面是否为白屏
 * @param {number} [threshold=0.8] 判断为白屏的阈值（空白点占比），默认 80%
 * @returns {boolean} 是否为白屏
 */
const detectWhiteScreen = (threshold = 0.8): boolean => {
    // 获取视口尺寸
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 处理极端情况：视口不可见
    if (viewportWidth === 0 || viewportHeight === 0) return true;

    // 生成均匀分布的检测点坐标（包含视口中心+四个角落）
    const detectionPoints = [
        /* 中心点 */[viewportWidth / 2, viewportHeight / 2],
        /* 左上角 */[0, 0],
        /* 右上角 */[viewportWidth - 1, 0], // 减1避免坐标越界
        /* 左下角 */[0, viewportHeight - 1],
        /* 右下角 */[viewportWidth - 1, viewportHeight - 1],
    ];

    // 统计空白点数
    let blankPointsCount = 0;

    detectionPoints.forEach(([x, y]) => {
        // 获取当前坐标下所有元素（按从顶层到底层顺序）
        const elements = document.elementsFromPoint(x, y);

        // 取最顶层非 body/html 的可见元素
        const topElement = elements.find(el => {
            return el !== document.body &&
                el !== document.documentElement &&
                isElementVisible(el as HTMLElement);
        });

        // 如果没有找到有效元素，则认为该点是空白
        if (!topElement) {
            blankPointsCount++;
            return;
        }

        // 检查元素是否为空内容元素
        if (isElementEmpty(topElement as HTMLElement)) {
            blankPointsCount++;
        }
    });

    // 计算空白点比例
    const blankRatio = blankPointsCount / detectionPoints.length;
    return blankRatio >= threshold;
};

/**
 * 判断元素是否为可见状态（没有隐藏或者none，透明度大于0.01）
 */
const isElementVisible = (element: HTMLElement): boolean => {
    const style = window.getComputedStyle(element);
    return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        parseFloat(style.opacity) > 0.01 &&
        element.offsetWidth > 0 &&
        element.offsetHeight > 0
    );
};

/**
 * 判断元素是否为空内容元素
 */
const isElementEmpty = (element: HTMLElement): boolean => {
    // 检查文本内容
    if (element.innerText.trim().length > 0) return false;

    // 检查图片内容
    if (element.querySelectorAll('img').length > 0) return false;

    // 检查 Canvas/SVG 内容
    if (element.querySelectorAll('canvas, svg').length > 0) return false;

    // 检查输入元素
    if (element.querySelectorAll('input, textarea, select').length > 0) return false;

    // 检查子元素可见性（递归检查两层）
    const hasVisibleChildren = Array.from(element.children).some(child => {
        if (child.children.length > 0) {
            return Array.from(child.children).some(subChild =>
                isElementVisible(subChild as HTMLElement)
            );
        }
        return isElementVisible(child as HTMLElement);
    });

    return !hasVisibleChildren;
};

// 新增可视化反馈方法
const showWhiteScreenAlert = async () => {
   
    if (hasReportedWhiteScreen) return; // 如果已经提示过白屏，直接返回
    hasReportedWhiteScreen = true; // 标记为已经提示过白屏
    console.error('⚠️ 检测到白屏！建议检查：\n- 资源加载状态\n- 错误边界\n- 网络连接');
    window.alert('警告：检测到页面白屏，白屏错误信息已上传');
    // incrementWhiteScreenCountOnServer();
    // 调用 reportWhiteScreen 函数上报白屏信息
    const pageUrl = getNormalizedPath();
    const browser = getBrowserName();
    const os = getOperatingSystem();
    const deviceType = getDeviceType();
    const reportData: WhiteScreenReport = {
        pageUrl,
        browser,
        os,
        device_type: deviceType
    };

    reportQueue.addTask(async () => {
        console.log(`[WhiteScreen] 添加上报任务`)
        try {
            await reportWhiteScreen(reportData);
            console.log('白屏信息上报成功');
        } catch (error) {
            console.error('白屏信息上报失败:', error);
        }
    });
};

const logNormalStatus = () => {
    console.log('✅ 页面渲染正常，未检测到白屏');
};

// 导出带反馈的检测方法
// 添加延迟检测
const delayedDetect = (threshold: number, delay = 3000): Promise<boolean> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(detectWhiteScreen(threshold));
        }, delay);
    });
};

// 监听路由变化，在路由发生变化时，重置白屏报告标志位，并进行白屏检测
const setupRouteListener = (threshold: number) => {
    const handleRouteChange = () => {
        console.log('进入 handleRouteChange，重置 hasReportedWhiteScreen 为 false');
        hasReportedWhiteScreen = false; // 路由跳转时重置标志位
        delayedDetect(threshold).then(isWhite => {
            if (isWhite) {
                showWhiteScreenAlert();
            } else {
                logNormalStatus();
            }
        });
    };

    // 监听pushState和replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        handleRouteChange();
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        handleRouteChange();
    };

    // 监听popstate（点击前进或后退都会触发）
    window.addEventListener('popstate', () => {
        handleRouteChange();
    });
};

// 定义 getNormalizedPath 方法
const getNormalizedPath = (): string => {
    return `${window.location.pathname}${window.location.search}`;
};

export const checkWhiteScreenWithFeedback = (threshold = 0.8) => {
    // 初始检测
    delayedDetect(threshold).then(isWhite => {
        if (isWhite) {
            showWhiteScreenAlert();
        } else {
            logNormalStatus();
        }
    });

    // 设置路由监听
    setupRouteListener(threshold);
};

export { detectWhiteScreen };