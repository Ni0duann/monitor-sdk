// 数据类型接口定义

// export interface PerformanceData {
//     performance: {
//         ttfb: number;
//         lcp: number;
//         fcp: number;
//         whiteScreenCount?: number;
//     };
//     errors?: object;
// }

export interface PerformanceData {
    fcp?: number;
    fp?: number;
    lcpRenderTime?: number;
    redirectCount?: number;
    ttfb?: number;
    event?: any[]; // 事件队列
}

export interface QueryParams {
    limit?: number;
    rangeTime?: number;
    startTime?: string;
    endTime?: string;
}

export interface WhiteScreenReport {
    pageUrl: string;
    browser?: string;
    os?: string;
    device_type?: string;
}

export interface FlowDataParams {
    pagePath: string;
    dataType: 'pv' | 'uv';
    rangeTime?: number;
}

export interface DurationData {
    pagePath: string;
    duration: number;
}