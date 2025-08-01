/// <reference types="vite/client" />

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const worker: {
  start: () => void
}
