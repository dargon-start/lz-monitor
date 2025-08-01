// 设备信息
export interface DeviceInfo {
  deviceType?: string // 设备类型 (mobile, desktop, tablet)
  screenResolution?: string // 屏幕分辨率
  viewportSize?: string // 视口大小
  pixelRatio?: number // 像素比
  colorDepth?: number // 颜色深度
  orientation?: string // 设备方向
}

// 浏览器信息
export interface BrowserInfo {
  name?: string // 浏览器名称
  version?: string // 浏览器版本
  engine?: string // 浏览器引擎
  userAgent?: string // User Agent
  language?: string // 浏览器语言
  cookieEnabled?: boolean // 是否启用Cookie
  javaEnabled?: boolean // 是否启用Java
  onlineStatus?: boolean // 在线状态
}

// 操作系统信息
export interface OSInfo {
  name?: string // 操作系统名称
  version?: string // 操作系统版本
  platform?: string // 平台
  architecture?: string // 架构
}

// 网络连接信息
export interface NetworkInfo {
  connectionType?: string // 连接类型
  effectiveType?: string // 有效连接类型
  downlink?: number // 下行速度
  rtt?: number // 往返时间
  saveData?: boolean // 是否节省数据
}

// 错误事件数据
export interface ErrorEventData {
  message?: string // 错误消息
  filename?: string // 错误文件名
  lineno?: number // 错误行号
  colno?: number // 错误列号
  stack?: string // 错误堆栈
  componentStack?: string // 组件堆栈（React）
  errorBoundary?: string // 错误边界信息
  props?: Record<string, any> // 组件属性
  source?: string // 错误来源
  [key: string]: any // 其他自定义数据
}

// 创建错误报告DTO (对应后端)
export interface CreateErrorReportDto {
  eventType: string // 事件类型，默认 'error'
  subType: string // 错误子类型 (js-error/xhr/resource/promise等)
  appId: string // 应用ID/标识
  userId?: string // 用户ID
  sessionId: string // 会话ID
  url?: string // 事件发生的URL
  pageTitle?: string // 页面标题
  referrer?: string // 来源URL
  timestamp: number // 事件发生的时间戳
  deviceInfo?: DeviceInfo // 设备信息
  browserInfo?: BrowserInfo // 浏览器信息
  osInfo?: OSInfo // 操作系统信息
  networkInfo?: NetworkInfo // 网络连接信息
  eventData: ErrorEventData // 事件详细数据
}

// 错误报告实体 (从后端返回的完整数据)
export interface ErrorReport {
  id: string // 错误报告ID
  eventType: string // 事件类型
  subType: string // 错误子类型
  appId: string // 应用ID
  userId?: string // 用户ID
  userName?: string // 用户名（关联查询得到）
  sessionId: string // 会话ID
  url?: string // 事件发生的URL
  pageTitle?: string // 页面标题
  referrer?: string // 来源URL
  timestamp: number // 事件发生的时间戳
  deviceInfo?: DeviceInfo // 设备信息
  browserInfo?: BrowserInfo // 浏览器信息
  osInfo?: OSInfo // 操作系统信息
  networkInfo?: NetworkInfo // 网络连接信息
  eventData: ErrorEventData // 事件详细数据
  status: 'pending' | 'resolved' | 'ignored' // 处理状态
  level: 'error' | 'warning' | 'info' // 错误级别
  count: number // 发生次数
  firstOccurred: string // 首次发生时间
  lastOccurred: string // 最后发生时间
  createTime: string // 创建时间
  updateTime: string // 更新时间
}

// 查询参数
export interface ErrorReportQuery {
  page?: number // 页码
  pageSize?: number // 每页大小
  eventType?: string // 事件类型
  subType?: string // 错误子类型
  appId?: string // 应用ID
  userId?: string // 用户ID
  sessionId?: string // 会话ID
  url?: string // URL模糊查询
  level?: 'error' | 'warning' | 'info' // 错误级别
  status?: 'pending' | 'resolved' | 'ignored' // 处理状态
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  keyword?: string // 关键词搜索（错误消息、页面标题等）
}

// 错误报告统计数据
export interface ErrorReportStats {
  totalCount: number // 总错误数
  todayCount: number // 今日错误数
  pendingCount: number // 待处理错误数
  resolvedCount: number // 已解决错误数
  errorTrend: Array<{ // 错误趋势
    date: string
    count: number
  }>
  topErrors: Array<{ // 高频错误
    message: string
    count: number
    percentage: number
  }>
  browserStats: Array<{ // 浏览器分布
    browser: string
    count: number
    percentage: number
  }>
}

// 分页响应
export interface ErrorReportListResponse {
  list: ErrorReport[] // 错误报告列表
  total: number // 总数
  page: number // 当前页
  pageSize: number // 每页大小
  totalPages: number // 总页数
}
