import type { Breadcrumb } from '@/api/error-report/error-report.type';
import { Card, Tag, Timeline, Typography } from 'antd';

export function BreadcrumbTimeline({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  const sortedBreadcrumbs = [...breadcrumbs].sort((a, b) => a.time - b.time);

  const getTypeColor = (type?: string, category?: string) => {
    const typeStr = String(type || '').toLowerCase();
    const categoryStr = String(category || '').toLowerCase();
    if (typeStr.includes('error') || typeStr.includes('unhandledrejection')) return 'red';
    if (categoryStr === 'click' || categoryStr === 'user') return 'blue';
    if (categoryStr === 'navigation' || categoryStr === 'route') return 'green';
    if (categoryStr === 'xhr' || categoryStr === 'fetch' || categoryStr === 'http') return 'orange';
    if (categoryStr === 'console') return 'purple';
    if (categoryStr.includes('resource') || typeStr.includes('resource')) return 'red';
    return 'gray';
  };

  const getTypeLabel = (type?: string, category?: string) => {
    const typeStr = String(type || '').toLowerCase();
    const categoryStr = String(category || '').toLowerCase();
    const key = categoryStr || typeStr;
    const map: Record<string, string> = {
      click: '点击',
      user: '用户操作',
      navigation: '导航',
      route: '路由',
      xhr: 'XHR请求',
      fetch: 'Fetch请求',
      http: 'HTTP请求',
      console: '控制台',
      error: '错误',
      resource: '资源错误',
      unhandledrejection: 'Promise拒绝',
      resource_error: '资源错误',
      httprequest: 'HTTP请求'
    };
    for (const [k, v] of Object.entries(map)) if (key.includes(k)) return v;
    if (categoryStr) return categoryStr.replace(/_/g, ' ');
    return typeStr || '未知';
  };

  const formatTime = (timestamp: number) => {
    if (!timestamp) return '未知时间';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '无效时间';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    return `${year}/${month}/${day} ${hour}:${minute}:${second}.${ms}`;
  };

  const formatStatus = (status?: string) => {
    const statusStr = String(status || '').toLowerCase();
    const map: Record<string, string> = {
      ok: '成功',
      success: '成功',
      error: '错误',
      warning: '警告',
      info: '信息'
    };
    return map[statusStr] || status || '未知';
  };

  return (
    <div className="max-h-[600px] overflow-auto px-4">
      <Timeline
        mode="left"
        items={sortedBreadcrumbs.map(b => {
          const color = getTypeColor(b.type, b.category);
          const label = getTypeLabel(b.type, b.category);
          const status = b.status || '';
          const hasData = b.data && typeof b.data === 'object' && Object.keys(b.data).length > 0;
          return {
            color,
            children: (
              <div className="pb-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Tag color={color}>{label}</Tag>
                  <Tag color={status === 'error' || status.includes('error') ? 'red' : 'default'}>
                    {formatStatus(status)}
                  </Tag>
                  <Typography.Text type="secondary" className="text-xs">
                    {formatTime(b.time)}
                  </Typography.Text>
                </div>
                {hasData && (
                  <Card size="small" className="mt-2" style={{ backgroundColor: '#fafafa' }}>
                    <pre
                      className="text-xs p-2 max-h-40 overflow-auto m-0"
                      style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                    >
                      {JSON.stringify(b.data, null, 2)}
                    </pre>
                  </Card>
                )}
                {b.type && b.type !== b.category && (
                  <Typography.Text type="secondary" className="text-xs block mt-2">
                    类型: {b.type}
                  </Typography.Text>
                )}
              </div>
            )
          };
        })}
      />
    </div>
  );
}
