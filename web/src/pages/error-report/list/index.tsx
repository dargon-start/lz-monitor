import { memo, useEffect, useState } from 'react'
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  message,
  Tooltip
} from 'antd'
import { 
  SearchOutlined, 
  ReloadOutlined, 
  EyeOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getErrorReportList } from '@/api/error-report'
import type { ErrorReport, ErrorReportQuery } from '@/api/error-report/error-report.type'
import ErrorDetailModal from '../components/ErrorDetailModal'

const { RangePicker } = DatePicker

interface DataType extends ErrorReport {
  key: string
}

interface ErrorReportListProps {}

export default memo(function ErrorReportList({}: ErrorReportListProps) {
  const [data, setData] = useState<DataType[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState<ErrorReportQuery>({
    page: 1,
    pageSize: 10
  })
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<ErrorReport | null>(null)

  // 获取错误报告列表
  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getErrorReportList(query)
      console.log('API Response:', res);
      
      let dataList = []
      
      // 兼容不同的响应结构
      if (res.list) {
        dataList = res.list
      } else if (Array.isArray(res)) {
        dataList = res as any[]
      } else if ((res as any).data && Array.isArray((res as any).data)) {
        dataList = (res as any).data
      } else {
        console.warn('Unexpected response structure:', res)
        dataList = []
      }
      
      const data = dataList.map((item: any, index: number) => ({
        ...item,
        key: item.id || item._id || index.toString()
      }))
      
      console.log('Processed data:', data);
      console.log('Sample item structure:', data[0]);
      
      setData(data)
      setTotal(res.total || dataList.length || 0)
    } catch (error) {
      message.error('获取错误报告列表失败')
      console.error('Error fetching error reports:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [query])

  // 搜索处理
  const handleSearch = () => {
    setQuery(prev => ({ ...prev, page: 1 }))
  }

  // 重置搜索
  const handleReset = () => {
    setQuery({
      page: 1,
      pageSize: 10
    })
  }

  // 查看详情
  const handleViewDetail = (record: ErrorReport) => {
    setSelectedRecord(record)
    setDetailVisible(true)
  }

  // 关闭详情
  const handleCloseDetail = () => {
    setDetailVisible(false)
    setSelectedRecord(null)
  }

  // 表格列定义
  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      render: (text) => (
        <Tooltip title={text}>
          <span className="cursor-pointer">{text}</span>
        </Tooltip>
      )
    },
    {
      title: '事件类型',
      dataIndex: 'event_type',
      width: 120,
      render: (text) => (
        <Tag color="blue">{text || '未知'}</Tag>
      )
    },
    {
      title: '错误子类型',
      dataIndex: 'sub_type',
      width: 120,
      render: (text) => (
        <Tag>{text || '未分类'}</Tag>
      )
    },
    {
      title: '错误信息',
      dataIndex: 'event_data',
      ellipsis: true,
      width: 300,
      render: (text) => (
        <Tooltip placement="topLeft" title={JSON.stringify(text)}>
          <span>{JSON.stringify(text)}</span>
        </Tooltip>
      )
    },
    {
      title: '页面信息',
      width: 200,
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => {
        const recordAny = record as any
        const pageInfo = recordAny.page_title || recordAny.url || '未知页面'
        return (
          <Tooltip title={`页面: ${recordAny.page_title || '未知'}\nURL: ${recordAny.url || '未知'}`}>
            <span>{pageInfo}</span>
          </Tooltip>
        )
      }
    },
    {
      title: '应用ID',
      dataIndex: 'app_id',
      width: 100,
      render: (text) => (text || '')
    },
    {
      title: '用户',
      width: 120,
      render: (_, record) => {
        const recordAny = record as any
        const userName = recordAny.user_name || recordAny.user_id || '未知用户'
        return (
          <Tooltip title={`用户ID: ${recordAny.user_id || '未知'}`}>
            <span>{userName}</span>
          </Tooltip>
        )
      }
    },
    {
      title: '会话ID',
      dataIndex: 'session_id',
      width: 120,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '浏览器信息',
      width: 150,
      render: (_, record) => {
        const recordAny = record as any
        const browserInfo = recordAny.browser_info
        
        let browserDisplay = '未知'
        
        if (browserInfo?.name) {
          browserDisplay = `${browserInfo.name} ${browserInfo.version || ''}`.trim()
        } else if (recordAny.user_agent) {
          // 从user_agent中提取浏览器信息
          const ua = recordAny.user_agent
          if (ua.includes('Chrome')) {
            browserDisplay = 'Chrome'
          } else if (ua.includes('Firefox')) {
            browserDisplay = 'Firefox'
          } else if (ua.includes('Safari')) {
            browserDisplay = 'Safari'
          } else if (ua.includes('Edge')) {
            browserDisplay = 'Edge'
          }
        }
        
        return (
          <Tooltip title={recordAny.user_agent || '未知用户代理'}>
            <span>{browserDisplay}</span>
          </Tooltip>
        )
      }
    },
    {
      title: '设备信息',
      width: 120,
      render: (_, record) => {
        const recordAny = record as any
        const deviceInfo = recordAny.device_info
        
        if (deviceInfo) {
          const deviceType = deviceInfo.deviceType || deviceInfo.type || '未知设备'
          const resolution = deviceInfo.screenResolution || deviceInfo.resolution
          
          return (
            <Tooltip title={`设备类型: ${deviceType}\n屏幕分辨率: ${resolution || '未知'}`}>
              <span>{deviceType}</span>
            </Tooltip>
          )
        }
        
        return <span>未知</span>
      }
    },
    {
      title: '时间戳',
      dataIndex: 'timestamp',
      width: 160,
      render: (timestamp) => {
        if (timestamp) {
          const date = new Date(parseInt(timestamp))
          return (
            <Tooltip title={`时间戳: ${timestamp}`}>
              <span>{date.toLocaleString()}</span>
            </Tooltip>
          )
        }
        return '未知'
      },
      sorter: (a, b) => {
        const timestampA = parseInt((a as any).timestamp) || 0
        const timestampB = parseInt((b as any).timestamp) || 0
        return timestampA - timestampB
      }
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 160,
      render: (text) => text || '未知'
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Tooltip title="查看详情">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          />
        </Tooltip>
      )
    }
  ]

  return (
    <div className="p-6 bg-white">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">错误报告列表</h2>
        
        {/* 搜索表单 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
          <Input
            placeholder="搜索关键词"
            value={query.keyword}
            onChange={(e) => setQuery(prev => ({ ...prev, keyword: e.target.value }))}
            allowClear
          />
          <Select
            placeholder="选择事件类型"
            value={query.eventType}
            onChange={(value) => setQuery(prev => ({ ...prev, eventType: value }))}
            allowClear
            options={[
              { label: '鼠标点击', value: 'mousedown' },
              { label: 'JavaScript错误', value: 'js-error' },
              { label: '页面加载', value: 'pageload' },
              { label: '用户行为', value: 'behavior' }
            ]}
          />
          <Select
            placeholder="选择错误子类型"
            value={query.subType}
            onChange={(value) => setQuery(prev => ({ ...prev, subType: value }))}
            allowClear
            options={[
              { label: '点击事件', value: 'click' },
              { label: '表单提交', value: 'submit' },
              { label: '页面跳转', value: 'navigation' },
              { label: '滚动事件', value: 'scroll' }
            ]}
          />
          <Input
            placeholder="应用ID"
            value={query.appId}
            onChange={(e) => setQuery(prev => ({ ...prev, appId: e.target.value }))}
            allowClear
          />
          <Input
            placeholder="用户ID"
            value={query.userId}
            onChange={(e) => setQuery(prev => ({ ...prev, userId: e.target.value }))}
            allowClear
          />
        </div>
        
        {/* 高级搜索 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
          <Input
            placeholder="会话ID"
            value={query.sessionId}
            onChange={(e) => setQuery(prev => ({ ...prev, sessionId: e.target.value }))}
            allowClear
          />
          <Input
            placeholder="页面URL"
            value={query.url}
            onChange={(e) => setQuery(prev => ({ ...prev, url: e.target.value }))}
            allowClear
          />
          <RangePicker
            placeholder={['开始时间', '结束时间']}
            onChange={(dates) => {
              if (dates) {
                setQuery(prev => ({
                  ...prev,
                  startTime: dates[0]?.toISOString(),
                  endTime: dates[1]?.toISOString()
                }))
              } else {
                setQuery(prev => ({
                  ...prev,
                  startTime: undefined,
                  endTime: undefined
                }))
              }
            }}
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-between items-center mb-4">
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              搜索
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              重置
            </Button>
          </Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchData}
          >
            刷新
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <Table<DataType>
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          current: query.page,
          pageSize: query.pageSize,
          total,
          showTotal: (total) => `共 ${total} 条数据`,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            setQuery(prev => ({ ...prev, page, pageSize }))
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
  )
})
            

  
