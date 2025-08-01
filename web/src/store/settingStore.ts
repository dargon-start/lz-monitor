import { create } from 'zustand'
import { StorageEnum, ThemeColorPresets, ThemeMode } from '#/enum'
import { persist, createJSONStorage } from 'zustand/middleware'

type SettingsType = {
  themeColorPresets: ThemeColorPresets
  themeMode: ThemeMode
}

type SettingStore = {
  settings: SettingsType
  // 使用 actions 命名空间来存放所有的 action
  actions: {
    setSettings: (settings: SettingsType) => void
    clearSettings: () => void
  }
}

const useSettingStore = create<SettingStore>()(
  persist(
    set => ({
      settings: {
        themeColorPresets: ThemeColorPresets.Default,
        themeMode: ThemeMode.Light
      },
      actions: {
        setSettings: (settings: SettingsType) => {
          set({ settings })
        },
        clearSettings: () => {
          useSettingStore.persist.clearStorage()
        }
      }
    }),
    {
      name: StorageEnum.Settings, // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: state => ({ [StorageEnum.Settings]: state.settings })
    }
  )
)

export const useSettings = () => useSettingStore(state => state.settings)
export const useSettingActions = () => useSettingStore(state => state.actions)
