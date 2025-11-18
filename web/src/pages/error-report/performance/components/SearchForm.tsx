import type { ErrorReportQuery } from '@/api/error-report/error-report.type';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { memo, useEffect, useState } from 'react';

const { RangePicker } = DatePicker;

interface SearchFormProps {
  query: ErrorReportQuery;
  onChange: (query: ErrorReportQuery) => void;
  onSearch: () => void;
  onReset: () => void;
}

// 性能指标选项
const METRIC_NAME_OPTIONS = [
  { label: 'FCP (首次内容绘制)', value: 'FCP' },
  { label: 'LCP (最大内容绘制)', value: 'LCP' },
  { label: 'CLS (累积布局偏移)', value: 'CLS' },
  { label: 'INP (交互延迟)', value: 'INP' },
  { label: 'TTFB (首字节时间)', value: 'TTFB' }
];

// 评级选项
const RATING_OPTIONS = [
  { label: '良好', value: 'good' },
  { label: '需改进', value: 'needs-improvement' },
  { label: '差', value: 'poor' }
];

// 设备类型选项
const DEVICE_TYPE_OPTIONS = [
  { label: 'PC', value: 'pc' },
  { label: '移动端', value: 'mobile' },
  { label: '平板', value: 'tablet' }
];

// 浏览器选项
const BROWSER_OPTIONS = [
  { label: 'Chrome', value: 'Chrome' },
  { label: 'Firefox', value: 'Firefox' },
  { label: 'Safari', value: 'Safari' },
  { label: 'Edge', value: 'Edge' }
];

// 操作系统选项
const OS_OPTIONS = [
  { label: 'Windows', value: 'Windows' },
  { label: 'macOS', value: 'macOS' },
  { label: 'Linux', value: 'Linux' },
  { label: 'Android', value: 'Android' },
  { label: 'iOS', value: 'iOS' }
];

export default memo(function SearchForm({ query, onChange, onSearch, onReset }: SearchFormProps) {
  // 使用内部状态管理表单值
  const [formValues, setFormValues] = useState<ErrorReportQuery>(query);

  // 当外部query变化时（如重置），同步到内部状态
  useEffect(() => {
    setFormValues(query);
  }, [query]);

  const updateFormValue = (updates: Partial<ErrorReportQuery>) => {
    setFormValues(prev => ({ ...prev, ...updates }));
  };

  // 点击搜索时才提交
  const handleSearch = () => {
    onChange(formValues);
    onSearch();
  };

  // 点击重置
  const handleReset = () => {
    onReset();
    // onReset会更新外部query，useEffect会同步到formValues
  };

  // 获取时间范围的dayjs值
  const dateRange =
    formValues.startTime && formValues.endTime
      ? [dayjs(formValues.startTime), dayjs(formValues.endTime)]
      : undefined;

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-start gap-4">
        {/* 左侧：搜索条件区域 */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* 第一行：基础信息 */}
          <Input
            placeholder="项目API密钥"
            value={formValues.apiKey}
            onChange={e => updateFormValue({ apiKey: e.target.value })}
            onPressEnter={handleSearch}
            allowClear
          />
          <Select
            placeholder="性能指标"
            value={formValues.metricName}
            onChange={value => updateFormValue({ metricName: value })}
            allowClear
            options={METRIC_NAME_OPTIONS}
          />
          <Select
            placeholder="评级"
            value={formValues.rating}
            onChange={value => updateFormValue({ rating: value })}
            allowClear
            options={RATING_OPTIONS}
          />
          <Input
            placeholder="页面URL"
            value={formValues.pageUrl}
            onChange={e => updateFormValue({ pageUrl: e.target.value })}
            onPressEnter={handleSearch}
            allowClear
          />

          {/* 第二行：用户和会话信息 */}
          <Input
            placeholder="用户ID"
            value={formValues.userId}
            onChange={e => updateFormValue({ userId: e.target.value })}
            onPressEnter={handleSearch}
            allowClear
          />
          <Input
            placeholder="会话ID (UUID)"
            value={formValues.uuid}
            onChange={e => updateFormValue({ uuid: e.target.value })}
            onPressEnter={handleSearch}
            allowClear
          />

          {/* 第三行：设备和浏览器信息 */}
          <Select
            placeholder="设备类型"
            value={formValues.deviceType}
            onChange={value => updateFormValue({ deviceType: value })}
            allowClear
            options={DEVICE_TYPE_OPTIONS}
          />
          <Select
            placeholder="浏览器"
            value={formValues.browser}
            onChange={value => updateFormValue({ browser: value })}
            allowClear
            options={BROWSER_OPTIONS}
          />
          <Select
            placeholder="操作系统"
            value={formValues.os}
            onChange={value => updateFormValue({ os: value })}
            allowClear
            options={OS_OPTIONS}
          />

          {/* 时间选择器 */}
          <RangePicker
            className="w-full"
            placeholder={['开始时间', '结束时间']}
            showTime
            value={dateRange as any}
            onChange={dates => {
              if (dates && dates[0] && dates[1]) {
                updateFormValue({
                  startTime: dates[0].valueOf(),
                  endTime: dates[1].valueOf()
                });
              } else {
                updateFormValue({
                  startTime: undefined,
                  endTime: undefined
                });
              }
            }}
          />
        </div>

        {/* 右侧：操作按钮区域 */}
        <div className="flex items-start pt-0">
          <Space direction="vertical">
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} block>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset} block>
              重置
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
});
