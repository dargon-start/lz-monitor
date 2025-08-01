import { lazy } from 'react'
import { UserOutlined } from '@ant-design/icons'
import DashboardLayout from '@/layouts/index'

const User = lazy(() => import('@/pages/user-management/user'))
const Role = lazy(() => import('@/pages/user-management/role'))

export default {
  path: '/user-management',
  element: <DashboardLayout />,
  meta: {
    label: '用户管理',
    icon: <UserOutlined />,
    key: '/user-management'
  },
  children: [
    {
      path: 'user',
      element: <User></User>,
      meta: {
        label: '用户列表',
        key: '/user-management/user'
      }
    },
    {
      path: 'role',
      element: <Role></Role>,
      meta: {
        label: '角色列表',
        key: '/user-management/role'
      }
    }
  ]
}
