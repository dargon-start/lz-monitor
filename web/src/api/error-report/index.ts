import request from '../request'
import type { 
  ErrorReport, 
  ErrorReportQuery, 
  ErrorReportListResponse,
  ErrorReportStats,
  CreateErrorReportDto 
} from './error-report.type'

/**
 * 获取错误报告列表
 */
export const getErrorReportList = (params: ErrorReportQuery) => {
  return request.post<ErrorReportListResponse>({
    url: '/error/list',
    data: params
  })
}

/**
 * 获取错误报告详情
 */
export const getErrorReportDetail = (id: string) => {
  return request.get<ErrorReport>({
    url: `/error-reports/${id}`
  })
}

/**
 * 创建错误报告
 */
export const createErrorReport = (data: CreateErrorReportDto) => {
  return request.post<{ id: string }>({
    url: '/error-reports',
    data
  })
}

/**
 * 更新错误报告状态
 */
export const updateErrorReportStatus = (id: string, status: 'pending' | 'resolved' | 'ignored') => {
  return request.put({
    url: `/error-reports/${id}/status`,
    data: { status }
  })
}

/**
 * 删除错误报告
 */
export const deleteErrorReport = (id: string) => {
  return request.delete({
    url: `/error-reports/${id}`
  })
}

/**
 * 批量删除错误报告
 */
export const batchDeleteErrorReports = (ids: string[]) => {
  return request.delete({
    url: '/error-reports/batch',
    data: { ids }
  })
}

/**
 * 批量更新错误报告状态
 */
export const batchUpdateErrorReportStatus = (ids: string[], status: 'pending' | 'resolved' | 'ignored') => {
  return request.put({
    url: '/error-reports/batch/status',
    data: { ids, status }
  })
}

/**
 * 获取错误报告统计数据
 */
export const getErrorReportStats = (appId?: string) => {
  return request.get<ErrorReportStats>({
    url: '/error-reports/stats',
    params: { appId }
  })
}

/**
 * 导出错误报告
 */
export const exportErrorReports = (params: ErrorReportQuery) => {
  return request.get({
    url: '/error-reports/export',
    params,
    responseType: 'blob'
  })
}
