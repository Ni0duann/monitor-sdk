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
monitor-sdk/</br>
├── src/</br>
│   ├── index.ts              // 入口文件</br>
│   ├── core/                 // 核心功能</br>
│   │   ├── monitor.ts       // 监控器主类</br>
│   │   └── types.ts         // 类型定义</br>
│   ├── plugins/             // 插件模块</br>
│   │   ├── error/          // 错误监控</br>
│   │   ├── performance/    // 性能监控</br>
│   │   └── behavior/       // 用户行为监控</br>
│   └── utils/              // 工具函数</br>
├── test/                   // 测试文件</br>
├── examples/               // 使用示例</br>
└── docs/                  // 文档</br>
