import { http, HttpResponse } from 'msw'

// 模拟错误报告数据
const errorReports = [
  {
    id: '1',
    eventType: 'error',
    subType: 'js-error',
    appId: 'react-app-001',
    userId: 'user123',
    userName: '张三',
    sessionId: 'session_abc123',
    url: 'http://localhost:3000/user-management/user',
    pageTitle: '用户管理',
    referrer: 'http://localhost:3000/dashboard',
    timestamp: Date.now() - 1000 * 60 * 30, // 30分钟前
    deviceInfo: {
      deviceType: 'desktop',
      screenResolution: '1920x1080',
      viewportSize: '1536x864',
      pixelRatio: 1
    },
    browserInfo: {
      name: 'Chrome',
      version: '120.0.0.0',
      engine: 'Blink',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      language: 'zh-CN'
    },
    osInfo: {
      name: 'Windows',
      version: '10',
      platform: 'Win32'
    },
    networkInfo: {
      connectionType: 'wifi',
      effectiveType: '4g'
    },
    eventData: {
      message: 'Cannot read property \'name\' of undefined',
      filename: 'http://localhost:3000/static/js/bundle.js',
      lineno: 1234,
      colno: 56,
      stack: `TypeError: Cannot read property 'name' of undefined
    at UserComponent.render (http://localhost:3000/static/js/bundle.js:1234:56)
    at Object.ReactDOMComponent.render (http://localhost:3000/static/js/bundle.js:2345:67)`,
      componentStack: 'at UserList\n    at UserManagement'
    },
    level: 'error',
    status: 'pending',
    count: 5,
    firstOccurred: '2024-01-15 10:30:00',
    lastOccurred: '2024-01-15 14:20:00',
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-15 14:20:00'
  },
  {
    id: '2',
    eventType: 'error',
    subType: 'xhr',
    appId: 'react-app-001',
    userId: 'user456',
    userName: '李四',
    sessionId: 'session_def456',
    url: 'http://localhost:3000/api/users',
    pageTitle: '用户列表API',
    referrer: 'http://localhost:3000/user-management/user',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2小时前
    deviceInfo: {
      deviceType: 'desktop',
      screenResolution: '1366x768',
      viewportSize: '1280x720'
    },
    browserInfo: {
      name: 'Firefox',
      version: '119.0',
      engine: 'Gecko',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0',
      language: 'zh-CN'
    },
    osInfo: {
      name: 'Windows',
      version: '10',
      platform: 'Win32'
    },
    eventData: {
      message: 'Request failed with status code 500',
      url: '/api/users',
      method: 'GET',
      status: 500,
      statusText: 'Internal Server Error'
    },
    level: 'error',
    status: 'resolved',
    count: 2,
    firstOccurred: '2024-01-14 15:20:00',
    lastOccurred: '2024-01-14 16:00:00',
    createTime: '2024-01-14 15:20:00',
    updateTime: '2024-01-14 16:00:00'
  },
  {
    id: '3',
    eventType: 'error',
    subType: 'js-error',
    appId: 'react-app-001',
    userId: 'user789',
    userName: '王五',
    sessionId: 'session_ghi789',
    url: 'http://localhost:3000/error-report/list',
    pageTitle: '错误报告列表',
    referrer: 'http://localhost:3000/dashboard',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1天前
    deviceInfo: {
      deviceType: 'desktop',
      screenResolution: '2560x1440'
    },
    browserInfo: {
      name: 'Safari',
      version: '17.0',
      engine: 'WebKit',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      language: 'zh-CN'
    },
    osInfo: {
      name: 'macOS',
      version: '14.0',
      platform: 'MacIntel'
    },
    eventData: {
      message: 'Warning: Each child in a list should have a unique "key" prop.',
      componentStack: 'at ErrorList\n    at ErrorReport'
    },
    level: 'warning',
    status: 'ignored',
    count: 12,
    firstOccurred: '2024-01-13 09:15:00',
    lastOccurred: '2024-01-13 18:30:00',
    createTime: '2024-01-13 09:15:00',
    updateTime: '2024-01-13 18:30:00'
  },
  {
    id: '4',
    eventType: 'error',
    subType: 'promise',
    appId: 'react-app-001',
    userId: 'user101',
    userName: '赵六',
    sessionId: 'session_jkl101',
    url: 'http://localhost:3000/chat-ai',
    pageTitle: 'AI聊天',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2天前
    deviceInfo: {
      deviceType: 'mobile',
      screenResolution: '375x812'
    },
    browserInfo: {
      name: 'Chrome',
      version: '120.0.0.0',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
    },
    osInfo: {
      name: 'iOS',
      version: '17.0'
    },
    eventData: {
      message: 'ReferenceError: fetch is not defined',
      stack: `ReferenceError: fetch is not defined
    at apiRequest (http://localhost:3000/static/js/bundle.js:3456:78)
    at getUserList (http://localhost:3000/static/js/bundle.js:4567:89)`
    },
    level: 'error',
    status: 'pending',
    count: 1,
    firstOccurred: '2024-01-12 14:45:00',
    lastOccurred: '2024-01-12 14:45:00',
    createTime: '2024-01-12 14:45:00',
    updateTime: '2024-01-12 14:45:00'
  },
  {
    id: '5',
    eventType: 'performance',
    subType: 'slow-component',
    appId: 'react-app-001',
    userId: 'user202',
    userName: '钱七',
    sessionId: 'session_mno202',
    url: 'http://localhost:3000/test',
    pageTitle: '测试页面',
    timestamp: Date.now() - 1000 * 60 * 60 * 72, // 3天前
    deviceInfo: {
      deviceType: 'mobile',
      screenResolution: '414x896'
    },
    browserInfo: {
      name: 'Safari',
      version: '17.0',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
    },
    osInfo: {
      name: 'iOS',
      version: '17.0'
    },
    eventData: {
      message: 'Component re-rendered more than 100 times',
      componentName: 'TestComponent',
      renderCount: 156,
      renderTime: 2500
    },
    level: 'warning',
    status: 'pending',
    count: 8,
    firstOccurred: '2024-01-11 11:30:00',
    lastOccurred: '2024-01-11 16:45:00',
    createTime: '2024-01-11 11:30:00',
    updateTime: '2024-01-11 16:45:00'
  }
]

