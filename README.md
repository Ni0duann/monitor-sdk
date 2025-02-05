<<<<<<< HEAD
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
=======
# monitor
>>>>>>> 1e1b4c3f445a1079a83136bffd14e3f475949f86
