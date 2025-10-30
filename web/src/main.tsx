import '@ant-design/v5-patch-for-react-19';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// import worker from './_mock';
import lzMonitor from '@lz-monitor/core';
lzMonitor.init({
  dsn: 'http://localhost:3001/monitor/report',
  apiKey: 'sdk-web',
  userId: 'lz'
});

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <App />
  // </StrictMode>
);

// 暂时注释掉监控SDK初始化，调试完成后再启用
// monitor.init({
//   dsn: 'http://localhost:3001/monitor/report',
//   apiKey: 'sdk-web',
//   userId: 'lz'
// });

// worker.start({ onUnhandledRequest: 'bypass' });
