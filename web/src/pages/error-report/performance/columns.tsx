import type { Performance } from '@/api/error-report/error-report.type';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { formatMetricValue, formatTimestamp, getMetricNameDisplay, getRatingColor, getRatingText } from './utils';

interface DataType extends Performance {
  key: string;
}

interface ColumnsConfig {
  onViewDetail: (record: Performance) => void;
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
      title: '性能指标',
      dataIndex: 'metricName',
      width: 180,
      render: (text: string) => (
        <Tag color="blue">{getMetricNameDisplay(text)}</Tag>
      )
    },
    {
      title: '指标值',
      dataIndex: 'value',
      width: 120,
      render: (value: number, record: DataType) => (
        <span className="font-semibold">{formatMetricValue(record.metricName, value)}</span>
      )
    },
    {
      title: '评级',
      dataIndex: 'rating',
      width: 120,
      render: (rating: string) => (
        <Tag color={getRatingColor(rating)}>{getRatingText(rating)}</Tag>
      )
    },
    {
      title: '页面URL',
      dataIndex: 'pageUrl',
      width: 250,
      ellipsis: {
        showTitle: false
      },
      render: text => (
        <Tooltip title={text}>
          <span className="text-blue-600">{text || '未知'}</span>
        </Tooltip>
      )
    },
    {
      title: 'API Key',
      dataIndex: 'apiKey',
      width: 120,
      render: text => text || '—'
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: 120,
      render: text => (
        <Tooltip title={`用户ID: ${text || '未知'}`}>
          <span>{text || '游客'}</span>
        </Tooltip>
      )
    },
    {
      title: '会话ID',
      dataIndex: 'uuid',
      width: 120,
      render: text => (
        <Tooltip title={text}>
          <span>{text ? text.substring(0, 8) : '—'}</span>
        </Tooltip>
      )
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      width: 120,
      render: text => text || '未知'
    },
    {
      title: '设备/系统',
      width: 150,
      render: (_, record) => {
        const info = `${record.os || '未知'} / ${record.deviceType || '未知'}`;
        return (
          <Tooltip title={info}>
            <span>{info}</span>
          </Tooltip>
        );
      }
    },
    {
      title: '时间',
      dataIndex: 'time',
      width: 180,
      render: time => {
        if (!time) return '未知';

        const formattedTime = formatTimestamp(time);
        return (
          <Tooltip title={`时间戳: ${time}`}>
            <span>{formattedTime}</span>
          </Tooltip>
        );
      },
      sorter: (a, b) => {
        const timeA = parseInt((a as any).time) || 0;
        const timeB = parseInt((b as any).time) || 0;
        return timeA - timeB;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 180,
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

