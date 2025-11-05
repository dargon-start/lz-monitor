import type { ErrorReport } from '@/api/error-report/error-report.type';
import { CopyOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, message, Modal, Tabs, Tag, Typography } from 'antd';

import { BreadcrumbTimeline } from './BreadcrumbTimeline';

interface ErrorDetailModalProps {
  visible: boolean;
  record: ErrorReport | null;
  onClose: () => void;
}

export default function ErrorDetailModal({ visible, record, onClose }: ErrorDetailModalProps) {
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
          <Descriptions.Item label="错误ID">{record.id || '未知'}</Descriptions.Item>
          <Descriptions.Item label="错误类型">
            <Tag color="blue">{record.errorType || '未知'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="错误Hash">
            <Typography.Text copyable={{ text: record.errorHash }}>
              {record.errorHash || '—'}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="API Key">{record.apiKey || '未知'}</Descriptions.Item>
          <Descriptions.Item label="用户ID">{record.userId || '游客'}</Descriptions.Item>
          <Descriptions.Item label="会话ID">
            <Typography.Text copyable={{ text: record.uuid }}>
              {record.uuid || '未知'}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="SDK版本">{record.sdkVersion || '未知'}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={record.status === 'error' ? 'red' : 'green'}>{record.status || '未知'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="时间戳" span={2}>
            {record.time
              ? `${new Date(parseInt(String(record.time))).toLocaleString()} (${record.time})`
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
      key: 'error',
      label: '错误信息',
      children: (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="错误消息">
            <Typography.Text copyable={{ text: record.message || '' }}>
              {record.message || '无'}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="错误名称">{record.name || '—'}</Descriptions.Item>
          <Descriptions.Item label="文件位置">
            <Typography.Text
              copyable={{ text: `${record.fileName}:${record.line}:${record.column}` }}
            >
              {record.fileName ? `${record.fileName}:${record.line}:${record.column}` : '未知'}
            </Typography.Text>
          </Descriptions.Item>
          {record.stack && (
            <Descriptions.Item label="堆栈信息">
              <pre className="bg-gray-50 p-3 rounded text-xs max-h-40 overflow-auto m-0 border">
                {record.stack}
              </pre>
            </Descriptions.Item>
          )}
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
          <Descriptions.Item label="录屏ID">
            <Typography.Text copyable={{ text: record.recordScreenId || '' }}>
              {record.recordScreenId || '—'}
            </Typography.Text>
          </Descriptions.Item>
        </Descriptions>
      )
    },
    {
      key: 'breadcrumb',
      label: '用户行为',
      children:
        record.breadcrumb && record.breadcrumb.length > 0 ? (
          <BreadcrumbTimeline breadcrumbs={record.breadcrumb} />
        ) : (
          <div className="text-center py-8 text-gray-400">暂无用户行为数据</div>
        )
    },
    {
      key: 'device',
      label: '设备环境',
      children: (
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="浏览器">
            {record.browser || '未知'}
            {record.browserVersion && ` ${record.browserVersion}`}
          </Descriptions.Item>
          <Descriptions.Item label="操作系统">
            {record.os || '未知'}
            {record.osVersion && ` ${record.osVersion}`}
          </Descriptions.Item>
          <Descriptions.Item label="设备类型">{record.deviceType || '未知'}</Descriptions.Item>
          <Descriptions.Item label="设备型号">{record.device || '未知'}</Descriptions.Item>
          <Descriptions.Item label="User Agent" span={2}>
            <Typography.Text copyable={{ text: record.ua || '' }} ellipsis>
              {record.ua || '未知'}
            </Typography.Text>
          </Descriptions.Item>
          {record.extraData && (
            <Descriptions.Item label="扩展数据" span={2}>
              <pre className="bg-gray-50 p-3 rounded text-xs max-h-40 overflow-auto m-0 border">
                {JSON.stringify(record.extraData, null, 2)}
              </pre>
            </Descriptions.Item>
          )}
        </Descriptions>
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
          <span>错误详情</span>
          <Tag color="blue">{record.errorType}</Tag>
          {record.errorHash && <Tag>{record.errorHash.substring(0, 8)}</Tag>}
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      height={800}
      style={{ top: 20 }}
    >
      <div className="h-[70vh] overflow-auto">
        <Tabs defaultActiveKey="basic" items={tabItems} />
      </div>
    </Modal>
  );
}
