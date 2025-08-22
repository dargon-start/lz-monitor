import { InitOptions } from '@lz-monitor/types';
import { _support, setSilentFlag, validateOption } from '@lz-monitor/utils';
import { breadcrumb } from './breadcrumb';
import { transportData } from './reportData';

export class Options {
  dsn = ''; // 监控上报接口的地址
  throttleDelayTime = 0; // click事件的节流时长
  overTime = 10; // 接口超时时长
  whiteBoxElements: string[] = ['html', 'body', '#app', '#root']; // 白屏检测的容器列表
  silentWhiteScreen = false; // 是否开启白屏检测
  skeletonProject = false; // 项目是否有骨架屏
  filterXhrUrlRegExp: any; // 过滤的接口请求正则
  handleHttpStatus: any; // 处理接口返回的 response
  repeatCodeError = false; // 是否去除重复的代码错误，重复的错误只上报一次
  constructor() {}
  bindOptions(options: InitOptions): void {
    const {
      dsn,
      filterXhrUrlRegExp,
      throttleDelayTime = 0,
      overTime = 10,
      silentWhiteScreen = false,
      whiteBoxElements = ['html', 'body', '#app', '#root'],
      skeletonProject = false,
      handleHttpStatus,
      repeatCodeError = false
    } = options;

    // 定义需要校验的配置项
    const validationRules = [
      { value: dsn, name: 'dsn', type: 'string' },
      {
        value: throttleDelayTime,
        name: 'throttleDelayTime',
        type: 'number'
      },
      { value: overTime, name: 'overTime', type: 'number' },
      {
        value: filterXhrUrlRegExp,
        name: 'filterXhrUrlRegExp',
        type: 'regexp'
      },
      {
        value: silentWhiteScreen,
        name: 'silentWhiteScreen',
        type: 'boolean'
      },
      {
        value: skeletonProject,
        name: 'skeletonProject',
        type: 'boolean'
      },
      {
        value: whiteBoxElements,
        name: 'whiteBoxElements',
        type: 'array'
      },
      {
        value: handleHttpStatus,
        name: 'handleHttpStatus',
        type: 'function'
      },
      {
        value: repeatCodeError,
        name: 'repeatCodeError',
        type: 'boolean'
      }
    ];

    // 批量校验并设置配置项
    this.validateAndSetOptions(validationRules);
  }

  private validateAndSetOptions(
    rules: Array<{
      value: any;
      name: string;
      type: string;
    }>
  ): void {
    rules.forEach(({ value, name, type }) => {
      if (validateOption(value, name, type)) {
        (this as any)[name] = value;
      }
    });
  }
}

const options = _support.options || (_support.options = new Options());

export function handleOptions(paramOptions: InitOptions): void {
  // setSilentFlag 给全局添加已设置的标识，防止重复设置
  setSilentFlag(paramOptions);
  // 设置用户行为的配置项
  breadcrumb.bindOptions(paramOptions);
  // transportData 配置上报的信息
  transportData.bindOptions(paramOptions);
  // 绑定其他配置项
  options.bindOptions(paramOptions);
}

export { options };
