// 将接口定义导出
export interface PerformanceMetrics {
  // 导航计时
  navigation: {
    pageLoadTime: number;
    domContentLoadTime: number;
    redirectTime: number;
    dnsTime: number;
    tcpTime: number;
    ttfb: number; // Time to First Byte
    resourceTime: number;
    domParsingTime: number;
  };
  // 资源加载
  resources: {
    name: string;
    duration: number;
    transferSize: number;
    type: string;
  }[];
  // First Paint 指标
  paint: {
    FP: number; // First Paint
    FCP: number; // First Contentful Paint
  };
}

export class ModernPerformanceMonitor {
  private metrics: PerformanceMetrics;
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.metrics = {
      navigation: {
        pageLoadTime: 0,
        domContentLoadTime: 0,
        redirectTime: 0,
        dnsTime: 0,
        tcpTime: 0,
        ttfb: 0,
        resourceTime: 0,
        domParsingTime: 0,
      },
      resources: [],
      paint: {
        FP: 0,
        FCP: 0,
      },
    };
  }

  private observeNavigation(): void {
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const navigationEntry = entries[0] as PerformanceNavigationTiming;

        this.metrics.navigation = {
          pageLoadTime:
            navigationEntry.loadEventEnd - navigationEntry.startTime,
          domContentLoadTime:
            navigationEntry.domContentLoadedEventEnd -
            navigationEntry.startTime,
          redirectTime:
            navigationEntry.redirectEnd - navigationEntry.redirectStart,
          dnsTime:
            navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
          tcpTime: navigationEntry.connectEnd - navigationEntry.connectStart,
          ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
          resourceTime:
            navigationEntry.responseEnd - navigationEntry.responseStart,
          domParsingTime:
            navigationEntry.domComplete - navigationEntry.responseEnd,
        };
      });

      navigationObserver.observe({ entryTypes: ["navigation"] });
      this.observers.push(navigationObserver);
    } catch (error) {
      console.error("导航性能监控初始化失败:", error);
    }
  }

  private observeResources(): void {
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceResourceTiming[];

        this.metrics.resources = entries.map((entry) => ({
          name: entry.name,
          duration: entry.duration,
          transferSize: entry.transferSize,
          type: entry.initiatorType,
        }));
      });

      resourceObserver.observe({ entryTypes: ["resource"] });
      this.observers.push(resourceObserver);
    } catch (error) {
      console.error("资源性能监控初始化失败:", error);
    }
  }

  private observePaint(): void {
    try {
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry) => {
          const paintEntry = entry as PerformancePaintTiming;
          if (paintEntry.name === "first-paint") {
            this.metrics.paint.FP = paintEntry.startTime;
          }
          if (paintEntry.name === "first-contentful-paint") {
            this.metrics.paint.FCP = paintEntry.startTime;
          }
        });
      });

      paintObserver.observe({ entryTypes: ["paint"] });
      this.observers.push(paintObserver);
    } catch (error) {
      console.error("绘制性能监控初始化失败:", error);
    }
  }

  public start(): void {
    if (!window.PerformanceObserver) {
      console.warn("当前浏览器不支持 Performance Observer API");
      return;
    }

    this.observeNavigation();
    this.observeResources();
    this.observePaint();
  }

  public stop(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }

  public getMetrics(): PerformanceMetrics {
    return this.metrics;
  }

  public logMetrics(): void {
    console.group("性能监控指标");

    // 输出导航计时指标
    console.group("导航计时");
    Object.entries(this.metrics.navigation).forEach(([key, value]) => {
      console.log(`${key}: ${value.toFixed(2)}ms`);
    });
    console.groupEnd();

    // 输出资源加载指标
    console.group("资源加载");
    this.metrics.resources.forEach((resource) => {
      console.log(`${resource.name}:
          类型: ${resource.type}
          加载时间: ${resource.duration.toFixed(2)}ms
          传输大小: ${(resource.transferSize / 1024).toFixed(2)}KB`);
    });
    console.groupEnd();

    // 输出绘制指标
    console.group("绘制性能");
    Object.entries(this.metrics.paint).forEach(([key, value]) => {
      console.log(`${key}: ${value.toFixed(2)}ms`);
    });
    console.groupEnd();

    console.groupEnd();
  }

  public init(): void {
    this.start();
    this.logMetrics();
  }
}

// 导出类和实例
export const ModernPerformanceMonitorTest = new ModernPerformanceMonitor();
