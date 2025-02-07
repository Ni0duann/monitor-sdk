export function observeFCP(metrics: { fcp?: any[] }, observers: PerformanceObserver[]): void {
    try {
        const paintObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries() as PerformanceEntry[];
            metrics.fcp = [];

            entries.forEach((entry) => {
                if (entry.entryType === "paint") {
                    const paintMetric = {
                        name: entry.name,
                        startTime: entry.startTime,               
                    };
                    metrics.fcp!.push(paintMetric);
                    // console.log(
                    //     `The time to ${entry.name} was ${entry.startTime} milliseconds.`
                    // );
                    // 打印 LCP 数据到控制台
                    console.log("FCP 数据:", metrics.fcp);
                }
            });
        });

        paintObserver.observe({ type: "paint", buffered: true });
        observers.push(paintObserver);
    } catch (error) {
        console.error("Paint 性能监控初始化失败:", error);
    }
}