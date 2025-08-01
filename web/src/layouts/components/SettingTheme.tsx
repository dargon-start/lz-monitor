import { useState, memo } from 'react'
import { Drawer, Card } from 'antd'
import { SettingOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import { MdCircle } from 'react-icons/md'
import { presetsColors } from '@/theme/tokens/color'
import { useSettings, useSettingActions } from '@/store'
import { ThemeMode, ThemeColorPresets } from '#/enum'

export default memo(function SettingTheme() {
  // 控制主题抽屉
  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  // 切换主题
  const settings = useSettings()
  const { setSettings } = useSettingActions()
  const setThemeMode = (themeMode: ThemeMode) => {
    setSettings({
      ...settings,
      themeMode
    })
  }

  const setThemeColorPresets = (themeColorPresets: ThemeColorPresets) => {
    setSettings({
      ...settings,
      themeColorPresets
    })
  }

  return (
    <>
      <SettingOutlined
        onClick={showDrawer}
        style={{ fontSize: '20px' }}
        className='cursor-pointer'
      />

      <Drawer title='主题配置' onClose={onClose} open={open}>
        <div className='flex flex-col gap-6 p-6'>
          <div>
            <div className='mb-3 text-base font-semibold text-text-secondary'>模式</div>
            <div className='flex items-center justify-center gap-3'>
              <Card
                className='flex-1 flex justify-center items-center cursor-pointer'
                onClick={() => setThemeMode(ThemeMode.Dark)}
              >
                <MoonOutlined style={{ fontSize: '20px' }} />
              </Card>
              <Card
                className='flex-1 flex justify-center items-center cursor-pointer'
                onClick={() => setThemeMode(ThemeMode.Light)}
              >
                <SunOutlined style={{ fontSize: '20px' }} />
              </Card>
            </div>
          </div>

          <div>
            <div className='mb-3 text-base font-semibold text-text-secondary'>主题预设</div>
            <div className='grid grid-cols-3 gap-x-4 gap-y-3'>
              {Object.entries(presetsColors).map(([preset, color]) => (
                <Card
                  key={preset}
                  className='flex h-12 w-full cursor-pointer items-center justify-center'
                  onClick={() => setThemeColorPresets(preset as ThemeColorPresets)}
                >
                  <div
                    key={preset}
                    style={{
                      color: color
                    }}
                  >
                    <MdCircle />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
})
