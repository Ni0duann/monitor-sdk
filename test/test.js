// 引入打包后的 SDK
import { Monitor } from '../dist/index.esm.js';  // 使用 esm 版本

// 测试实例化
try {
  const monitor = new Monitor({
    delay: 1000
  });
  
  console.log('✅ SDK 加载成功');
  console.log('✅ 实例化成功');
  
  // 测试初始化
  if (monitor) {
    console.log('✅ 初始化成功');
  }

} catch (error) {
  console.error('❌ 测试失败:', error);
} 