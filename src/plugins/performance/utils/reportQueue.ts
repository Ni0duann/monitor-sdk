// src/utils/reportQueue.ts
type ReportTask = () => Promise<void>;

class ReportBatchQueue {
    private queue: ReportTask[] = [];
    private timer: ReturnType<typeof setTimeout> | null = null;
    private isProcessing = false;
    private lastTimerStart = 0;

    // 配置参数
    private readonly MAX_BATCH_SIZE = 5;
    private readonly FLUSH_INTERVAL = 5000; // 5秒固定间隔

    constructor() {
        this.startTimer();
        this.setupPageHideHandler();
    }

    // 核心方法：添加任务
    public addTask(task: ReportTask): void {
        this.queue.push(task);
        console.log(`[Queue] 任务已添加，当前队列大小：${this.queue.length}`);

        // 达到阈值立即触发
        if (this.queue.length >= this.MAX_BATCH_SIZE) {
            console.log(`[Queue] 达到阈值 ${this.MAX_BATCH_SIZE}，触发立即上报`);
            this.cancelTimer();
            this.flush();
        }
    }

    // 状态监控方法
    public get status() {
        return {
            queueSize: this.queue.length,
            nextFlushIn: this.timer ?
                Math.max(0, this.FLUSH_INTERVAL - (Date.now() - this.lastTimerStart)) : 0,
            isProcessing: this.isProcessing
        };
    }

    // 私有方法：启动定时器
    private startTimer(): void {
        if (!this.timer) {
            this.lastTimerStart = Date.now();
            this.timer = setTimeout(() => {
                console.log('[Queue] 定时器触发周期性上报');
                this.flush();
            }, this.FLUSH_INTERVAL);
        }
    }

    // 私有方法：取消定时器
    private cancelTimer(): void {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    // 核心方法：执行上报
    private async flush(): Promise<void> {
        if (this.isProcessing || this.queue.length === 0) {
            this.startTimer(); // 确保定时器持续运行
            return;
        }

        this.isProcessing = true;
        this.cancelTimer();

        try {
            const currentBatch = [...this.queue];
            this.queue = [];

            console.log(`[Queue] 开始批量上报，数量：${currentBatch.length}`);
            await Promise.all(currentBatch.map(task => task()));
            console.log(`[Queue] 批量上报完成`);
        } catch (error) {
            console.error('[Queue] 批量上报失败:', error);
            // 失败重试逻辑（可根据需要扩展）
        } finally {
            this.isProcessing = false;
            this.startTimer(); // 重启定时器
        }
    }

    // 页面关闭处理
    private setupPageHideHandler(): void {
        const handler = () => {
            if (this.queue.length > 0) {
                console.log('[Queue] 页面关闭前强制上报');
                this.flush();
            }
        };

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') handler();
        });
        window.addEventListener('pagehide', handler);
        window.addEventListener('beforeunload', handler);
    }
}

// 单例导出
export const reportQueue = new ReportBatchQueue();