const errorReportMockApi = [
  // 获取错误报告列表
  http.get('/api/error-reports', ({ request }) => {
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword')
    const eventType = url.searchParams.get('eventType')
    const subType = url.searchParams.get('subType')
    const level = url.searchParams.get('level')
    const status = url.searchParams.get('status')
    const appId = url.searchParams.get('appId')
    const userId = url.searchParams.get('userId')
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')

    let filteredData = [...errorReports]

    // 过滤条件
    if (keyword) {
      filteredData = filteredData.filter(item => 
        item.eventData?.message?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.pageTitle?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.url?.toLowerCase().includes(keyword.toLowerCase())
      )
    }
    if (eventType) {
      filteredData = filteredData.filter(item => item.eventType === eventType)
    }
    if (subType) {
      filteredData = filteredData.filter(item => item.subType === subType)
    }
    if (level) {
      filteredData = filteredData.filter(item => item.level === level)
    }
    if (status) {
      filteredData = filteredData.filter(item => item.status === status)
    }
    if (appId) {
      filteredData = filteredData.filter(item => item.appId === appId)
    }
    if (userId) {
      filteredData = filteredData.filter(item => item.userId === userId)
    }

    // 分页
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedData = filteredData.slice(startIndex, endIndex)

    return HttpResponse.json({
      status: 200,
      message: 'success',
      data: {
        list: paginatedData,
        total: filteredData.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredData.length / pageSize)
      }
    })
  }),

  // 获取错误报告详情
  http.get('/api/error-reports/:id', ({ params }) => {
    const { id } = params
    const errorReport = errorReports.find(item => item.id === id)
    
    if (!errorReport) {
      return HttpResponse.json({
        status: 404,
        message: '错误报告不存在'
      }, { status: 404 })
    }

    return HttpResponse.json({
      status: 200,
      message: 'success',
      data: errorReport
    })
  }),

  // 创建错误报告
  http.post('/api/error-reports', async ({ request }) => {
    const newReport = await request.json()
    const id = String(Date.now())
    
    const errorReport = {
      id,
      ...newReport,
      count: 1,
      firstOccurred: new Date().toISOString(),
      lastOccurred: new Date().toISOString(),
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      level: newReport.level || 'error',
      status: 'pending'
    }
    
    errorReports.unshift(errorReport)
    
    return HttpResponse.json({
      status: 200,
      message: '创建成功',
      data: { id }
    })
  }),

  // 更新错误报告状态
  http.put('/api/error-reports/:id/status', async ({ params, request }) => {
    const { id } = params
    const { status } = await request.json()
    const index = errorReports.findIndex(item => item.id === id)
    
    if (index === -1) {
      return HttpResponse.json({
        status: 404,
        message: '错误报告不存在'
      }, { status: 404 })
    }

    errorReports[index].status = status
    errorReports[index].updateTime = new Date().toISOString()
    
    return HttpResponse.json({
      status: 200,
      message: '状态更新成功'
    })
  }),

  // 删除错误报告
  http.delete('/api/error-reports/:id', ({ params }) => {
    const { id } = params
    const index = errorReports.findIndex(item => item.id === id)
    
    if (index === -1) {
      return HttpResponse.json({
        status: 404,
        message: '错误报告不存在'
      }, { status: 404 })
    }

    errorReports.splice(index, 1)
    
    return HttpResponse.json({
      status: 200,
      message: '删除成功'
    })
  }),

  // 批量删除错误报告
  http.delete('/api/error-reports/batch', async ({ request }) => {
    const { ids } = await request.json()
    
    ids.forEach(id => {
      const index = errorReports.findIndex(item => item.id === id)
      if (index !== -1) {
        errorReports.splice(index, 1)
      }
    })
    
    return HttpResponse.json({
      status: 200,
      message: '批量删除成功'
    })
  }),

  // 批量更新状态
  http.put('/api/error-reports/batch/status', async ({ request }) => {
    const { ids, status } = await request.json()
    
    ids.forEach(id => {
      const index = errorReports.findIndex(item => item.id === id)
      if (index !== -1) {
        errorReports[index].status = status
        errorReports[index].updateTime = new Date().toISOString()
      }
    })
    
    return HttpResponse.json({
      status: 200,
      message: '批量更新成功'
    })
  }),

  // 获取统计数据
  http.get('/api/error-reports/stats', ({ request }) => {
    const url = new URL(request.url)
    const appId = url.searchParams.get('appId')
    
    let filteredData = errorReports
    if (appId) {
      filteredData = errorReports.filter(item => item.appId === appId)
    }
    
    const totalCount = filteredData.length
    const todayCount = filteredData.filter(item => {
      const today = new Date().toDateString()
      return new Date(item.createTime).toDateString() === today
    }).length
    
    const pendingCount = filteredData.filter(item => item.status === 'pending').length
    const resolvedCount = filteredData.filter(item => item.status === 'resolved').length
    
    return HttpResponse.json({
      status: 200,
      message: 'success',
      data: {
        totalCount,
        todayCount,
        pendingCount,
        resolvedCount,
        errorTrend: [
          { date: '2024-01-11', count: 8 },
          { date: '2024-01-12', count: 1 },
          { date: '2024-01-13', count: 12 },
          { date: '2024-01-14', count: 2 },
          { date: '2024-01-15', count: 5 }
        ],
        topErrors: [
          { message: 'Cannot read property \'name\' of undefined', count: 5, percentage: 50 },
          { message: 'Request failed with status code 500', count: 2, percentage: 20 },
          { message: 'Component re-rendered more than 100 times', count: 8, percentage: 30 }
        ],
        browserStats: [
          { browser: 'Chrome', count: 6, percentage: 60 },
          { browser: 'Firefox', count: 2, percentage: 20 },
          { browser: 'Safari', count: 2, percentage: 20 }
        ]
      }
    })
  })
]

export default errorReportMockApi
