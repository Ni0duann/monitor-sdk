// userAgentUtils.ts
export const getOperatingSystem = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Windows') !== -1) return 'Windows';
    if (userAgent.indexOf('Mac') !== -1) return 'MacOS';
    if (userAgent.indexOf('Linux') !== -1) return 'Linux';
    if (userAgent.indexOf('Android') !== -1) return 'Android';
    if (userAgent.indexOf('iOS') !== -1) return 'iOS';
    return 'Unknown';
};

export const getBrowserName = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Chrome') !== -1) {
        return 'Chrome';
    } else if (userAgent.indexOf('Firefox') !== -1) {
        return 'Firefox';
    } else if (userAgent.indexOf('Safari') !== -1) {
        // 需要排除 Chrome，因为 Chrome 的 userAgent 中也包含 Safari
        if (userAgent.indexOf('Chrome') === -1) {
            return 'Safari';
        }
    } else if (userAgent.indexOf('Edge') !== -1) {
        return 'Edge';
    } else if (userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident/') !== -1) {
        return 'Internet Explorer';
    }
    return 'Unknown';
};

export const getDeviceType = () => {
    const userAgent = navigator.userAgent;
    if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/.test(userAgent)) {
        return 'Mobile';
    }
    return 'Desktop';
};