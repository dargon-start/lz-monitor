import type { ErrorReport } from '@/api/error-report/error-report.type';
import { CopyOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, message, Modal, Tabs, Tag, Typography } from 'antd';

interface ErrorDetailModalProps {
  visible: boolean;
  record: ErrorReport | null;
  onClose: () => void;
}

export default function ErrorDetailModal({ visible, record, onClose }: ErrorDetailModalProps) {
  if (!record) return null;

  const recordAny = record as any;

  // 复制到剪贴板
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success(`${label}已复制到剪贴板`);
    });
  };

  // JSON 展示组件
  const JsonView = ({ data, title }: { data: any; title: string }) => (
    <Card
      size="small"
      title={title}
      extra={
        <Button
          size="small"
          icon={<CopyOutlined />}
          onClick={() => handleCopy(JSON.stringify(data, null, 2), title)}
        >
          复制
        </Button>
      }
    >
      <pre className="bg-gray-50 p-3 rounded text-sm max-h-60 overflow-auto m-0">
        {JSON.stringify(data, null, 2)}
      </pre>
    </Card>
  );

  const tabItems = [
    {
      key: 'basic',
      label: '基本信息',
      children: (
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="错误ID">{recordAny.id || '未知'}</Descriptions.Item>
          <Descriptions.Item label="事件类型">
            <Tag color="blue">{recordAny.event_type || '未知'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="错误子类型">
            <Tag>{recordAny.sub_type || '未分类'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="应用ID">{recordAny.app_id || '未知'}</Descriptions.Item>
          <Descriptions.Item label="用户ID">{recordAny.user_id || '未知'}</Descriptions.Item>
          <Descriptions.Item label="会话ID">
            <Typography.Text copyable={{ text: recordAny.session_id }}>
              {recordAny.session_id || '未知'}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="时间戳" span={2}>
            {recordAny.timestamp
              ? `${new Date(parseInt(recordAny.timestamp)).toLocaleString()} (${recordAny.timestamp})`
              : '未知'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={2}>
            {recordAny.created_at || '未知'}
          </Descriptions.Item>
          <Descriptions.Item label="IP地址">{recordAny.ip || '未知'}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      key: 'page',
      label: '页面信息',
      children: (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="页面URL">
            <Typography.Text copyable={{ text: recordAny.url }}>
              <a
                href={recordAny.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                {recordAny.url || '未知'}
              </a>
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="页面标题">{recordAny.page_title || '未知'}</Descriptions.Item>
          <Descriptions.Item label="来源页面">
            <Typography.Text copyable={{ text: recordAny.referrer }}>
              {recordAny.referrer || '未知'}
            </Typography.Text>
          </Descriptions.Item>
        </Descriptions>
      )
    },
    {
      key: 'event',
      label: '事件数据',
      children: recordAny.event_data ? (
        <JsonView data={recordAny.event_data} title="事件详细数据" />
      ) : (
        <div className="text-center py-8 text-gray-400">暂无事件数据</div>
      )
    },
    {
      key: 'device',
      label: '设备环境',
      children: (
        <div className="space-y-4">
          {recordAny.browser_info && <JsonView data={recordAny.browser_info} title="浏览器信息" />}
          {recordAny.device_info && <JsonView data={recordAny.device_info} title="设备信息" />}
          {recordAny.os_info && <JsonView data={recordAny.os_info} title="操作系统信息" />}
          {recordAny.network_info && <JsonView data={recordAny.network_info} title="网络信息" />}
          {recordAny.geo_info && <JsonView data={recordAny.geo_info} title="地理位置信息" />}
          {!recordAny.browser_info &&
            !recordAny.device_info &&
            !recordAny.os_info &&
            !recordAny.network_info &&
            !recordAny.geo_info && (
              <div className="text-center py-8 text-gray-400">暂无设备环境数据</div>
            )}
        </div>
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
              onClick={() => handleCopy(JSON.stringify(recordAny, null, 2), '原始数据')}
            >
              复制全部
            </Button>
          }
        >
          <pre className="bg-gray-50 p-3 rounded text-xs max-h-96 overflow-auto m-0 border">
            {JSON.stringify(recordAny, null, 2)}
          </pre>
        </Card>
      )
    }
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span>错误详情</span>
          <Tag color="blue">{recordAny.event_type}</Tag>
          <Tag>{recordAny.sub_type}</Tag>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      style={{ top: 20 }}
    >
      <div className="max-h-[75vh] overflow-auto">
        <Tabs defaultActiveKey="basic" items={tabItems} />
      </div>
    </Modal>
  );
}
