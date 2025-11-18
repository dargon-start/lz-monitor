import type { Performance } from '@/api/error-report/error-report.type';
import { CopyOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, message, Modal, Tabs, Tag, Typography } from 'antd';
import { formatMetricValue, formatTimestamp, getMetricNameDisplay, getRatingColor, getRatingText } from '../utils';

interface PerformanceDetailModalProps {
  visible: boolean;
  record: Performance | null;
  onClose: () => void;
}

export default function PerformanceDetailModal({ visible, record, onClose }: PerformanceDetailModalProps) {
  if (!record) return null;

  // 复制到剪贴板
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success(`${label}已复制到剪贴板`);
    });
  };

  const tabItems = [
    {
      key: 'basic',
      label: '基本信息',
      children: (
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="记录ID">{record.id || '未知'}</Descriptions.Item>
          <Descriptions.Item label="性能指标">
            <Tag color="blue">{getMetricNameDisplay(record.metricName)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="指标值">
            <span className="font-semibold text-lg">
              {formatMetricValue(record.metricName, record.value)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="评级">
            <Tag color={getRatingColor(record.rating)}>{getRatingText(record.rating)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="API Key">{record.apiKey || '未知'}</Descriptions.Item>
          <Descriptions.Item label="用户ID">{record.userId || '游客'}</Descriptions.Item>
          <Descriptions.Item label="会话ID">
            <Typography.Text copyable={{ text: record.uuid }}>
              {record.uuid || '未知'}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="SDK版本">{record.sdkVersion || '未知'}</Descriptions.Item>
          <Descriptions.Item label="时间戳" span={2}>
            {record.time
              ? `${formatTimestamp(record.time)} (${record.time})`
              : '未知'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={2}>
            {record.createdAt || '未知'}
          </Descriptions.Item>
          <Descriptions.Item label="IP地址">{record.ip || '未知'}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      key: 'page',
      label: '页面信息',
      children: (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="页面URL">
            <Typography.Text copyable={{ text: record.pageUrl }}>
              <a
                href={record.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                {record.pageUrl || '未知'}
              </a>
            </Typography.Text>
          </Descriptions.Item>
        </Descriptions>
      )
    },
    {
      key: 'device',
      label: '设备环境',
      children: (
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="浏览器">{record.browser || '未知'}</Descriptions.Item>
          <Descriptions.Item label="操作系统">{record.os || '未知'}</Descriptions.Item>
          <Descriptions.Item label="设备类型">{record.deviceType || '未知'}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      key: 'memory',
      label: '内存信息',
      children: record.memory ? (
        <Card size="small">
          <pre className="bg-gray-50 p-3 rounded text-xs max-h-96 overflow-auto m-0 border">
            {JSON.stringify(record.memory, null, 2)}
          </pre>
        </Card>
      ) : (
        <div className="text-center py-8 text-gray-400">暂无内存信息</div>
      )
    },
    {
      key: 'longTask',
      label: '长任务信息',
      children: record.longTask ? (
        <Card size="small">
          <pre className="bg-gray-50 p-3 rounded text-xs max-h-96 overflow-auto m-0 border">
            {JSON.stringify(record.longTask, null, 2)}
          </pre>
        </Card>
      ) : (
        <div className="text-center py-8 text-gray-400">暂无长任务信息</div>
      )
    },
    {
      key: 'raw',
      label: '原始数据',
      children: (
        <Card
          size="small"
          title="完整原始数据"
          extra={
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(JSON.stringify(record, null, 2), '原始数据')}
            >
              复制全部
            </Button>
          }
        >
          <pre className="bg-gray-50 p-3 rounded text-xs max-h-96 overflow-auto m-0 border">
            {JSON.stringify(record, null, 2)}
          </pre>
        </Card>
      )
    }
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span>性能指标详情</span>
          <Tag color="blue">{getMetricNameDisplay(record.metricName)}</Tag>
          <Tag color={getRatingColor(record.rating)}>{getRatingText(record.rating)}</Tag>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      style={{ top: 20 }}
    >
      <div className="h-[70vh] overflow-auto">
        <Tabs defaultActiveKey="basic" items={tabItems} />
      </div>
    </Modal>
  );
}

