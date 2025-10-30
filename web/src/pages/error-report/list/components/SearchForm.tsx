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

// 事件类型选项（新版）
const EVENT_TYPE_OPTIONS = [
  { label: 'JavaScript错误', value: 'error' },
  { label: 'Promise错误', value: 'unhandledrejection' },
  { label: '资源加载错误', value: 'resource' },
  { label: 'XHR请求', value: 'xhr' },
  { label: 'Fetch请求', value: 'fetch' },
  { label: '性能指标', value: 'performance' },
  { label: '白屏检测', value: 'whiteScreen' }
];

// 状态选项
const STATUS_OPTIONS = [
  { label: '正常', value: 'ok' },
  { label: '错误', value: 'error' }
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
            placeholder="搜索错误消息"
            value={formValues.message}
            onChange={e => updateFormValue({ message: e.target.value })}
            onPressEnter={handleSearch}
            allowClear
          />
          <Input
            placeholder="项目API密钥"
            value={formValues.apiKey}
            onChange={e => updateFormValue({ apiKey: e.target.value })}
            onPressEnter={handleSearch}
            allowClear
          />
          <Select
            placeholder="事件类型"
            value={formValues.type}
            onChange={value => updateFormValue({ type: value })}
            allowClear
            options={EVENT_TYPE_OPTIONS}
          />
          <Select
            placeholder="状态"
            value={formValues.status}
            onChange={value => updateFormValue({ status: value })}
            allowClear
            options={STATUS_OPTIONS}
          />

          {/* 第二行：用户和页面信息 */}
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
          <Input
            placeholder="页面URL"
            value={formValues.pageUrl}
            onChange={e => updateFormValue({ pageUrl: e.target.value })}
            onPressEnter={handleSearch}
            allowClear
          />
          <Input
            placeholder="错误文件名"
            value={formValues.fileName}
            onChange={e => updateFormValue({ fileName: e.target.value })}
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
