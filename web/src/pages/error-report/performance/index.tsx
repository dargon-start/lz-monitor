import type { ErrorReportQuery, Performance } from '@/api/error-report/error-report.type';
import { usePerformance } from '@/hooks/usePerformance';
import { Table } from 'antd';
import { memo, useMemo, useState } from 'react';
import { createColumns } from './columns';
import OverviewCards from './components/OverviewCards';
import PerformanceDetailModal from './components/PerformanceDetailModal';
import SearchForm from './components/SearchForm';
import TrendChart from './components/TrendChart';

interface DataType extends Performance {
  key: string;
}

const INITIAL_QUERY: ErrorReportQuery = {
  page: 1,
  pageSize: 10
};

export default memo(function PerformanceList() {
  // 查询参数状态
  const [query, setQuery] = useState<ErrorReportQuery>(INITIAL_QUERY);

  // 详情模态框状态
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Performance | null>(null);

  // 使用 React Query 获取数据
  const { data, isLoading } = usePerformance(query);

  // 处理搜索
  const handleSearch = () => {
    setQuery(prev => ({ ...prev, page: 1 }));
  };

  // 重置搜索
  const handleReset = () => {
    setQuery(INITIAL_QUERY);
  };

  // 查看详情
  const handleViewDetail = (record: Performance) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  // 关闭详情
  const handleCloseDetail = () => {
    setSelectedRecord(null);
    setDetailVisible(false);
  };

  // 表格列配置
  const columns = useMemo(() => createColumns({ onViewDetail: handleViewDetail }), []);

  // 表格数据源
  const dataSource = useMemo<DataType[]>(() => data?.list || [], [data?.list]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* 固定的搜索表单区域 */}
      <div className="flex-shrink-0 p-3 bg-white border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">性能指标列表</h2>
        <SearchForm
          query={query}
          onChange={setQuery}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      </div>

      {/* 可滚动内容区域 */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* 概览卡片 */}
        {dataSource.length > 0 && (
          <div className="mb-4">
            <OverviewCards data={dataSource} />
          </div>
        )}

        {/* 趋势图表 */}
        {dataSource.length > 0 && (
          <div className="mb-4">
            <TrendChart data={dataSource} />
          </div>
        )}

        {/* 表格 */}
        <div>
          <Table<DataType>
            columns={columns}
            size="middle"
            dataSource={dataSource}
            loading={isLoading}
            scroll={{ x: 1200 }}
            pagination={{
              current: query.page,
              pageSize: query.pageSize,
              total: data?.total || 0,
              showTotal: total => `共 ${total} 条数据`,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: (page, pageSize) => {
                setQuery(prev => ({ ...prev, page, pageSize }));
              }
            }}
          />
        </div>
      </div>

      {/* 详情模态框 */}
      <PerformanceDetailModal
        visible={detailVisible}
        record={selectedRecord}
        onClose={handleCloseDetail}
      />
    </div>
  );
});
