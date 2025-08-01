import { Breadcrumb } from 'antd'
import type { GetProp, BreadcrumbProps, MenuProps } from 'antd'
import { useMemo, memo, useCallback } from 'react'
import { useNavigate } from 'react-router'

import { MenuItem } from '#/type'
import { MENU_ROUTE } from '@/router'
import { useRouteToMenu, usePathname } from '@/hooks'

type RouteItemType = GetProp<BreadcrumbProps, 'items'>[number]

export default memo(function BreadcrumbCpt() {
  const menuItems = useRouteToMenu(MENU_ROUTE)
  const pathname = usePathname()
  const navigate = useNavigate()

  const changeMenu: MenuProps['onClick'] = info => {
    navigate(info.key)
  }

  // 递归查找匹配的菜单项
  const findBreadcrumbItems = (path: string, menuItems: MenuItem[]): RouteItemType[] => {
    for (const item of menuItems) {
      if (item.key === path) {
        return [{ title: item.label, key: item.key }]
      }
      if (item.children) {
        const found = findBreadcrumbItems(path, item.children)
        if (found.length > 0) {
          const menuItems = item.children.map(child => ({
            title: child.label,
            key: child.key
          }))
          return [
            {
              title: (
                <>
                  {item.icon}
                  <span>{item.label}</span>
                </>
              ),
              menu: { items: menuItems, onClick: changeMenu }
            },
            ...found
          ]
        }
      }
    }
    return []
  }

  console.log('breadxuanran')

  const breadcrumbItems = useMemo(() => {
    const currentMenu = findBreadcrumbItems(pathname, menuItems)

    return currentMenu
  }, [pathname, menuItems])

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
    </>
  )
})
