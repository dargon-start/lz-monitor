import { lazy } from 'react'
import { UserOutlined } from '@ant-design/icons'
import DashboardLayout from '@/layouts/index'

const ChatAI = lazy(() => import('@/pages/chat-ai'))

export default {
  path: '/ai',
  element: <DashboardLayout />,
  meta: {
    label: 'AI',
    icon: <UserOutlined />,
    key: '/ai'
  },
  children: [
    {
      path: 'chat-ai',
      element: <ChatAI></ChatAI>,
      meta: {
        label: 'Chat',
        key: '/ai/chat-ai'
      }
    }
  ]
}
