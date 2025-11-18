import type { Performance } from '@/api/error-report/error-report.type';

/**
 * 格式化时间戳为可读格式
 */
export function formatTimestamp(timestamp: number | string | undefined): string {
  if (!timestamp) return '未知';

  const date = new Date(typeof timestamp === 'string' ? parseInt(timestamp) : timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * 格式化性能指标值
 */
export function formatMetricValue(metricName: string, value: number | string | null | undefined): string {
  // 转换为数字类型，处理字符串、null、undefined等情况
  const numValue = typeof value === 'string' ? parseFloat(value) : (value || 0);
  
  // 检查是否为有效数字
  if (isNaN(numValue) || !isFinite(numValue)) {
    return '—';
  }

  if (metricName === 'CLS') {
    return numValue.toFixed(3);
  }
  if (['FCP', 'LCP', 'TTFB'].includes(metricName)) {
    return `${(numValue / 1000).toFixed(2)}s`;
  }
  if (metricName === 'INP') {
    return `${numValue.toFixed(0)}ms`;
  }
  return numValue.toFixed(2);
}

/**
 * 获取评级颜色
 */
export function getRatingColor(rating?: string): string {
  switch (rating) {
    case 'good':
      return 'green';
    case 'needs-improvement':
      return 'orange';
    case 'poor':
      return 'red';
    default:
      return 'default';
  }
}

/**
 * 获取评级文本
 */
export function getRatingText(rating?: string): string {
  switch (rating) {
    case 'good':
      return '良好';
    case 'needs-improvement':
      return '需改进';
    case 'poor':
      return '差';
    default:
      return '未知';
  }
}

/**
 * 获取指标名称显示
 */
export function getMetricNameDisplay(metricName: string): string {
  const nameMap: Record<string, string> = {
    FCP: '首次内容绘制 (FCP)',
    LCP: '最大内容绘制 (LCP)',
    CLS: '累积布局偏移 (CLS)',
    INP: '交互延迟 (INP)',
    TTFB: '首字节时间 (TTFB)'
  };
  return nameMap[metricName] || metricName;
}

/**
 * 计算性能指标统计
 */
export function calculatePerformanceStats(data: Performance[]) {
  const stats: Record<string, { total: number; count: number; ratings: Record<string, number> }> = {};

  data.forEach(item => {
    const metric = item.metricName;
    if (!stats[metric]) {
      stats[metric] = {
        total: 0,
        count: 0,
        ratings: { good: 0, 'needs-improvement': 0, poor: 0 }
      };
    }

    // 安全地转换为数字
    const numValue = typeof item.value === 'string' ? parseFloat(item.value) : (item.value || 0);
    if (!isNaN(numValue) && isFinite(numValue)) {
      stats[metric].total += numValue;
      stats[metric].count += 1;
    }

    if (item.rating) {
      stats[metric].ratings[item.rating] = (stats[metric].ratings[item.rating] || 0) + 1;
    }
  });

  const result: Record<string, { avg: number; ratings: Record<string, number>; count: number }> = {};

  Object.keys(stats).forEach(metric => {
    const stat = stats[metric];
    result[metric] = {
      avg: stat.count > 0 ? stat.total / stat.count : 0,
      ratings: stat.ratings,
      count: stat.count
    };
  });

  return result;
}

