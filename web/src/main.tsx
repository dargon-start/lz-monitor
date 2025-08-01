import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19'
import './index.css'
import App from './App.tsx'
import worker from './_mock'
import monitor from './monitor.esm.js'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <App />
  // </StrictMode>
)

monitor.init({
  url:'http://localhost:3000/error/report',
})

worker.start({ onUnhandledRequest: 'bypass' })
