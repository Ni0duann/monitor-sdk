import { observeLCP } from './lcp';

export class performance {
  private metrics: { lcp?: any } = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.init();
  }

  private init(): void {
    observeLCP(this.metrics, this.observers);
  }

  public getMetrics(): { lcp?: any } {
    return this.metrics;
  }
}
