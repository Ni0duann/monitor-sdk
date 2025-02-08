import { observeLCP } from './lcp';
import { observeFCP } from './fcp';
import { observeResourceLoading } from './resource';
import { observeNavigationTiming } from './navagation';
import { checkWhiteScreenWithFeedback } from './whitescreen'

export class PerformanceMonitor {
  private lcpMetrics: { lcp?: any } = {};
  private fcpMetrics: { fcp?: any[] } = {};
  // private resourceMetrics: { resources?: any[] } = {};
  private navigationMetrics: Record<string, any> = {};
  private observers: PerformanceObserver[] = [];
  private whiteScreenCount = 0; // 白屏计数
  // private pv = 0
  // private uv = 0

  constructor() {
    this.init();
  }

  private init(): void {
    observeLCP(this.lcpMetrics, this.observers);
    observeFCP(this.fcpMetrics, this.observers);
    // observeResourceLoading(this.resourceMetrics, this.observers);
    observeNavigationTiming(this.navigationMetrics, this.observers);
    checkWhiteScreenWithFeedback(0.8, this);
  }

  public AddWhiteScreenCount() {
    this.whiteScreenCount++;
  }

  public getMetrics(): { // 修改返回结构为对象，方便后续上报
    lcpRenderTime: number | undefined
    fcpStartTime: number | undefined;
    ttfb: number | undefined;
    whiteScreenCount: number;
  } {

    //只发送lcp的RenderTime
    const lcpRenderTime = this.lcpMetrics.lcp ? this.lcpMetrics.lcp.renderTime : undefined;
    //只发送fcp的StartTime
    const fcpStartTime = this.fcpMetrics.fcp && this.fcpMetrics.fcp.length > 0? this.fcpMetrics.fcp[0].startTime: undefined;
    // 只发送navigation的ttfb
    const ttfb = this.navigationMetrics.ttfb; 

    return {
      lcpRenderTime,
      fcpStartTime,
      ttfb,
      whiteScreenCount: this.whiteScreenCount // 白屏计数
    };
  }
}

export default PerformanceMonitor; // 确保默认导出