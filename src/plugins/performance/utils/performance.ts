import { observeLCP } from "./lcp";
import { observePaint } from "./fcp&fp";
import { observeResourceLoading } from "./resource";
import { observeNavigationTiming } from "./navagation";
import { checkWhiteScreenWithFeedback } from "./whitescreen";
import { PVTracker } from "./pvuv";

export class PerformanceMonitor {
  private lcpMetrics: { lcp?: any } = {};
  private PaintMetrics: { fcp?: any; fp?: any } = {};
  private resourceMetrics: { resources?: any[] } = {};
  private navigationMetrics: Record<string, any> = {};
  private observers: PerformanceObserver[] = [];
  private whiteScreenCount = 0; // 白屏计数
  private pvTracker: PVTracker; // 添加 PVTracker 实例

  constructor() {
    this.pvTracker = new PVTracker(); // 初始化 PVTracker
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
    lcp?: any;
    fcp?: any;
    fp?: any;
    resources?: any[];
    navigation?: any;
    whiteScreenCount?: number;
  } {
    return {
      fcp: this.PaintMetrics.fcp,
      fp: this.PaintMetrics.fp,
      lcp: this.lcpMetrics.lcp,
      resources: this.resourceMetrics.resources || [],
      navigation: this.navigationMetrics,
      whiteScreenCount: this.whiteScreenCount, // 白屏计数
    };
  }
}

export default PerformanceMonitor; // 确保默认导出
