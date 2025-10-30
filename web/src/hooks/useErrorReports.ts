import { getErrorReportList } from '@/api/error-report';
import type { ErrorReportQuery } from '@/api/error-report/error-report.type';
import { useQuery } from '@tanstack/react-query';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { message } from 'antd';

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

      // 新版接口响应结构为 { data, total, page, pageSize }
      if (res.data && Array.isArray(res.data)) {
        dataList = res.data;
      } else if ((res as any).list) {
        // 兼容旧版响应结构
        dataList = (res as any).list;
      } else if (Array.isArray(res)) {
        dataList = res as any[];
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
        page: res.page || params.page || 1,
        pageSize: res.pageSize || params.pageSize || 10
      };
    },
    staleTime: 1000 * 60 // 1分钟
  });
}
