# Monitor SDK

前端监控 SDK

## 功能特性

 - [ ] 监控 JavaScript 异常
 - [ ] 监控 Promise 异常 
 - [ ] 监控 console.error 异常
 - [ ] 监控 resource 异常 
 - [ ] 监控跨域异常 
 - [ ] 监控白屏异常 
 - [ ] 监控接口异常 
 - [ ] 监控页面路由跳转 
 - [ ] 监控页面性能 
 - [ ] 监控网站信息 
 - [ ] 监控用户行为

## 安装
<font color="red"> 已经发布，下面这行命令可以安装 </font>

```npm install monitor-trace ```

## 环境测试
```
  pnpm run build
  node test/test.js
  
```

## 使用方法
```typescript jacscript
import Monitor from 'monitor-trace';

const monitor = new Monitor({
  // 配置项
});
```

## 项目架构
monitor-sdk/</br>
├── src/</br>
│   ├── index.ts              // 入口文件</br>
│   ├── api/                 // API相关</br>
│   │   ├── commonInfo.ts    // 通用信息</br>
│   │   ├── index.ts         // API入口</br>
│   │   └── interface.ts     // 接口定义</br>
│   ├── core/                // 核心功能</br>
│   │   ├── monitor.ts       // 监控器主类</br>
│   │   └── types.ts         // 类型定义</br>
│   ├── plugins/             // 插件模块</br>
│   │   └── performance/    // 性能监控</br>
│   │       ├── index.ts    // 性能监控入口</br>
│   │       ├── types.ts    // 类型定义</br>
│   │       └── utils/      // 工具函数</br>
│   │           ├── duration.ts</br>
│   │           ├── fcp&fp.ts</br>
│   │           ├── lcp.ts</br>
│   │           ├── navagation.ts</br>
│   │           ├── performance.ts</br>
│   │           ├── pvuv.ts</br>
│   │           ├── resource.ts</br>
│   │           └── whitescreen.ts</br>
│   ├── report/              // 数据上报</br>
│   │   ├── index.ts        // 上报入口</br>
│   │   └── types.ts        // 类型定义</br>
├── test/                   // 测试文件</br>
├── examples/               // 使用示例</br>
└── docs/                  // 文档</br>
