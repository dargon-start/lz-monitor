// 面包屑信息
export interface Breadcrumb {
  type: string; // 类型
  category: string; // 分类
  status: string; // 状态
  time: number; // 时间戳
  data: any; // 数据
}

// 设备信息（简化版）
export interface DeviceInfo {
  browser?: string; // 浏览器
  browserVersion?: string; // 浏览器版本
  os?: string; // 操作系统
  osVersion?: string; // 系统版本
  device?: string; // 设备型号
  device_type?: string; // 设备类型：pc/mobile/tablet
  ua?: string; // User Agent
  screenResolution?: string; // 屏幕分辨率
}

// 长任务信息
export interface LongTask {
  duration?: number; // 持续时间
  startTime?: number; // 开始时间
  [key: string]: any;
}

// 内存信息
export interface MemoryInfo {
  jsHeapSizeLimit?: number;
  totalJSHeapSize?: number;
  usedJSHeapSize?: number;
  [key: string]: any;
}

// 创建监控事件DTO (对应后端 CreateMonitorEventDto)
export interface CreateErrorReportDto {
  apiKey: string; // 项目API密钥
  type: string; // 事件类型：error/unhandledrejection/resource/xhr/fetch/performance/whiteScreen
  uuid: string; // 会话ID
  userId?: string; // 用户ID
  pageUrl: string; // 页面地址
  time: number; // 事件发生时间戳
  sdkVersion?: string; // SDK版本
  
  // 错误相关字段
  message?: string; // 错误消息
  fileName?: string; // 错误文件
  line?: number; // 错误行号
  column?: number; // 错误列号
  stack?: string; // 错误堆栈
  name?: string; // 错误名称或资源名称
  
  // HTTP请求相关字段
  method?: string; // HTTP方法
  url?: string; // 请求URL
  Status?: number; // HTTP状态码（注意大写）
  status?: string; // 状态：ok/error
  elapsedTime?: number; // 请求耗时
  requestData?: any; // 请求数据
  response?: any; // 响应数据
  
  // 性能指标相关字段
  value?: number; // 指标值
  rating?: string; // 评级：good/needs-improvement/poor
  longTask?: LongTask; // 长任务信息
  memory?: MemoryInfo; // 内存信息
  
  // 白屏检测相关字段
  emptyPoints?: number; // 空白采样点数量
  skeletonData?: any; // 骨架屏数据
  
  // 设备信息
  deviceInfo?: DeviceInfo;
  
  // 上下文信息
  breadcrumb?: Breadcrumb[]; // 用户行为栈
  recordScreenId?: string; // 录屏ID
  extraData?: Record<string, any>; // 扩展数据
}

// 错误监控实体 (从后端返回)
export interface ErrorReport {
  id: number; // 错误ID
  apiKey: string; // 项目API密钥
  errorType: string; // 错误类型
  errorHash?: string; // 错误哈希
  
  // 错误详情
  message?: string;
  fileName?: string;
  line?: number;
  column?: number;
  stack?: string;
  name?: string;
  
  // 页面信息
  pageUrl: string;
  uuid: string;
  userId?: string;
  
  // 设备信息
  browser?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  deviceType?: string;
  device?: string;
  ua?: string;
  
  // 上下文信息
  breadcrumb?: Breadcrumb[];
  recordScreenId?: string;
  extraData?: Record<string, any>;
  
  // 元信息
  ip?: string;
  sdkVersion?: string;
  status: string;
  time: number;
  createdAt: string;
}

// HTTP请求监控实体
export interface HttpRequest {
  id: number;
  apiKey: string;
  requestType: string; // xhr/fetch
  method?: string;
  url: string;
  urlHash?: string;
  httpStatus?: number;
  status?: string; // ok/error
  elapsedTime?: number;
  requestSize?: number;
  responseSize?: number;
  requestData?: any;
  responseData?: any;
  message?: string;
  pageUrl: string;
  uuid: string;
  userId?: string;
  browser?: string;
  os?: string;
  deviceType?: string;
  ip?: string;
  sdkVersion?: string;
  time: number;
  createdAt: string;
}

// 性能监控实体
export interface Performance {
  id: number;
  apiKey: string;
  metricName: string; // FCP/LCP/FID/CLS/TTFB
  value: number;
  rating?: string;
  pageUrl: string;
  uuid: string;
  userId?: string;
  browser?: string;
  os?: string;
  deviceType?: string;
  longTask?: LongTask;
  memory?: MemoryInfo;
  ip?: string;
  sdkVersion?: string;
  time: number;
  createdAt: string;
}

// 会话信息实体
export interface Session {
  id: number;
  apiKey: string;
  uuid: string;
  userId?: string;
  entryUrl?: string;
  exitUrl?: string;
  pageViews: number;
  duration?: number;
  browser?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  device?: string;
  deviceType?: string;
  ua?: string;
  screenResolution?: string;
  ip?: string;
  country?: string;
  province?: string;
  city?: string;
  errorCount: number;
  httpErrorCount: number;
  whiteScreen: number;
  sdkVersion?: string;
  firstSeenAt: number;
  lastSeenAt: number;
  createdAt: string;
  updatedAt: string;
}

// 查询参数（通用）
export interface ErrorReportQuery {
  page?: number; // 页码
  pageSize?: number; // 每页大小
  apiKey?: string; // 项目API密钥
  type?: string; // 事件类型
  types?: string[]; // 多个事件类型
  status?: string; // 状态
  userId?: string; // 用户ID
  uuid?: string; // 会话ID
  pageUrl?: string; // URL模糊查询
  startTime?: number; // 开始时间戳
  endTime?: number; // 结束时间戳
  httpStatus?: number; // HTTP状态码
  fileName?: string; // 文件名
  browser?: string; // 浏览器
  os?: string; // 操作系统
  deviceType?: string; // 设备类型
  message?: string; // 错误消息
  sortBy?: string; // 排序字段
  sortOrder?: 'ASC' | 'DESC'; // 排序方向
}

// 统计概览响应
export interface ErrorReportStats {
  // 错误统计
  errorCount: number;
  jsErrorCount: number;
  resourceErrorCount: number;
  promiseErrorCount: number;
  
  // HTTP统计
  httpRequestCount: number;
  httpErrorCount: number;
  avgResponseTime?: number;
  
  // 性能统计
  avgFcp?: number;
  avgLcp?: number;
  avgFid?: number;
  avgCls?: number;
  
  // 用户统计
  sessionCount: number;
  uniqueUsers: number;
  pv: number;
  whiteScreenCount: number;
  
  // 分布统计
  deviceDistribution?: Record<string, number>;
  browserDistribution?: Record<string, number>;
  
  [key: string]: any;
}

// 分页响应（通用）
export interface ErrorReportListResponse {
  data: ErrorReport[]; // 数据列表
  total: number; // 总数
  page: number; // 当前页
  pageSize: number; // 每页大小
  totalPages?: number; // 总页数
}
