import { useState, memo, useMemo, Suspense } from 'react'
import { useOutlet } from 'react-router'
import { Layout, theme, Spin } from 'antd'
import MotionViewport from '@/components/animate/MotionViewport'
import { usePathname } from '@/hooks'
import Header from './components/Header'
import SideBar from './components/SideBar'

const { Sider, Content } = Layout

export default function DashboardLayout() {
  const Outlet = useOutlet()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  // 使用 useMemo 缓存样式对象，避免不必要的重新计算
  const contentStyle = useMemo(
    () => ({
      margin: '24px 16px',
      padding: 24,
      minHeight: 280,
      background: colorBgContainer,
      borderRadius: borderRadiusLG
    }),
    [colorBgContainer, borderRadiusLG]
  )

  const fallBack = (
    <div className='flex h-full items-center justify-center'>
      <Spin size='large' />
    </div>
  )

  return (
    <Layout className='h-screen overflow-hidden'>
      <Sider
        trigger={null}
        style={{ background: colorBgContainer }}
        collapsible
        collapsed={collapsed}
      >
        <SideBar collapsed={collapsed}></SideBar>
      </Sider>
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content style={contentStyle}>
          <Suspense fallback={fallBack} key={pathname}>
            {/*  
                MotionViewport,Suspense需要加上key，否则切换路由没有动画效果
                使用useOutlet获取当前路由组件，避免DashboardLayout组件重复渲染
            */}
            <MotionViewport key={pathname} className='h-full w-full overflow-scroll'>
              {Outlet}
            </MotionViewport>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  )
}
