// navigation.ts
export function observeNavigationTiming(metrics: Record<string, any>, observers: PerformanceObserver[]): void {
    try {
        const navigationObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries() as PerformanceNavigationTiming[];
            entries.forEach((entry) => {
                if (entry.entryType === "navigation") {
                    if (!metrics.navigation) {
                        metrics.navigation = {};
                    }
                    const ttfb = entry.responseStart - entry.requestStart; // 首次字节时间
                    Object.assign(metrics, { 
                    // 首次字节时间（Time To First Byte）：从浏览器发送请求到接收到服务器第一个字节响应所花费的时间，即响应开始时间减去请求开始时间
                    ttfb,
                    });
                    console.log("导航性能数据:", metrics);
                }
            });
        });
        navigationObserver.observe({ type: "navigation", buffered: true });
        observers.push(navigationObserver);
    } catch (error) {
        console.error("导航性能监控初始化失败:", error);
    }
}
