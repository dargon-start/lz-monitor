import request from '../request';
import type {
  CreateErrorReportDto,
  ErrorReportListResponse,
  ErrorReportQuery,
  ErrorReportStats
} from './error-report.type';

/**
 * 获取错误列表（新接口）
 */
export const getErrorReportList = (params: ErrorReportQuery) => {
  return request.get<ErrorReportListResponse>({
    url: '/monitor/errors',
    params
  });
};

/**
 * 获取HTTP请求列表
 */
export const getHttpRequestList = (params: ErrorReportQuery) => {
  return request.get<ErrorReportListResponse>({
    url: '/monitor/http-requests',
    params
  });
};

/**
 * 获取性能指标列表
 */
export const getPerformanceList = (params: ErrorReportQuery) => {
  return request.get<ErrorReportListResponse>({
    url: '/monitor/performance',
    params
  });
};

/**
 * 获取会话列表
 */
export const getSessionList = (params: ErrorReportQuery) => {
  return request.get<ErrorReportListResponse>({
    url: '/monitor/sessions',
    params
  });
};

/**
 * 获取统计概览（新接口）
 */
export const getErrorReportStats = (params?: {
  apiKey?: string;
  startTime?: number;
  endTime?: number;
}) => {
  return request.get<ErrorReportStats>({
    url: '/monitor/statistics',
    params
  });
};

/**
 * 上报监控事件（新接口）
 */
export const createErrorReport = (data: CreateErrorReportDto) => {
  return request.post<{ success: boolean; message: string }>({
    url: '/monitor/report',
    data
  });
};
