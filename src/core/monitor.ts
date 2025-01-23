//导入类型定义
import { PerformanceMonitor } from '../plugins/performance';
import { MonitorOptions, MonitorEvent } from './types';

export class Monitor {
  
  private options: MonitorOptions;

  private queue: MonitorEvent[] = [];

  constructor(options: MonitorOptions) {
    this.options = {      // 默认延迟1秒
      ...options
    };
    this.init();
  }

  private init(): void {
    // 初始化错误监听
    console.log('初始化监听。。。');


    // 上报数据, 传入上报地址、数据、延迟时间
    // todo
    // reportData({ url: this.options.reportUrl, data: this.queue, delay: this.options.delay }); 
    
    // 初始化性能监控
    PerformanceMonitor.init();
  }

}
