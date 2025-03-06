// 引入 pushFlowData 函数
import { pushFlowData } from '@/api/index'; // 请替换为实际的 API 模块路径
import { getOperatingSystem, getBrowserName, getDeviceType } from '@/api/commonInfo';
// import { getReportQueue } from './reportQueue';
// const reportQueue = getReportQueue()
import { reportQueue } from './reportQueue';

export class PVTracker {
    constructor() {
        // 初始化时上报一次 PV 数据
        const initialPagePath = this.getNormalizedPath();
        this.sendPVData(initialPagePath);
        this.setup();
    }

    private setup() {
        const trackPV = () => {
            const pagePath = this.getNormalizedPath(); // 获取标准化路径
            this.sendPVData(pagePath);
        };

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        // 装饰 pushState 方法
        history.pushState = (...args) => {
            const result = originalPushState.apply(history, args);
            const pagePath = this.getNormalizedPath(); // 获取标准化路径
            console.log(`路由跳转到: ${pagePath}`);
            trackPV();
            return result;
        };

        // 装饰 replaceState 方法
        history.replaceState = (...args) => {
            const result = originalReplaceState.apply(history, args);
            trackPV();
            return result;
        };
    }

    private getNormalizedPath(): string {
        // 获取标准化路径（可根据需要调整）
        return `${window.location.pathname}${window.location.search}`;
    }

    private async sendPVData(pagePath: string) {
        console.log(`[PVTracker] 添加上报任务：${pagePath}`)
        const os = getOperatingSystem();
        const browser = getBrowserName();
        const deviceType = getDeviceType();

        // 将上报任务加入请求队列
        reportQueue.addTask(async () => {
            try {
                await pushFlowData(pagePath, 'pv', os, browser, deviceType);
                console.log('PV数据上报成功');
            } catch (error) {
                console.error('PV数据上报失败:', error);
            }
        });   
    }
}