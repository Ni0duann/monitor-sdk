import { observeLCP } from "./lcp";
import { observePaint } from "./fcp&fp";
import { observeResourceLoading } from "./resource";
import { observeNavigationTiming } from "./navagation";
import { checkWhiteScreenWithFeedback } from "./whitescreen";

export class PerformanceMonitor {
  private lcpMetrics: { lcp?: any } = {};
  private PaintMetrics: { fcp?: any[] } = {};
  private resourceMetrics: { resources?: any[] } = {};
  private navigationMetrics: Record<string, any> = {};
  private observers: PerformanceObserver[] = [];
  private whiteScreenCount = 0; // 白屏计数

  constructor() {
    this.init();
  }

  private init(): void {
    observeLCP(this.lcpMetrics, this.observers);
    observePaint(this.PaintMetrics, this.observers);
    observeResourceLoading(this.resourceMetrics, this.observers);
    observeNavigationTiming(this.navigationMetrics, this.observers);
    checkWhiteScreenWithFeedback();
  }

  public getMetrics(): {
    // 修改返回结构为对象，方便后续上报
    lcp: any;
    Paint: any[];
    resources: any[];
    navigation: any;
    whiteScreenCount: number;
  } {
    return {
      lcp: this.lcpMetrics,
      Paint: this.PaintMetrics.fcp || [], // paint内部存储的是数组，包含fp和fcp
      resources: this.resourceMetrics.resources || [],
      navigation: this.navigationMetrics,
      whiteScreenCount: this.whiteScreenCount, // 白屏计数
    };
  }
}

export default PerformanceMonitor; // 确保默认导出
