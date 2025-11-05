import type { Breadcrumb } from '@/api/error-report/error-report.type';
import { Card, Tag, Timeline, Typography } from 'antd';

// 用户行为时间轴组件
export function BreadcrumbTimeline({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  // 按时间排序（从早到晚）
  const sortedBreadcrumbs = [...breadcrumbs].sort((a, b) => a.time - b.time);

  // 获取行为类型的颜色
  const getTypeColor = (type: string, category: string) => {
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

  // 获取行为类型的标签文字
  const getTypeLabel = (type: string, category: string) => {
    const typeStr = String(type || '').toLowerCase();
    const categoryStr = String(category || '').toLowerCase();

    // 优先使用category，如果没有则使用type
    const key = categoryStr || typeStr;

    const labelMap: Record<string, string> = {
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

    // 尝试匹配
    for (const [k, v] of Object.entries(labelMap)) {
      if (key.includes(k)) return v;
    }

    // 如果都不匹配，格式化显示
    if (categoryStr) {
      return categoryStr
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    return typeStr || '未知';
  };

  // 格式化时间显示
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

    return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
  };

  // 格式化状态显示
  const formatStatus = (status: string) => {
    const statusStr = String(status || '').toLowerCase();
    const statusMap: Record<string, string> = {
      ok: '成功',
      success: '成功',
      error: '错误',
      warning: '警告',
      info: '信息'
    };
    return statusMap[statusStr] || status || '未知';
  };

  return (
    <div className="h-[calc(70vh-100px)] overflow-auto px-4">
      <Timeline
        mode="left"
        items={sortedBreadcrumbs.map(breadcrumb => {
          const type = breadcrumb.type || '';
          const category = breadcrumb.category || '';
          const color = getTypeColor(type, category);
          const label = getTypeLabel(type, category);
          const status = breadcrumb.status || '';
          const hasData =
            breadcrumb.data &&
            typeof breadcrumb.data === 'object' &&
            Object.keys(breadcrumb.data).length > 0;

          return {
            color,
            children: (
              <div className="pt-2 pb-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Tag color={color}>{label}</Tag>
                  <Tag color={status === 'error' || status.includes('error') ? 'red' : 'default'}>
                    {formatStatus(status)}
                  </Tag>
                  <Typography.Text type="secondary" className="text-xs">
                    {formatTime(breadcrumb.time)}
                  </Typography.Text>
                </div>
                {hasData && (
                  <Card size="small" className="mt-2" style={{ backgroundColor: '#fafafa' }}>
                    <pre
                      className="text-xs p-2 max-h-40 overflow-auto m-0"
                      style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                    >
                      {JSON.stringify(breadcrumb.data, null, 2)}
                    </pre>
                  </Card>
                )}
                {type && type !== category && (
                  <Typography.Text type="secondary" className="text-xs block mt-2">
                    类型: {type}
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
