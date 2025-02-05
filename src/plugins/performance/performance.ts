import { observeLCP } from './lcp';
import { observeFCP } from './fcp';
import { observeResourceLoading } from './resource';
import { observeNavigationTiming } from './navagation'; 
import { checkWhiteScreenWithFeedback } from './whitescreen'

export class PerformanceMonitor {
  private lcpMetrics: { lcp?: any } = {};
  private fcpMetrics: { fcp?: any[] } = {};
  private resourceMetrics: { resources?: any[] } = {};
  private navigationMetrics: Record<string, any> = {};
  private observers: PerformanceObserver[] = [];
  private whiteScreenCount = 0; // 白屏计数
  private pv=0
  private uv=0

  constructor() {
    this.init();
  }


  private init(): void {
    observeLCP(this.lcpMetrics, this.observers);
    observeFCP(this.fcpMetrics, this.observers);
    observeResourceLoading(this.resourceMetrics, this.observers);
    observeNavigationTiming(this.navigationMetrics, this.observers);
    checkWhiteScreenWithFeedback();
  }

  public getMetrics(): { // 修改返回结构为对象，方便后续上报
    lcp: any;
    fcp: any[];
    resources: any[];
    navigation: any;
    whiteScreenCount: number;
  } {
    return {
      lcp: this.lcpMetrics,
      fcp: this.fcpMetrics.fcp || [], // fcpMetrics内部存储的是数组，包含fp和fcp
      resources: this.resourceMetrics.resources || [],
      navigation: this.navigationMetrics,
      whiteScreenCount: this.whiteScreenCount // 白屏计数
    };
  }

}

export default PerformanceMonitor; // 确保默认导出