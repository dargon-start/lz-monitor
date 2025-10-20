import type { ErrorReport } from '@/api/error-report/error-report.type';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  formatTimestamp,
  getBrowserDisplay,
  getDeviceDisplay,
  getDeviceTooltip,
  getPageDisplay,
  getPageTooltip,
  getUserDisplay
} from './utils';

interface DataType extends ErrorReport {
  key: string;
}

interface ColumnsConfig {
  onViewDetail: (record: ErrorReport) => void;
}

export function createColumns({ onViewDetail }: ColumnsConfig): ColumnsType<DataType> {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      render: text => (
        <Tooltip title={text}>
          <span className="cursor-pointer">{text}</span>
        </Tooltip>
      )
    },
    {
      title: '事件类型',
      dataIndex: 'event_type',
      width: 120,
      render: text => <Tag color="blue">{text || '未知'}</Tag>
    },
    {
      title: '错误子类型',
      dataIndex: 'sub_type',
      width: 120,
      render: text => <Tag>{text || '未分类'}</Tag>
    },
    {
      title: '错误信息',
      dataIndex: 'event_data',
      ellipsis: true,
      width: 300,
      render: text => {
        const displayText = JSON.stringify(text);
        return (
          <Tooltip placement="topLeft" title={displayText}>
            <span>{displayText}</span>
          </Tooltip>
        );
      }
    },
    {
      title: '页面信息',
      width: 200,
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => (
        <Tooltip title={getPageTooltip(record)}>
          <span>{getPageDisplay(record)}</span>
        </Tooltip>
      )
    },
    {
      title: '应用ID',
      dataIndex: 'app_id',
      width: 100,
      render: text => text || ''
    },
    {
      title: '用户',
      width: 120,
      render: (_, record) => (
        <Tooltip title={`用户ID: ${record.userId || '未知'}`}>
          <span>{getUserDisplay(record)}</span>
        </Tooltip>
      )
    },
    {
      title: '会话ID',
      dataIndex: 'session_id',
      width: 120,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '浏览器信息',
      width: 150,
      render: (_, record) => {
        const recordAny = record as any;
        return (
          <Tooltip title={recordAny.user_agent || '未知用户代理'}>
            <span>{getBrowserDisplay(record)}</span>
          </Tooltip>
        );
      }
    },
    {
      title: '设备信息',
      width: 120,
      render: (_, record) => (
        <Tooltip title={getDeviceTooltip(record)}>
          <span>{getDeviceDisplay(record)}</span>
        </Tooltip>
      )
    },
    {
      title: '时间戳',
      dataIndex: 'timestamp',
      width: 160,
      render: timestamp => {
        if (!timestamp) return '未知';

        const formattedTime = formatTimestamp(timestamp);
        return (
          <Tooltip title={`时间戳: ${timestamp}`}>
            <span>{formattedTime}</span>
          </Tooltip>
        );
      },
      sorter: (a, b) => {
        const timestampA = parseInt((a as any).timestamp) || 0;
        const timestampB = parseInt((b as any).timestamp) || 0;
        return timestampA - timestampB;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 160,
      render: text => text || '未知'
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Tooltip title="查看详情">
          <Button type="text" icon={<EyeOutlined />} onClick={() => onViewDetail(record)} />
        </Tooltip>
      )
    }
  ];
}
