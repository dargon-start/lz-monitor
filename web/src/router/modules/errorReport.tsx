import { lazy } from 'react';
import { BugOutlined, DashboardOutlined } from '@ant-design/icons';
import DashboardLayout from '@/layouts/index';

const ErrorReportList = lazy(() => import('@/pages/error-report/list'));
const PerformanceList = lazy(() => import('@/pages/error-report/performance'));

export default {
  path: '/error-report',
  element: <DashboardLayout />,
  meta: {
    key: '/error-report',
    label: '错误报告',
    icon: <BugOutlined />,
  },
  children: [
    {
      path: 'list',
      element: <ErrorReportList />,
      meta: {
        key: '/error-report/list',
        label: '错误列表',
      },
    },
    {
      path: 'performance',
      element: <PerformanceList />,
      meta: {
        key: '/error-report/performance',
        label: '性能指标',
        icon: <DashboardOutlined />,
      },
    },
  ],
};
