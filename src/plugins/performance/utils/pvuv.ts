// src/modules/pvTracker.ts
type PVConfig = {
    // reportUrl: string;
    reportHandler: (pagePath: string, dataType: 'pv' | 'uv') => Promise<void>;
};

export class PVTracker {
    private config: PVConfig;

    constructor(config: PVConfig) {
        this.config = config;
        this.setup();
    }
    
    private setup() {
        const trackPV = () => {
            const pagePath = this.getNormalizedPath(); // 获取标准化路径
            this.sendPVData(pagePath);
        };

        // 监听浏览器前进/后退
        window.addEventListener('popstate', trackPV);

        // 保存原始方法引用
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        // 装饰pushState方法
        history.pushState = (...args) => {
            const result = originalPushState.apply(history, args);
            const pagePath = this.getNormalizedPath(); // 获取标准化路径
                 // 添加打印语句
            console.log(`路由跳转到: ${pagePath}`);
            trackPV();
            return result;
        };

        // 装饰replaceState方法
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

    private sendPVData(pagePath: string) {
        // 直接调用处理函数并传递参数
        this.config.reportHandler(pagePath, 'pv').catch(error => {
            console.error('PV数据上报失败:', error);
        });
    }
}
