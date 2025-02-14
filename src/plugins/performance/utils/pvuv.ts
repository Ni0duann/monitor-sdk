// src/modules/pvTracker.ts
type PVConfig = {
    reportUrl: string;
    reportHandler: (data: any) => void;
};

export class PVTracker {
    private config: PVConfig;

    constructor(config: PVConfig) {
        this.config = config;
        this.setup();
    }
    
    private setup() {
        const trackPV = () => {
            const currentUrl = window.location.href;
            this.sendPVData(currentUrl);
        };

        // 监听浏览器前进/后退
        window.addEventListener('popstate', trackPV);

        // 保存原始方法引用
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        // 装饰pushState方法
        history.pushState = (...args) => {
            const result = originalPushState.apply(history, args);
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

    private sendPVData(url: string) {
        this.config.reportHandler({
            url: this.config.reportUrl,
            data: {
                url: url,
                dataType: 'pv'
            },
            delay: 0
        });
    }
}
