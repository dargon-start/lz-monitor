import {
  batchDeleteErrorReports,
  batchUpdateErrorReportStatus,
  deleteErrorReport,
  getErrorReportList,
  updateErrorReportStatus
} from '@/api/error-report';
import type { ErrorReportQuery } from '@/api/error-report/error-report.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

// Query Keys
export const errorReportKeys = {
  all: ['errorReports'] as const,
  lists: () => [...errorReportKeys.all, 'list'] as const,
  list: (params: ErrorReportQuery) => [...errorReportKeys.lists(), params] as const,
  detail: (id: string) => [...errorReportKeys.all, 'detail', id] as const
};

/**
 * 获取错误报告列表
 */
export function useErrorReports(params: ErrorReportQuery) {
  return useQuery({
    queryKey: errorReportKeys.list(params),
    queryFn: async () => {
      const res = await getErrorReportList(params);
      console.log('API Response:', res);

      let dataList = [];

      // 兼容不同的响应结构
      if (res.list) {
        dataList = res.list;
      } else if (Array.isArray(res)) {
        dataList = res as any[];
      } else if ((res as any).data && Array.isArray((res as any).data)) {
        dataList = (res as any).data;
      } else {
        console.warn('Unexpected response structure:', res);
        dataList = [];
      }

      const data = dataList.map((item: any, index: number) => ({
        ...item,
        key: item.id || item._id || index.toString()
      }));

      console.log('Processed data:', data);
      console.log('Sample item structure:', data[0]);

      return {
        list: data,
        total: res.total || dataList.length || 0,
        page: params.page || 1,
        pageSize: params.pageSize || 10
      };
    },
    staleTime: 1000 * 60 // 1分钟
  });
}

/**
 * 更新错误报告状态
 */
export function useUpdateErrorReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'resolved' | 'ignored' }) =>
      updateErrorReportStatus(id, status),
    onSuccess: () => {
      message.success('状态更新成功');
      // 重新获取列表数据
      queryClient.invalidateQueries({ queryKey: errorReportKeys.lists() });
    },
    onError: (error: any) => {
      message.error(error?.message || '状态更新失败');
      console.error('Error updating status:', error);
    }
  });
}

/**
 * 删除错误报告
 */
export function useDeleteErrorReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteErrorReport(id),
    onSuccess: () => {
      message.success('删除成功');
      // 重新获取列表数据
      queryClient.invalidateQueries({ queryKey: errorReportKeys.lists() });
    },
    onError: (error: any) => {
      message.error(error?.message || '删除失败');
      console.error('Error deleting error report:', error);
    }
  });
}

/**
 * 批量删除错误报告
 */
export function useBatchDeleteErrorReports() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => batchDeleteErrorReports(ids),
    onSuccess: () => {
      message.success('批量删除成功');
      // 重新获取列表数据
      queryClient.invalidateQueries({ queryKey: errorReportKeys.lists() });
    },
    onError: (error: any) => {
      message.error(error?.message || '批量删除失败');
      console.error('Error batch deleting error reports:', error);
    }
  });
}

/**
 * 批量更新错误报告状态
 */
export function useBatchUpdateErrorReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: 'pending' | 'resolved' | 'ignored' }) =>
      batchUpdateErrorReportStatus(ids, status),
    onSuccess: () => {
      message.success('批量更新成功');
      // 重新获取列表数据
      queryClient.invalidateQueries({ queryKey: errorReportKeys.lists() });
    },
    onError: (error: any) => {
      message.error(error?.message || '批量更新失败');
      console.error('Error batch updating status:', error);
    }
  });
}
