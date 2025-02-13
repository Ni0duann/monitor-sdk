//发送停留时长数据到数据库 ✅ 等待修改通过监控路由跳转转入和转出来记录停留时长

// const sendDurationData = async (pagePath: string, duration: number) => {
//   try {
//     await fetch('http://localhost:5501/api/report-duration', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         pagePath,
//         duration
//       })
//     });
//   } catch (error) {
//     console.error('发送停留时长数据失败:', error);
//   }
// };;