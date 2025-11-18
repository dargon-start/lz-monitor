import type { Performance } from '@/api/error-report/error-report.type';
import { Card, Progress, Statistic, Tag } from 'antd';
import { useMemo } from 'react';
import { calculatePerformanceStats, formatMetricValue, getMetricNameDisplay } from '../utils';

interface OverviewCardsProps {
  data: Performance[];
}

// 性能指标配置
const METRIC_CONFIG: Record<
  string,
  { name: string; unit: string; thresholds: { good: number; needsImprovement: number } }
> = {
  FCP: {
    name: '首次内容绘制',
    unit: 's',
    thresholds: { good: 1.8, needsImprovement: 3.0 }
  },
  LCP: {
    name: '最大内容绘制',
    unit: 's',
    thresholds: { good: 2.5, needsImprovement: 4.0 }
  },
  CLS: {
    name: '累积布局偏移',
    unit: '',
    thresholds: { good: 0.1, needsImprovement: 0.25 }
  },
  INP: {
    name: '交互延迟',
    unit: 'ms',
    thresholds: { good: 200, needsImprovement: 500 }
  },
  TTFB: {
    name: '首字节时间',
    unit: 's',
    thresholds: { good: 0.8, needsImprovement: 1.8 }
  }
};

export default function OverviewCards({ data }: OverviewCardsProps) {
  const stats = useMemo(() => calculatePerformanceStats(data), [data]);

  // 获取评级分布百分比
  const getRatingPercentages = (ratings: Record<string, number>, total: number) => {
    if (total === 0) return { good: 0, needsImprovement: 0, poor: 0 };
    return {
      good: ((ratings.good || 0) / total) * 100,
      needsImprovement: ((ratings['needs-improvement'] || 0) / total) * 100,
      poor: ((ratings.poor || 0) / total) * 100
    };
  };

  // 渲染单个指标卡片
  const renderMetricCard = (
    metricName: string,
    stat: { avg: number; ratings: Record<string, number>; count: number }
  ) => {
    const config = METRIC_CONFIG[metricName];
    if (!config) return null;

    const percentages = getRatingPercentages(stat.ratings, stat.count);
    const displayValue = formatMetricValue(metricName, stat.avg);

    return (
      <Card key={metricName} className="h-full">
        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-500 mb-1">{config.name}</div>
            <div className="text-xs text-gray-400 mb-2">{getMetricNameDisplay(metricName)}</div>
            <Statistic
              title="平均值"
              value={displayValue}
              valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
            />
            <div className="text-xs text-gray-400 mt-1">共 {stat.count} 条记录</div>
          </div>

          {stat.count > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-gray-600 mb-2">评级分布</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Tag color="green" className="m-0">
                      良好
                    </Tag>
                    <span className="text-gray-600">{stat.ratings.good || 0}</span>
                  </div>
                  <span className="text-gray-500">{percentages.good.toFixed(1)}%</span>
                </div>
                <Progress
                  percent={percentages.good}
                  strokeColor="#52c41a"
                  showInfo={false}
                  size="small"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Tag color="orange" className="m-0">
                      需改进
                    </Tag>
                    <span className="text-gray-600">{stat.ratings['needs-improvement'] || 0}</span>
                  </div>
                  <span className="text-gray-500">{percentages.needsImprovement.toFixed(1)}%</span>
                </div>
                <Progress
                  percent={percentages.needsImprovement}
                  strokeColor="#faad14"
                  showInfo={false}
                  size="small"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Tag color="red" className="m-0">
                      差
                    </Tag>
                    <span className="text-gray-600">{stat.ratings.poor || 0}</span>
                  </div>
                  <span className="text-gray-500">{percentages.poor.toFixed(1)}%</span>
                </div>
                <Progress
                  percent={percentages.poor}
                  strokeColor="#ff4d4f"
                  showInfo={false}
                  size="small"
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  // 获取所有指标名称
  const metricNames = Object.keys(METRIC_CONFIG);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">性能指标概览</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metricNames.map(metricName => {
          const stat = stats[metricName];
          if (!stat || stat.count === 0) {
            return (
              <Card key={metricName} className="h-full">
                <div className="text-sm text-gray-500 mb-1">{METRIC_CONFIG[metricName]?.name}</div>
                <div className="text-xs text-gray-400">暂无数据</div>
              </Card>
            );
          }
          return renderMetricCard(metricName, stat);
        })}
      </div>
    </div>
  );
}
