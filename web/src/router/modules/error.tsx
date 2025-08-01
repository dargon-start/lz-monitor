import { lazy } from 'react'
import { UserOutlined } from '@ant-design/icons'
import DashboardLayout from '@/layouts/index'

const Test = lazy(() => import('@/pages/test'))

export default {
  path: '/test',
  element: <DashboardLayout />,
  meta: {
    label: '测试组件',
    icon: <UserOutlined />,
    key: '/test'
  },
  children: [
    {
      path: 'counter',
      element: <Test></Test>,
      meta: {
        label: '计算组件',
        key: '/test/counter'
      }
    }
  ]
}
