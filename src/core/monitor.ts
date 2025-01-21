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
    console.log('初始化监听');
    
    // 可以添加其他初始化逻辑
  }

}
