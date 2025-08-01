import { lazy } from 'react'
import { BugOutlined } from '@ant-design/icons'
import DashboardLayout from '@/layouts/index'

const ErrorReportList = lazy(() => import('@/pages/error-report/list'))

export default {
  path: '/error-report',
  element: <DashboardLayout />,
  meta: {
    key: '/error-report',
    label: '错误报告',
    icon: <BugOutlined />
  },
  children: [
    {
      path: 'list',
      element: <ErrorReportList />,
      meta: {
        key: '/error-report/list',
        label: '错误列表'
      }
    }
  ]
}
