import { createApp } from 'vue';
import lzMonitor from '../../../packages/core/src/index';
import App from './App.vue';
import './style.css';

const app = createApp(App);
app.use(lzMonitor, {
  dsn: 'http://localhost:3001/error/report',
  apiKey: 'vue-test',
  silentWhiteScreen: true,
  skeletonProject: true,
  repeatCodeError: true,
  userId: 'lz'
  // handleHttpStatus(data) {
  //   console.log('data', data);
  //   let { url, response } = data;
  //   // code为200，接口正常，反之亦然
  //   let { code } = typeof response === 'string' ? JSON.parse(response) : response;
  //   if (url.includes('/getErrorList')) {
  //     return code === 200 ? true : false;
  //   } else {
  //     return true;
  //   }
  // }
});

app.mount('#app');
