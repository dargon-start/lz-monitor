import type { Performance } from '@/api/error-report/error-report.type';
import { Card, Checkbox, Space } from 'antd';
import dayjs from 'dayjs';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useMemo, useState } from 'react';
import { formatMetricValue, getMetricNameDisplay } from '../utils';

interface TrendChartProps {
  data: Performance[];
}

// 支持的指标
const METRIC_OPTIONS = [
  { label: 'FCP', value: 'FCP' },
  { label: 'LCP', value: 'LCP' },
  { label: 'CLS', value: 'CLS' },
  { label: 'INP', value: 'INP' },
  { label: 'TTFB', value: 'TTFB' }
];

// 指标颜色配置
const METRIC_COLORS: Record<string, string> = {
  FCP: '#1890ff', // 蓝色
  LCP: '#52c41a', // 绿色
  CLS: '#faad14', // 橙色
  INP: '#f5222d', // 红色
  TTFB: '#722ed1' // 紫色
};

export default function TrendChart({ data }: TrendChartProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    METRIC_OPTIONS.map(option => option.value)
  );

  const parseTimestamp = (time?: number | string | null) => {
    if (time === null || time === undefined) return null;
    const str = time.toString();
    if (/^\d{13}$/.test(str)) return Number(str);
    if (/^\d{10}$/.test(str)) return Number(str) * 1000;
    if (/^\d{14}$/.test(str)) return dayjs(str, 'YYYYMMDDHHmmss').valueOf();
    const parsed = dayjs(str);
    return parsed.isValid() ? parsed.valueOf() : null;
  };

  const chartOption = useMemo(() => {
    if (!data || data.length === 0) {
      return { option: null, hasSeries: false };
    }

    const series = selectedMetrics.map(metricKey => {
      const displayName = getMetricNameDisplay(metricKey);
      const seriesData = data
        .filter(item => item.metricName === metricKey)
        .map(item => {
          const timestamp = parseTimestamp(item.time);
          if (timestamp === null) return null;
          const numericValue =
            typeof item.value === 'string' ? parseFloat(item.value) : item.value || 0;
          if (isNaN(numericValue) || !isFinite(numericValue)) return null;
          return {
            name: displayName,
            value: [timestamp, Number(numericValue.toFixed(2))] as [number, number],
            metricKey,
            rawValue: numericValue
          };
        })
        .filter(Boolean)
        .sort((a: any, b: any) => a.value[0] - b.value[0]);

      return {
        metricKey,
        displayName,
        data: seriesData as Array<{ value: [number, number]; rawValue: number }>
      };
    });

    const filteredSeries = series
      .filter(item => item.data.length > 0)
      .map(item => ({
        name: item.displayName,
        type: 'line' as const,
        smooth: true,
        showSymbol: true,
        symbolSize: 6,
        emphasis: { focus: 'series' as const },
        lineStyle: {
          width: 2,
          color: METRIC_COLORS[item.metricKey] || undefined
        },
        itemStyle: {
          color: METRIC_COLORS[item.metricKey] || undefined
        },
        data: item.data
      }));

    const option: EChartsOption = {
      color: selectedMetrics.map(metric => METRIC_COLORS[metric] || '#1890ff'),
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: params => {
          const paramArray = Array.isArray(params) ? params : [params];
          const firstValue = paramArray[0]?.value as [number, number];
          const timeValue = Array.isArray(firstValue) ? firstValue[0] : undefined;
          const timeLabel = timeValue ? dayjs(timeValue).format('YYYY-MM-DD HH:mm:ss') : '';
          const lines = paramArray.map((param: any) => {
            const metricKey =
              METRIC_OPTIONS.find(m => getMetricNameDisplay(m.value) === param.seriesName)?.value ||
              '';
            const valueArr = param.value as [number, number];
            return `${param.marker}${param.seriesName}: ${formatMetricValue(
              metricKey,
              Array.isArray(valueArr) ? valueArr[1] : param.value
            )}`;
          });
          return `${timeLabel}<br/>${lines.join('<br/>')}`;
        }
      },
      legend: {
        data: filteredSeries.map(item => item.name),
        top: 0
      },
      grid: {
        left: 50,
        right: 20,
        top: 50,
        bottom: 40
      },
      xAxis: {
        type: 'time',
        name: '采集时间',
        axisLabel: {
          formatter: (value: number) => dayjs(value).format('MM-DD HH:mm')
        }
      },
      yAxis: {
        type: 'value',
        name: '指标值'
      },
      series: filteredSeries
    };

    return { option, hasSeries: filteredSeries.length > 0 };
  }, [data, selectedMetrics]);

  return (
    <Card
      title="性能指标趋势"
      extra={
        <Space>
          <span className="text-sm text-gray-500">选择指标：</span>
          <Checkbox.Group
            options={METRIC_OPTIONS}
            value={selectedMetrics}
            onChange={values => setSelectedMetrics(values as string[])}
          />
        </Space>
      }
      className="mb-6"
    >
      {chartOption.hasSeries ? (
        <ReactECharts option={chartOption.option as EChartsOption} style={{ height: 400 }} />
      ) : (
        <div className="h-[400px] flex items-center justify-center text-gray-400">
          暂无数据，请选择时间范围或调整筛选条件
        </div>
      )}
    </Card>
  );
}
