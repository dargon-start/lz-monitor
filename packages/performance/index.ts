import { EVENTTYPES } from '@lz-monitor/common';
import { transportData } from '@lz-monitor/core';
import { Metric, onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

/**
 * 将 web-vitals 的 metric 转换为 ReportData 格式
 * @param metric web-vitals 收集的性能指标
 */
function transformMetricToReportData(metric: Metric) {
  return {
    type: EVENTTYPES.PERFORMANCE,
    name: metric.name, // 指标名称：FCP、LCP、CLS、INP、TTFB
    value: metric.value, // 指标数值
    rating: metric.rating, // 评级：'good' | 'needs-improvement' | 'poor'
    time: Date.now() // 发生时间
  };
}

/**
 * 收集并上报性能指标
 * 使用 web-vitals 库收集 FCP、LCP、CLS、INP、TTFB 等性能指标，并上报到服务端
 */
export default function collectPerformance() {
  // 收集首次内容绘制 (First Contentful Paint)
  onFCP((metric: Metric) => {
    const reportData = transformMetricToReportData(metric);
    transportData.send(reportData);
  });

  // 收集累积布局偏移 (Cumulative Layout Shift)
  onCLS((metric: Metric) => {
    const reportData = transformMetricToReportData(metric);
    transportData.send(reportData);
  });

  // 收集交互延迟 (Interaction to Next Paint)
  onINP((metric: Metric) => {
    const reportData = transformMetricToReportData(metric);
    transportData.send(reportData);
  });

  // 收集最大内容绘制 (Largest Contentful Paint)
  onLCP((metric: Metric) => {
    const reportData = transformMetricToReportData(metric);
    transportData.send(reportData);
  });

  // 收集首字节时间 (Time To First Byte)
  onTTFB((metric: Metric) => {
    const reportData = transformMetricToReportData(metric);
    transportData.send(reportData);
  });
}
