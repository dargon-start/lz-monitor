import type { ErrorReport } from '@/api/error-report/error-report.type';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { formatTimestamp } from './utils';

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
      title: '错误类型',
      dataIndex: 'errorType',
      width: 140,
      render: text => <Tag color="blue">{text || '未知'}</Tag>
    },
    {
      title: '错误Hash',
      dataIndex: 'errorHash',
      width: 120,
      render: text => (
        <Tooltip title={text}>
          <span>{text ? text.substring(0, 8) : '—'}</span>
        </Tooltip>
      )
    },
    {
      title: '错误信息',
      dataIndex: 'message',
      ellipsis: true,
      width: 300,
      render: text => (
        <Tooltip placement="topLeft" title={text}>
          <span>{text || '无'}</span>
        </Tooltip>
      )
    },
    {
      title: '页面URL',
      dataIndex: 'pageUrl',
      width: 200,
      ellipsis: {
        showTitle: false
      },
      render: text => (
        <Tooltip title={text}>
          <span>{text || '未知'}</span>
        </Tooltip>
      )
    },
    {
      title: '文件位置',
      width: 250,
      ellipsis: true,
      render: (_, record) => {
        const location = record.fileName
          ? `${record.fileName}:${record.line}:${record.column}`
          : '未知';
        return (
          <Tooltip title={location}>
            <span className="text-gray-600">{location}</span>
          </Tooltip>
        );
      }
    },
    {
      title: 'API Key',
      dataIndex: 'apiKey',
      width: 100,
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
      render: (text, record) => (
        <Tooltip title={`${text || '未知'} ${record.browserVersion || ''}`}>
          <span>
            {text || '未知'} {record.browserVersion || ''}
          </span>
        </Tooltip>
      )
    },
    {
      title: '设备/系统',
      width: 150,
      render: (_, record) => {
        const info = `${record.os || '未知'} ${record.osVersion || ''} / ${record.deviceType || '未知'}`;
        return (
          <Tooltip title={info}>
            <span>
              {record.os || '未知'} {record.osVersion || ''}
            </span>
          </Tooltip>
        );
      }
    },
    {
      title: '时间',
      dataIndex: 'time',
      width: 160,
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
