import { getPerformanceList } from '@/api/error-report';
import type { ErrorReportQuery, Performance } from '@/api/error-report/error-report.type';
import { useQuery } from '@tanstack/react-query';

// Query Keys
export const performanceKeys = {
  all: ['performance'] as const,
  lists: () => [...performanceKeys.all, 'list'] as const,
  list: (params: ErrorReportQuery) => [...performanceKeys.lists(), params] as const,
  detail: (id: string) => [...performanceKeys.all, 'detail', id] as const
};

/**
 * 获取性能指标列表
 */
export function usePerformance(params: ErrorReportQuery) {
  return useQuery({
    queryKey: performanceKeys.list(params),
    queryFn: async () => {
      const res = await getPerformanceList(params);
      console.log('Performance API Response:', res);

      let dataList: Performance[] = [];

      // 新版接口响应结构为 { data, total, page, pageSize }
      if (res.data && Array.isArray(res.data)) {
        dataList = res.data as Performance[];
      } else if ((res as any).list) {
        // 兼容旧版响应结构
        dataList = (res as any).list as Performance[];
      } else if (Array.isArray(res)) {
        dataList = res as Performance[];
      } else {
        console.warn('Unexpected response structure:', res);
        dataList = [];
      }

      const data = dataList.map((item: Performance, index: number) => ({
        ...item,
        key: item.id?.toString() || index.toString()
      }));

      console.log('Processed performance data:', data);
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
