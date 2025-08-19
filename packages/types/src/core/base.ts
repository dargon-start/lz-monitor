import { BREADCRUMBTYPES, EVENTTYPES, STATUS_CODE } from '@lz-monitor/common';

export interface ErrorTarget {
  target?: {
    localName?: string;
  };
  error?: any;
  message?: string;
}

export interface BreadcrumbData {
  type: EVENTTYPES; // 事件类型
  category: BREADCRUMBTYPES; // 用户行为类型
  status: STATUS_CODE; // 行为状态
  time: number; // 发生时间
  data: any;
}

export interface Monitor {
  hasError: false; // 某段时间代码是否报错
  events: string[]; // 存储录屏的信息
  recordScreenId: string; // 本次录屏的id
  _loopTimer: number; // 白屏循环检测的timer
  transportData: any; // 数据上报
  options: any; // 配置信息
  replaceFlag: {
    // 订阅消息
    [key: string]: any;
  };
  deviceInfo: {
    // 设备信息
    [key: string]: any;
  };
}

export interface Window {
  chrome: {
    app: {
      [key: string]: any;
    };
  };
  history: any;
  addEventListener: any;
  innerWidth: any;
  innerHeight: any;
  onpopstate: any;
  performance: any;
  __monitor__: {
    [key: string]: any;
  };
}
