import { observeLCP } from './lcp';
import { observeFCP } from './fcp';
import { observeResourceLoading } from './resource';
import { observeNavigationTiming } from './navagation'; // 修正拼写错误

export class PerformanceMonitor {
  private lcpMetrics: { lcp?: any } = {};
  private fcpMetrics: { fcp?: any[] } = {};
  private resourceMetrics: { resources?: any[] } = {};
  private navigationMetrics: { navigation?: any } = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.init();
  }

  private init(): void {
    observeLCP(this.lcpMetrics, this.observers);
    observeFCP(this.fcpMetrics, this.observers);
    observeResourceLoading(this.resourceMetrics, this.observers);
    observeNavigationTiming(this.navigationMetrics, this.observers);

  }

  public getMetrics(): [
    { lcp?: any },
    { fcp?: any[] },
    { resources?: any[] },
    { navigation?: any },

  ] {
    return [
      this.lcpMetrics,
      this.fcpMetrics,
      this.resourceMetrics,
      this.navigationMetrics,
    ];
  }

}