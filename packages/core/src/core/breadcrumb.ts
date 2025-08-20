/*
  用户行为栈
*/

import { BREADCRUMBTYPES, EVENTTYPES } from '@lz-monitor/common';
import { BreadcrumbData, InitOptions } from '@lz-monitor/types';
import { _support, getTimestamp, validateOption } from '@lz-monitor/utils';

export class Breadcrumb {
  maxBreadcrumbs = 20; // 用户行为存放的最大长度
  beforePushBreadcrumb: unknown = null;
  stack: BreadcrumbData[];

  constructor() {
    this.stack = [];
  }

  immediatePush(data: BreadcrumbData): void {
    data.time || (data.time = getTimestamp());
    if (this.stack.length > this.maxBreadcrumbs) {
      this.shift();
    }
    this.stack.push(data);
    // 按照时间线排序
    this.stack.sort((a, b) => a.time - b.time);
  }

  push(data: BreadcrumbData) {
    // 处理前置钩子, 作用；用户自定义处理数据
    if (typeof this.beforePushBreadcrumb === 'function') {
      const res = this.beforePushBreadcrumb(data);
      if (!res) return;
      this.immediatePush(res);
      return;
    }
    this.immediatePush(data);
  }

  shift() {
    return this.stack.shift();
  }

  clear() {
    this.stack = [];
  }

  getStack() {
    return this.stack;
  }

  getCategory(type: EVENTTYPES): BREADCRUMBTYPES {
    switch (type) {
      // 接口请求
      case EVENTTYPES.XHR:
      case EVENTTYPES.FETCH:
        return BREADCRUMBTYPES.HTTP;

      // 用户点击
      case EVENTTYPES.CLICK:
        return BREADCRUMBTYPES.CLICK;

      // 路由变化
      case EVENTTYPES.HISTORY:
      case EVENTTYPES.HASHCHANGE:
        return BREADCRUMBTYPES.ROUTE;

      // 加载资源
      case EVENTTYPES.RESOURCE:
        return BREADCRUMBTYPES.RESOURCE;

      // Js代码报错
      case EVENTTYPES.UNHANDLEDREJECTION:
      case EVENTTYPES.ERROR:
        return BREADCRUMBTYPES.CODEERROR;

      // 用户自定义
      default:
        return BREADCRUMBTYPES.CUSTOM;
    }
  }

  bindOptions(options: InitOptions): void {
    // maxBreadcrumbs 用户行为存放的最大容量
    // beforePushBreadcrumb 添加用户行为前的处理函数
    const { maxBreadcrumbs, beforePushBreadcrumb } = options;
    validateOption(maxBreadcrumbs, 'maxBreadcrumbs', 'number') &&
      (this.maxBreadcrumbs = maxBreadcrumbs || 20);
    validateOption(beforePushBreadcrumb, 'beforePushBreadcrumb', 'function') &&
      (this.beforePushBreadcrumb = beforePushBreadcrumb);
  }
}

const breadcrumb = _support.breadcrumb || (_support.breadcrumb = new Breadcrumb());

export { breadcrumb };
