import type { ErrorReport, ErrorReportQuery } from '@/api/error-report/error-report.type';
import { useErrorReports } from '@/hooks/useErrorReports';
import { Table } from 'antd';
import { memo, useMemo, useState } from 'react';
import { createColumns } from './columns';
import ErrorDetailModal from './components/ErrorDetailModal';
import SearchForm from './components/SearchForm';

interface DataType extends ErrorReport {
  key: string;
}

const INITIAL_QUERY: ErrorReportQuery = {
  page: 1,
  pageSize: 10
};

export default memo(function ErrorReportList() {
  // 查询参数状态
  const [query, setQuery] = useState<ErrorReportQuery>(INITIAL_QUERY);

  // 详情模态框状态
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ErrorReport | null>(null);

  // 使用 React Query 获取数据
  const { data, isLoading } = useErrorReports(query);

  // 处理搜索
  const handleSearch = () => {
    setQuery(prev => ({ ...prev, page: 1 }));
  };

  // 重置搜索
  const handleReset = () => {
    setQuery(INITIAL_QUERY);
  };

  // 查看详情
  const handleViewDetail = (record: ErrorReport) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  // 关闭详情
  const handleCloseDetail = () => {
    setDetailVisible(false);
    setSelectedRecord(null);
  };

  // 表格列配置
  const columns = useMemo(() => createColumns({ onViewDetail: handleViewDetail }), []);

  // 表格数据源
  const dataSource = useMemo<DataType[]>(() => data?.list || [], [data?.list]);

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">错误报告列表</h2>

        {/* 搜索表单 */}
        <SearchForm
          query={query}
          onChange={setQuery}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      </div>

      {/* 表格 */}
      <Table<DataType>
        columns={columns}
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

      {/* 详情模态框 */}
      <ErrorDetailModal
        visible={detailVisible}
        record={selectedRecord}
        onClose={handleCloseDetail}
      />
    </div>
  );
});
