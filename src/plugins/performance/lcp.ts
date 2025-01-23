export function observeLCP(metrics: { lcp?: any }, observers: PerformanceObserver[]): void {
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceEntry[];

      entries.forEach((entry) => {
        if (entry.entryType === "largest-contentful-paint") {
          metrics.lcp = {
            startTime: entry.startTime,
            renderTime: (entry as any).renderTime,
            loadTime: (entry as any).loadTime,
            size: (entry as any).size,
            id: (entry as any).id,
            url: (entry as any).url,
          };
          // 打印 LCP 数据到控制台
          console.log("LCP 数据:", metrics.lcp);
        }
      });
    });

    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    observers.push(lcpObserver);
  } catch (error) {
    console.error("LCP 性能监控初始化失败:", error);
  }
}