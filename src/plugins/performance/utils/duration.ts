// 引入 pushDuration 函数
import { pushDuration } from '@/api/index';
import { DurationData } from '@/api/interface';
import { reportQueue } from './reportQueue';

export class DurationTracker {
    private lastPage: { path: string; startTime: number };

    constructor() {
       //lastPage用于存储上一个页面的信息，包含 path（页面路径）和 startTime（进入该页面的时间戳）。
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

        // 当用户关闭页面或刷新页面时，会触发 beforeunload 事件。在事件处理函数中，获取当前时间，调用 reportDuration 方法上报当前页面的停留时长。
        window.addEventListener("beforeunload", () => {
            this.reportDuration(Date.now());
        });
    }

    //获取新页面的路径，计算旧页面的停留时长。如果新旧页面路径不同，则调用sendDurationData方法上报旧页面的停留时长数据，然后更新lastPage属性为新页面的信息。
    private handleRouteChange(oldPath: string, oldStart: number) {
        const newPath = this.getNormalizedPath();
        const duration = Date.now() - oldStart;

        // 路径变化时上报旧路径停留时长数据
        if (oldPath !== newPath) {
            this.sendDurationData({ pagePath: oldPath, duration });
        }

        this.lastPage = {
            path: newPath,
            startTime: Date.now()
        };
    }

    //根据传入的结束时间和 lastPage 中的起始时间计算停留时长，然后调用 sendDurationData 方法上报数据。
    private reportDuration(endTime: number) {
        const duration = endTime - this.lastPage.startTime;
        this.sendDurationData({
            pagePath: this.lastPage.path,
            duration
        });
    }

    //用于更新 lastPage 属性。它会获取当前页面的路径，并将传入的结束时间作为新的起始时间。
    private updateLastPage(endTime: number) {
        this.lastPage = {
            path: this.getNormalizedPath(),
            startTime: endTime
        };
    }

    //用于获取当前页面的标准化路径，包括路径名和查询参数
    private getNormalizedPath(): string {
        return `${window.location.pathname}${window.location.search}`;
    }

    private async sendDurationData(data: DurationData) {
        reportQueue.addTask(async () => {
            try {
                await pushDuration(data);
                console.log("[队列] 停留时长上报成功");
            } catch (error) {
                console.error("[队列] 停留时长上报失败:", error);
            }
        });
    }
}