import { TableRef } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';

/**
 * 自定义 Hook: 动态计算表格滚动高度
 * 自动获取 Ant Design Table 组件的表头和分页器高度，无需手动传入
 * @param minHeight 最小高度，默认 200px
 * @param extraPadding 额外的间距，默认 16px
 * @returns [tableRef, tableScrollY] - 表格容器引用和计算后的滚动高度
 */
export function useTableScrollY(minHeight: number = 200, extraPadding: number = 16) {
  const tableRef = useRef<TableRef>(null);
  const [tableScrollY, setTableScrollY] = useState<number>(minHeight);

  useEffect(() => {
    const updateTableHeight = () => {
      if (!tableRef.current) return;

      const container = tableRef.current.nativeElement;
      const containerHeight = container.clientHeight;

      // 查找表头高度（.ant-table-thead）
      const tableHeader = container.querySelector('.ant-table-thead');
      const headerHeight = tableHeader?.clientHeight || 55; // 默认表头高度 55px

      // 查找分页器高度（.ant-pagination）
      const pagination = container.querySelector('.ant-pagination');
      const paginationHeight = pagination?.clientHeight || 64; // 默认分页器高度 64px

      // 计算可用的滚动高度：容器高度 - 表头高度 - 分页器高度 - 额外间距
      const scrollY = containerHeight - headerHeight - paginationHeight - extraPadding;

      // 设置滚动高度，但不能小于最小高度
      setTableScrollY(scrollY > minHeight ? scrollY : minHeight);
    };

    // 初始化计算（延迟执行，确保 DOM 已渲染）
    const timer = setTimeout(updateTableHeight, 100);

    // 监听窗口大小变化
    window.addEventListener('resize', updateTableHeight);

    // 使用 ResizeObserver 监听容器大小变化（更精确）
    let resizeObserver: ResizeObserver | null = null;
    if (tableRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        // 延迟执行，确保 DOM 更新完成
        setTimeout(updateTableHeight, 50);
      });
      resizeObserver.observe(tableRef.current.nativeElement);
    }

    // 使用 MutationObserver 监听 DOM 变化（例如分页器的显示/隐藏）
    let mutationObserver: MutationObserver | null = null;
    if (tableRef.current && typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(() => {
        setTimeout(updateTableHeight, 50);
      });
      mutationObserver.observe(tableRef.current.nativeElement, {
        childList: true,
        subtree: true
      });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateTableHeight);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
    };
  }, [minHeight, extraPadding]);

  return [tableRef, tableScrollY] as const;
}
