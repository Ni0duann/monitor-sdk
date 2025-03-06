import { observeLCP } from "./lcp";
import { observePaint } from "./fcp&fp";
import { observeResourceLoading } from "./resource";
import { observeNavigationTiming } from "./navagation";
import { checkWhiteScreenWithFeedback } from "./whitescreen";
import { PVTracker } from "./pvuv";
import { DurationTracker } from "./duration";

export class PerformanceMonitor {
  private lcpMetrics: { lcp?: { renderTime?: number } } = {};
  private PaintMetrics: { fcp?: number; fp?: number } = {};
  private resourceMetrics: { resources?: any[] } = {};
  private navigationMetrics: { redirectCount?: number; ttfb?: number } = {};
  private observers: PerformanceObserver[] = [];
  // private whiteScreenCount = 0; // 白屏计数
  private pvTracker: PVTracker; // 添加 PVTracker 实例
  private durationTracker: DurationTracker; // 添加 DurationTracker 实例

  constructor() {
    this.pvTracker = new PVTracker(); // 初始化 PVTracker
    this.durationTracker = new DurationTracker(); // 初始化 DurationTracker
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
    fcp?: number;
    fp?: number;
    lcpRenderTime?: number;
    redirectCount?: number;
    ttfb?: number;
    // resources?: any[];
    // navigation?: any;
    // whiteScreenCount?: number;
  } {
    return {
      fcp: this.PaintMetrics.fcp,
      fp: this.PaintMetrics.fp,
      lcpRenderTime: this.lcpMetrics.lcp?.renderTime,
      redirectCount: this.navigationMetrics.redirectCount,
      ttfb: this.navigationMetrics.ttfb,
      // resources: this.resourceMetrics.resources || [],
      // navigation: this.navigationMetrics,
      // whiteScreenCount: this.whiteScreenCount, // 白屏计数
    };
  }
}

export default PerformanceMonitor; // 确保默认导出
