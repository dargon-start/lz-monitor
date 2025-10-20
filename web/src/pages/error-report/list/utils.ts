import type { ErrorReport } from '@/api/error-report/error-report.type';

/**
 * 格式化时间戳为可读格式
 */
export function formatTimestamp(timestamp: number | string | undefined): string {
  if (!timestamp) return '未知';

  const date = new Date(typeof timestamp === 'string' ? parseInt(timestamp) : timestamp);
  return date.toLocaleString();
}

/**
 * 从 User Agent 中提取浏览器名称
 */
export function extractBrowserName(userAgent: string): string {
  if (!userAgent) return '未知';

  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';

  return '未知';
}

/**
 * 获取浏览器显示信息
 */
export function getBrowserDisplay(record: ErrorReport): string {
  const browserInfo = record.browserInfo;

  if (browserInfo?.name) {
    return `${browserInfo.name} ${browserInfo.version || ''}`.trim();
  }

  if ((record as any).user_agent) {
    return extractBrowserName((record as any).user_agent);
  }

  return '未知';
}

/**
 * 获取设备类型显示信息
 */
export function getDeviceDisplay(record: ErrorReport): string {
  const deviceInfo = record.deviceInfo;

  if (deviceInfo) {
    return (deviceInfo as any).deviceType || (deviceInfo as any).type || '未知设备';
  }

  return '未知';
}

/**
 * 获取设备详情提示信息
 */
export function getDeviceTooltip(record: ErrorReport): string {
  const deviceInfo = record.deviceInfo;

  if (!deviceInfo) return '设备信息未知';

  const deviceType = (deviceInfo as any).deviceType || (deviceInfo as any).type || '未知设备';
  const resolution =
    (deviceInfo as any).screenResolution || (deviceInfo as any).resolution || '未知';

  return `设备类型: ${deviceType}\n屏幕分辨率: ${resolution}`;
}

/**
 * 获取用户显示名称
 */
export function getUserDisplay(record: ErrorReport): string {
  return (record as any).user_name || record.userId || '未知用户';
}

/**
 * 获取页面信息显示
 */
export function getPageDisplay(record: ErrorReport): string {
  return (record as any).page_title || record.url || '未知页面';
}

/**
 * 获取页面详情提示信息
 */
export function getPageTooltip(record: ErrorReport): string {
  const pageTitle = (record as any).page_title || '未知';
  const url = record.url || '未知';
  return `页面: ${pageTitle}\nURL: ${url}`;
}
