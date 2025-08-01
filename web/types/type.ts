interface MenuItem {
  key: string
  label: string
  path: string
  icon?: React.ReactNode // 支持图标
  children?: MenuItem[]
}

export type { MenuItem }
