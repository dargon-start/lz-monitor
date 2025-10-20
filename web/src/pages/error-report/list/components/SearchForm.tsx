import type { ErrorReportQuery } from '@/api/error-report/error-report.type';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Select, Space } from 'antd';
import { memo } from 'react';

const { RangePicker } = DatePicker;

interface SearchFormProps {
  query: ErrorReportQuery;
  onChange: (query: ErrorReportQuery) => void;
  onSearch: () => void;
  onReset: () => void;
}

const EVENT_TYPE_OPTIONS = [
  { label: '鼠标点击', value: 'mousedown' },
  { label: 'JavaScript错误', value: 'js-error' },
  { label: '页面加载', value: 'pageload' },
  { label: '用户行为', value: 'behavior' }
];

const SUB_TYPE_OPTIONS = [
  { label: '点击事件', value: 'click' },
  { label: '表单提交', value: 'submit' },
  { label: '页面跳转', value: 'navigation' },
  { label: '滚动事件', value: 'scroll' }
];

export default memo(function SearchForm({ query, onChange, onSearch, onReset }: SearchFormProps) {
  const updateQuery = (updates: Partial<ErrorReportQuery>) => {
    onChange({ ...query, ...updates });
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-start gap-4">
        {/* 左侧：搜索条件区域 */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 第一行 */}
          <Input
            placeholder="搜索关键词"
            value={query.keyword}
            onChange={e => updateQuery({ keyword: e.target.value })}
            allowClear
          />
          <Select
            placeholder="选择事件类型"
            value={query.eventType}
            onChange={value => updateQuery({ eventType: value })}
            allowClear
            options={EVENT_TYPE_OPTIONS}
          />
          <Select
            placeholder="选择错误子类型"
            value={query.subType}
            onChange={value => updateQuery({ subType: value })}
            allowClear
            options={SUB_TYPE_OPTIONS}
          />
          <Input
            placeholder="应用ID"
            value={query.appId}
            onChange={e => updateQuery({ appId: e.target.value })}
            allowClear
          />

          {/* 第二行 */}
          <Input
            placeholder="用户ID"
            value={query.userId}
            onChange={e => updateQuery({ userId: e.target.value })}
            allowClear
          />
          <Input
            placeholder="会话ID"
            value={query.sessionId}
            onChange={e => updateQuery({ sessionId: e.target.value })}
            allowClear
          />
          <Input
            placeholder="页面URL"
            value={query.url}
            onChange={e => updateQuery({ url: e.target.value })}
            allowClear
          />

          {/* 时间选择器 */}
          <RangePicker
            className="w-full"
            placeholder={['开始时间', '结束时间']}
            onChange={dates => {
              if (dates) {
                updateQuery({
                  startTime: dates[0]?.toISOString(),
                  endTime: dates[1]?.toISOString()
                });
              } else {
                updateQuery({
                  startTime: undefined,
                  endTime: undefined
                });
              }
            }}
          />
        </div>

        {/* 右侧：操作按钮区域 */}
        <div className="flex items-start pt-1">
          <Space direction="vertical">
            <Button type="primary" icon={<SearchOutlined />} onClick={onSearch} block>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={onReset} block>
              重置
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
});
