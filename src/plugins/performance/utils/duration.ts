import { DurationData } from '@/api/interface'

type DurationConfig = {
    reportHandler: (data: DurationData) => Promise<void>;
};

export class DurationTracker {
    private config: DurationConfig;
    private lastPage: { path: string; startTime: number };

    constructor(config: DurationConfig) {
        this.config = config;
        this.lastPage = {
            path: this.getNormalizedPath(),
            startTime: Date.now(),
        };
        this.setup();
    }

    private setup() {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        // 拦截 pushState
        history.pushState = (...args) => {
            const oldPath = this.lastPage.path;
            const oldStart = this.lastPage.startTime;
            const result = originalPushState.apply(history, args);
            this.handleRouteChange(oldPath, oldStart);
            return result;
        };

        // 拦截 replaceState
        history.replaceState = (...args) => {
            const oldPath = this.lastPage.path;
            const oldStart = this.lastPage.startTime;
            const result = originalReplaceState.apply(history, args);
            this.handleRouteChange(oldPath, oldStart);
            return result;
        };

        // 监听浏览器导航
        window.addEventListener("popstate", () => {
            const now = Date.now();
            this.reportDuration(now);
            this.updateLastPage(now);
        });

        // 页面关闭前上报
        window.addEventListener("beforeunload", () => {
            this.reportDuration(Date.now());
        });
    }

    private handleRouteChange(oldPath: string, oldStart: number) {
        const newPath = this.getNormalizedPath();
        const duration = Date.now() - oldStart;

        // 路径变化时上报旧路径数据
        if (oldPath !== newPath) {
            this.sendDurationData({ pagePath: oldPath, duration });
        }

        this.lastPage = {
            path: newPath,
            startTime: Date.now()
        };
    }

    private reportDuration(endTime: number) {
        const duration = endTime - this.lastPage.startTime;
        this.sendDurationData({
            pagePath: this.lastPage.path,
            duration
        });
    }

    private updateLastPage(endTime: number) {
        this.lastPage = {
            path: this.getNormalizedPath(),
            startTime: endTime
        };
    }

    private getNormalizedPath(): string {
        return `${window.location.pathname}${window.location.search}`;
    }

    private sendDurationData(data: DurationData) {
        this.config.reportHandler(data).catch(error => {
            console.error("停留时长上报失败:", error);
        });
    }
}