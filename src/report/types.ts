export interface reportDataInterface {
    url: string;
    data: dataInterface;
    time?: Date;
    delay?: any;
}

// {
//     "event": [];
//     "fcp": 507.6999999997206,
//     "fp": 507.6999999997206,
//     "lcp": {
//       "name": "",
//       "startTime": 507.6999999997206,
//       "renderTime": 507.6999999997206,
//       "loadTime": 0,
//       "size": 6624,
//       "id": "",
//       "url": ""
//     },
//     "resources": [
//       {
//         "name": "http://localhost:5173/vite.svg",
//         "startTime": 402.1999999997206,
//         "requestStart": 403,
//         "responseEnd": 405,
//         "duration": 2.8000000002793968,
//         "initiatorType": "img"
//       }
//     ],
//     "navigation": {
//       "navigation": {},
//       "redirectCount": 0,
//       "fetchStart": 2.6999999997206032,
//       "domainLookupStart": 2.6999999997206032,
//       "domainLookupEnd": 2.6999999997206032,
//       "connectStart": 2.6999999997206032,
//       "connectEnd": 2.6999999997206032,
//       "secureConnectionStart": 0,
//       "requestStart": 5.699999999720603,
//       "responseStart": 17.899999999906868,
//       "responseEnd": 18.899999999906868,
//       "domInteractive": 317.6999999997206,
//       "domContentLoadedEventStart": 401.79999999981374,
//       "domContentLoadedEventEnd": 402.39999999990687,
//       "domComplete": 511.09999999962747,
//       "loadEventStart": 511.09999999962747,
//       "loadEventEnd": 511.1999999997206,
//       "dnsLookupTime": 0,
//       "tcpConnectionTime": 0,
//       "ttfb": 12.200000000186265,
//       "domContentLoadedTime": 0.6000000000931323,
//       "loadTime": 0.10000000009313226
//     },
//     "whiteScreenCount": 0
//   }

export interface dataInterface {
    event: any[];
    fcp: number;
    fp: number;
    lcp: {
        name: string;
        startTime: number;
        renderTime: number;
        loadTime: number;
        size: number;
        id: string;
        url: string;
    };
    resources: {
        name: string;
        startTime: number;
        requestStart: number;
        responseEnd: number;
        duration: number;
        initiatorType: string;
    }[];
    navigation: {
        navigation: any;
        redirectCount: number;
        fetchStart: number;
        domainLookupStart: number;
        domainLookupEnd: number;
        connectStart: number;
        connectEnd: number;
        secureConnectionStart: number;
        requestStart: number;
        responseStart: number;
        responseEnd: number;
        domInteractive: number;
        domContentLoadedEventStart: number;
        domContentLoadedEventEnd: number;
        domComplete: number;
        loadEventStart: number;
        loadEventEnd: number;
        dnsLookupTime: number;
        tcpConnectionTime: number;
        ttfb: number;
        domContentLoadedTime: number;
        loadTime: number;
    };
    whiteScreenCount: number;
}