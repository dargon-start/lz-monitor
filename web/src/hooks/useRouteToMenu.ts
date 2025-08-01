import { useMemo } from 'react'
import { MenuItem } from '#/type'

const useRouteToMenu = (routes: any[]): MenuItem[] => {
  return useMemo(() => {
    const mapRouteToMenu = (route: any): MenuItem => {
      const { path, meta, children } = route
      const menuItem: MenuItem = {
        key: meta?.key || path, // 优先使用 meta.key
        label: meta?.label || path.split('/').pop(), // 优先使用 meta.label
        path,
        icon: meta?.icon // 支持图标
      }

      if (children && children.length > 0) {
        menuItem.children = children.map(mapRouteToMenu)
      }

      return menuItem
    }

    return routes.map(mapRouteToMenu)
  }, [routes])
}

export default useRouteToMenu
