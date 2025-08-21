import { EVENTTYPES, STATUS_CODE } from '@lz-monitor/common';
import { ErrorTarget } from '@lz-monitor/types';
import { getErrorUid, getTimestamp, hashMapExist } from '@lz-monitor/utils';
import ErrorStackParser from 'error-stack-parser';
import { breadcrumb } from './breadcrumb';
import { options } from './options';
import { transportData } from './reportData';
import { resourceTransform } from './transformData';

const HandleEvents = {
  // 处理错误
  handleError(event: ErrorTarget) {
    console.log('Error occurred:', event);

    const target = event.target;
    if (!target || (event.target && !event.target.localName)) {
      // vue和react捕获的报错使用event解析，异步错误使用event.error解析
      const stackFrame = ErrorStackParser.parse(!target ? event : event.error)[0];
      const { fileName, columnNumber, lineNumber } = stackFrame;
      const errorData = {
        type: EVENTTYPES.ERROR,
        status: STATUS_CODE.ERROR,
        time: getTimestamp(),
        message: event.message,
        fileName,
        line: lineNumber,
        column: columnNumber
      };
      breadcrumb.push({
        type: EVENTTYPES.ERROR,
        category: breadcrumb.getCategory(EVENTTYPES.ERROR),
        data: errorData,
        time: getTimestamp(),
        status: STATUS_CODE.ERROR
      });
      const hash: string = getErrorUid(
        `${EVENTTYPES.ERROR}-${event.message}-${fileName}-${columnNumber}`
      );
      // 开启repeatCodeError第一次报错才上报
      if (!options.repeatCodeError || (options.repeatCodeError && !hashMapExist(hash))) {
        return transportData.send(errorData);
      }
    }

    // 资源加载报错
    if (target?.localName) {
      // 提取资源加载的信息
      const data = resourceTransform(target);
      breadcrumb.push({
        type: EVENTTYPES.RESOURCE,
        category: breadcrumb.getCategory(EVENTTYPES.RESOURCE),
        status: STATUS_CODE.ERROR,
        time: getTimestamp(),
        data
      });
      return transportData.send({
        ...data,
        type: EVENTTYPES.RESOURCE,
        status: STATUS_CODE.ERROR
      });
    }
  },
  handleHttp() {},
  handleHistory() {},
  handleHashchange() {},
  handleUnhandleRejection() {
    console.log('Unhandled Rejection');
  },
  handleWhiteScreen() {}
};

export { HandleEvents };
