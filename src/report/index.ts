// 定义数据上报函数
function reportData(url: string, data: any, delay: number = 0) {
    setTimeout(() => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data successfully reported:', data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }, delay);
}

// 示例调用
// const endpoint = 'https://example.com/report';
// const data = {
//     event: 'click',
//     timestamp: Date.now(),
//     additionalData: 'some data'
// };
// const delay = 5000; // 延时5秒上报

// reportData(endpoint, data, delay);
