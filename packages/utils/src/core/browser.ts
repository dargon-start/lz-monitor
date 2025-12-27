import { EVENTTYPES } from '@lz-monitor/common';
import { _support, setFlag } from './global';

/**
 * 返回包含id、class、innerTextde字符串的标签
 * @param target html节点
 */
export function htmlElementAsString(target: HTMLElement): string {
  const tagName = target.tagName.toLowerCase();
  if (tagName === 'body') {
    return '';
  }
  let classNames = target.classList.value;

  classNames = classNames !== '' ? ` class='${classNames}'` : '';
  const id = target.id ? ` id="${target.id}"` : '';
  const innerText = target.innerText;
  return `<${tagName}${id}${classNames !== '' ? classNames : ''}>${innerText}</${tagName}>`;
}
/**
 * 将地址字符串转换成对象，
 * 输入：'https://github.com/lz-monitor?token=123&name=11'
 * 输出：{
 *  "host": "github.com",
 *  "path": "/lz-monitor",
 *  "protocol": "https",
 *  "relative": "/lz-monitor?token=123&name=11"
 * }
 */
export function parseUrlToObj(url: string) {
  if (!url) {
    return {};
  }
  const match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
  if (!match) {
    return {};
  }
  const query = match[6] || '';
  const fragment = match[8] || '';
  return {
    host: match[4],
    path: match[5],
    protocol: match[2],
    relative: match[5] + query + fragment
  };
}

export function setEnableFlag({
  enableXhr = true,
  enableFetch = true,
  enableClick = true,
  enableHistory = true,
  enableError = true,
  enableHashchange = true,
  enableUnhandledrejection = true,
  enableWhiteScreen = false
}): void {
  // console.log('setEnableFlag:', enableXhr, enableFetch, enableClick, enableHistory, enableError, enableHashchange, enableUnhandledrejection, enableWhiteScreen);
  setFlag(EVENTTYPES.XHR, !enableXhr);
  setFlag(EVENTTYPES.FETCH, !enableFetch);
  setFlag(EVENTTYPES.CLICK, !enableClick);
  setFlag(EVENTTYPES.HISTORY, !enableHistory);
  setFlag(EVENTTYPES.ERROR, !enableError);
  setFlag(EVENTTYPES.HASHCHANGE, !enableHashchange);
  setFlag(EVENTTYPES.UNHANDLEDREJECTION, !enableUnhandledrejection);
  setFlag(EVENTTYPES.WHITESCREEN, !enableWhiteScreen);
}

// 对每一个错误详情，生成唯一的编码
export function getErrorUid(input: string): string {
  return window.btoa(encodeURIComponent(input));
}

export function hashMapExist(hash: string): boolean {
  const exist = _support.errorMap.has(hash);
  if (!exist) {
    _support.errorMap.set(hash, true);
  }
  return exist;
}
