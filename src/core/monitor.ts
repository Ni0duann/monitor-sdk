//导入类型定义
import { MonitorOptions, MonitorEvent } from './types';
import reportData from '../report/index'
import PerformanceMonitor from '@/plugins/performance/index';
//引入接口定义
import { DurationData } from '@/api/interface';
//引入pvuv和停留时长监控类
import { PVTracker } from '@/plugins/performance/utils/pvuv';
import { DurationTracker } from '@/plugins/performance/utils/duration';
import { pushFlowData } from '@/api/index';

export class Monitor {
  private options: MonitorOptions;
  private performanceMonitor: PerformanceMonitor; // 持有性能监控实例
  private queue: MonitorEvent[] = []; // 事件队列
  private pvTracker?: PVTracker; // 添加PV追踪实例
  private durationTracker: DurationTracker; // 添加 DurationTracker 实例

  constructor(options: MonitorOptions) {
    this.options = {
      delay: 1000,
      ...options
    };
    this.performanceMonitor = new PerformanceMonitor(); // 创建性能监控实例
    this.init();

    // 初始化PV追踪
    this.pvTracker = new PVTracker({
      reportHandler: this.handlePVReport.bind(this)
    });

    // 初始化 DurationTracker
    this.durationTracker = new DurationTracker({
      reportHandler: this.handleDurationReport.bind(this)
    });
  }

  // 处理PV上报
  private async handlePVReport(pagePath: string) {
    try {
      await pushFlowData(pagePath, 'pv');
      console.log('PV数据上报成功');
    } catch (error) {
      console.error('PV数据上报失败:', error);
      // 可添加重试逻辑
    }
  }

  // 处理页面停留时长上报
  private async handleDurationReport(data: DurationData) {
    try {
      await pushFlowData(data.pagePath, 'duration', data.duration); // 假设 pushFlowData 支持上报停留时长
      console.log('页面停留时长数据上报成功');
    } catch (error) {
      console.error('页面停留时长数据上报失败:', error);
    }
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

      // 获取当前页面路径
      const pagePath = window.location.pathname + window.location.search;
      try {
        // 调用 pushFlowData 函数进行 PV 数据上报
        await pushFlowData(pagePath, 'pv');
        console.log('PV数据上报成功');
      } catch (error) {
        console.error('PV数据上报失败:', error);
      }
      // reportData({
      //   url: this.options.reportUrl,
      //   data: reportPvuv, // 包含性能数据+其他数据
      //   delay: 0 // 立即发送（外层已有setTimeout）
      // });
    }, this.options.delay);


    // 其他初始化逻辑（如错误监听）
  }


}
