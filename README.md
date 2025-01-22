# Monitor SDK

前端监控 SDK

## 安装
<font color="red"> 已经发布，下面这行命令可以安装 </font>

```npm i @ni0duann/monitor-sdk ```

## 环境测试
```
  pnpm run build
  node test/test.js
```

## 使用方法
```typescript jacscript
import Monitor from 'monitor-sdk';

const monitor = new Monitor({
  // 配置项
});
```

## 功能特性
- 错误监控
- 性能监控
- 用户行为监控

## 项目架构
monitor-sdk/
├── src/
│   ├── index.ts              // 入口文件
│   ├── core/                 // 核心功能
│   │   ├── monitor.ts       // 监控器主类
│   │   └── types.ts         // 类型定义
│   ├── plugins/             // 插件模块
│   │   ├── error/          // 错误监控
│   │   ├── performance/    // 性能监控
│   │   └── behavior/       // 用户行为监控
│   └── utils/              // 工具函数
├── test/                   // 测试文件
├── examples/               // 使用示例
└── docs/                  // 文档
