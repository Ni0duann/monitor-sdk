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
  // private config: { reportUrl: string };
 

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
  } {
    return {
      lcp: this.lcpMetrics,
      fcp: this.fcpMetrics.fcp || [], // 假设fcpMetrics内部存储的是数组
      resources: this.resourceMetrics.resources || [],
      navigation: this.navigationMetrics
    };
  }

}

export default PerformanceMonitor; // 确保默认导出