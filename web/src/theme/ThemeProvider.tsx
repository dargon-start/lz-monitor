import { ConfigProvider, theme } from 'antd'
import { useSettings } from '@/store'
import { ThemeMode } from '#/enum'
import { presetsColors } from '@/theme/tokens/color'
import CssTheme from './CssTheme'

interface ThemeProviderProps {
  children: React.ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { themeMode, themeColorPresets } = useSettings()

  const tm = themeMode === ThemeMode.Dark ? theme.darkAlgorithm : theme.defaultAlgorithm
  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: tm,
          token: {
            colorPrimary: presetsColors[themeColorPresets]
          }
        }}
      >
        {children}
        <CssTheme></CssTheme>
      </ConfigProvider>
    </>
  )
}
