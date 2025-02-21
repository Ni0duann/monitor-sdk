//导入类型定义
import { MonitorOptions, MonitorEvent } from './types';
import reportData from '../report/index'
import PerformanceMonitor from '@/plugins/performance/index';

export class Monitor {
  private options: MonitorOptions;
  private performanceMonitor: PerformanceMonitor; // 持有性能监控实例
  private queue: MonitorEvent[] = []; // 事件队列
  // private pvTracker?: PVTracker; // 添加PV追踪实例
  // private durationTracker!: DurationTracker; // 添加 DurationTracker 实例

  constructor(options: MonitorOptions) {
    this.options = {
      delay: 1000,
      ...options
    };

    // 创建性能监控实例
    this.performanceMonitor = new PerformanceMonitor(); 

    this.init();
  }

  //初始化会发送数据到数据库
  private init(): void {
    console.log('初始化监听。。。');

    // 延迟上报（确保性能监控数据已收集）
    setTimeout(async () => {

      // 合并各性能监控数据
      const reportPvuv = {
        performance: this.performanceMonitor.getMetrics(),
        event: this.queue
      };
      
      reportData({
        url: this.options.reportUrl,
        data: reportPvuv, // 包含性能数据+其他数据
        delay: 0 // 立即发送（外层已有setTimeout）
      });

    }, this.options.delay);


    // 其他初始化逻辑（如错误监听）
  }


}
