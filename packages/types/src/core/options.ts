export interface InitOptions {
  dsn: string; // 监控上报接口地址
  apiKey: string; // 项目API密钥
  throttleDelayTime?: number; // click事件的节流时长
  overTime?: number; // 接口超时时长
  whiteBoxElements?: string[]; // 白屏检测的容器列表
  silentWhiteScreen?: boolean; // 是否开启白屏检测
  skeletonProject?: boolean; // 项目是否有骨架屏
  filterXhrUrlRegExp?: RegExp; // 过滤的接口请求正则
  handleHttpStatus?: (data: any) => boolean; // 处理接口返回的 response
  repeatCodeError?: boolean; // 是否去除重复的代码错误
  disabled?: boolean; // 是否禁用监控
  userId?: string; // 用户ID
  beforeDataReport?: (data: any) => any; // 数据上报前的钩子函数
  maxBreadcrumbs?: number; // 用户行为栈最大长度
}
