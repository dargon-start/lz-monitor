import { Monitor, Window } from '@lz-monitor/types';
import { UAParser } from 'ua-parser-js';
import { variableTypeDetection } from './verifyType';

export const isBrowserEnv = variableTypeDetection.isWindow(
  typeof window !== 'undefined' ? window : 0
);

// 获取全局变量
export function getGlobal(): Window {
  return window as unknown as Window;
}

const _global = getGlobal();
const _support = getGlobalSupport();
const uaResult = new UAParser().getResult();

// 获取设备信息
_support.deviceInfo = {
  browserVersion: uaResult.browser.version, // 浏览器版本号 107.0.0.0
  browser: uaResult.browser.name, // 浏览器类型 Chrome
  osVersion: uaResult.os.version, // 操作系统 电脑系统 10
  os: uaResult.os.name, // Windows
  ua: uaResult.ua,
  device: uaResult.device.model ? uaResult.device.model : 'Unknow',
  device_type: uaResult.device.type ? uaResult.device.type : 'Pc'
};

_support.hasError = false; // 是否有代码错误

// errorMap 存储代码错误的集合
_support.errorMap = new Map();

_support.replaceFlag = _support.replaceFlag || {};

// replaceFlag 存储类型订阅，决定开启或关闭哪些类型的监控功能
const replaceFlag = _support.replaceFlag;

export function setFlag(replaceType: string, isSet: boolean) {
  if (replaceFlag[replaceType]) return;
  replaceFlag[replaceType] = isSet;
}

export function getFlag(replaceType: string) {
  return replaceFlag[replaceType];
}

// 获取全部变量__monitor__的引用地址
export function getGlobalSupport() {
  _global._monitor_ = _global._monitor_ || ({} as Monitor);
  return _global._monitor_;
}

export function supportsHistory(): boolean {
  const chrome = _global.chrome;
  const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
  const hasHistoryApi =
    'history' in _global &&
    !!(_global.history as History).pushState &&
    !!(_global.history as History).replaceState;
  return !isChromePackagedApp && hasHistoryApi;
}

export { _global, _support };
