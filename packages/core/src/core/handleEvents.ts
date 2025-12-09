import { EVENTTYPES, STATUS_CODE } from '@lz-monitor/common';
import { ErrorTarget, HttpData, RouteHistory } from '@lz-monitor/types';
import {
  getErrorUid,
  getTimestamp,
  hashMapExist,
  parseUrlToObj,
  unknownToString
} from '@lz-monitor/utils';
import ErrorStackParser from 'error-stack-parser';
import {
  breadcrumb,
  httpTransform,
  openWhiteScreen,
  options,
  resourceTransform,
  transportData
} from './index';

const HandleEvents = {
  // 处理错误
  handleError(event: ErrorTarget) {
    console.log('Error occurred:', event);

    const target = event.target;
    
    // 区分导致错误的目标是否为 DOM 元素 (资源加载错误会有 localName，如 img/script)
    // 如果没有 target 或者 target 没有 localName，则认为是 JS 执行错误
    if (!target || (event.target && !event.target.localName)) {
      // vue和react捕获的报错使用event解析，异步错误使用event.error解析
      // ErrorStackParser 用于解析错误堆栈，获取文件名、行列号
      const stackFrame = ErrorStackParser.parse(!target ? event : event.error)[0];
      const { fileName, columnNumber, lineNumber } = stackFrame;
      
      // 组装错误上报数据
      const errorData = {
        type: EVENTTYPES.ERROR,
        status: STATUS_CODE.ERROR,
        time: getTimestamp(),
        message: event.message,
        fileName,
        line: lineNumber,
        column: columnNumber
      };

      // 将错误记录添加到行为栈（面包屑）中
      breadcrumb.push({
        type: EVENTTYPES.ERROR,
        category: breadcrumb.getCategory(EVENTTYPES.ERROR),
        data: errorData,
        time: getTimestamp(),
        status: STATUS_CODE.ERROR
      });

      // 生成错误的唯一 hash，用于去重判断
      const hash: string = getErrorUid(
        `${EVENTTYPES.ERROR}-${event.message}-${fileName}-${columnNumber}`
      );
      
      // 开启repeatCodeError第一次报错才上报
      // 如果允许重复上报，或者该错误 hash 尚未存在（即第一次出现），则进行上报
      if (!options.repeatCodeError || (options.repeatCodeError && !hashMapExist(hash))) {
        return transportData.send(errorData);
      }
    }

    // 资源加载报错 (target 存在且有 localName)
    if (target?.localName) {
      // 提取资源加载的详细信息
      const data = resourceTransform(target);
      
      // 记录资源错误到行为栈
      breadcrumb.push({
        type: EVENTTYPES.RESOURCE,
        category: breadcrumb.getCategory(EVENTTYPES.RESOURCE),
        status: STATUS_CODE.ERROR,
        time: getTimestamp(),
        data
      });
      
      // 上报资源加载错误
      return transportData.send({
        ...data,
        type: EVENTTYPES.RESOURCE,
        status: STATUS_CODE.ERROR
      });
    }
  },
  handleHttp(data: HttpData, type: EVENTTYPES) {
    console.log('HTTP Error occurred:', data);
    const result = httpTransform(data);
    // 添加用户行为，去掉自身上报的接口行为
    if (!data.url.includes(options.dsn)) {
      breadcrumb.push({
        type,
        category: breadcrumb.getCategory(type),
        data: result,
        status: result.status,
        time: data.time
      });
    }

    if (result.status === 'error') {
      // 上报接口错误
      transportData.send({ ...result, type, status: STATUS_CODE.ERROR });
    }
  },
  handleHistory(data: RouteHistory) {
    const { from, to } = data;
    // 定义parsedFrom变量，值为relative
    const { relative: parsedFrom } = parseUrlToObj(from);
    const { relative: parsedTo } = parseUrlToObj(to);
    breadcrumb.push({
      type: EVENTTYPES.HISTORY,
      category: breadcrumb.getCategory(EVENTTYPES.HISTORY),
      data: {
        from: parsedFrom ? parsedFrom : '/',
        to: parsedTo ? parsedTo : '/'
      },
      time: getTimestamp(),
      status: STATUS_CODE.OK
    });
  },
  handleHashchange(data: HashChangeEvent) {
    const { oldURL, newURL } = data;
    const { relative: from } = parseUrlToObj(oldURL);
    const { relative: to } = parseUrlToObj(newURL);
    breadcrumb.push({
      type: EVENTTYPES.HASHCHANGE,
      category: breadcrumb.getCategory(EVENTTYPES.HASHCHANGE),
      data: {
        from,
        to
      },
      time: getTimestamp(),
      status: STATUS_CODE.OK
    });
  },
  handleUnhandleRejection(event: PromiseRejectionEvent) {
    const stackFrame = ErrorStackParser.parse(event.reason)[0];
    const { fileName, columnNumber, lineNumber } = stackFrame;
    const message = unknownToString(event.reason.message || event.reason.stack);
    const data = {
      type: EVENTTYPES.UNHANDLEDREJECTION,
      status: STATUS_CODE.ERROR,
      time: getTimestamp(),
      message,
      fileName,
      line: lineNumber,
      column: columnNumber
    };

    breadcrumb.push({
      type: EVENTTYPES.UNHANDLEDREJECTION,
      category: breadcrumb.getCategory(EVENTTYPES.UNHANDLEDREJECTION),
      time: getTimestamp(),
      status: STATUS_CODE.ERROR,
      data
    });
    const hash: string = getErrorUid(
      `${EVENTTYPES.UNHANDLEDREJECTION}-${message}-${fileName}-${columnNumber}`
    );
    // 开启repeatCodeError第一次报错才上报
    if (!options.repeatCodeError || (options.repeatCodeError && !hashMapExist(hash))) {
      transportData.send(data);
    }
  },
  handleWhiteScreen() {
    openWhiteScreen((res: any) => {
      // 上报白屏检测信息
      transportData.send({
        type: EVENTTYPES.WHITESCREEN,
        time: getTimestamp(),
        ...res
      });
    }, options);
  }
};

export { HandleEvents };
