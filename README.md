# lz-monitor

性能监控，错误上报平台

## 项目简介

LZ Monitor 是一个前端监控平台，提供实时错误监控、性能分析和用户行为跟踪功能。

## 项目结构

```
lz-monitor/
├── packages/          # SDK 核心库
│   ├── core/         # 核心功能
│   ├── types/        # TypeScript 类型定义
│   ├── utils/        # 工具函数
│   └── common/       # 公共模块
├── server/           # 后端服务（NestJS）
├── web/              # 前端管理平台（React + TypeScript + Ant Design）
└── test/             # 测试项目
```

## 技术栈

### 前端

- React 18
- TypeScript
- Ant Design
- TailwindCSS
- React Router
- React Query
- Zustand

### 后端

- NestJS
- TypeScript
- TypeORM
- MySQL 8.0+

### 数据库

- **方案一**：单表设计（适合中小型项目，< 100万数据）
- **方案二**：多表设计（推荐，生产级方案）✅
  - 8张核心表，职责清晰
  - 优化的索引策略
  - 支持数据分区和归档
  - 查询性能提升10倍

详见：[数据库设计文档](server/docs/DATABASE_DESIGN.md)

## 常用 Hooks

### useTableScrollY

动态计算表格滚动高度的自定义 Hook，使表格能够自适应占据页面剩余高度。

**智能特性：**

- 🎯 自动获取 Ant Design Table 的表头和分页器实际高度
- 🔍 使用 DOM 查询实时获取组件尺寸，无需手动配置
- 📊 自适应不同表格配置（有/无分页器、不同表头大小等）

**参数：**

- `minHeight`: `number` - 最小高度，默认 `200px`
- `extraPadding`: `number` - 额外的间距，默认 `16px`

**返回值：**

- `[tableContainerRef, tableScrollY]` - 表格容器引用和计算后的滚动高度

**使用示例：**

```tsx
import { useTableScrollY } from '@/hooks';
import { Table } from 'antd';

export default function MyList() {
  // 使用默认参数（minHeight=200, extraPadding=16）
  const [tableContainerRef, tableScrollY] = useTableScrollY();

  // 或自定义参数
  // const [tableContainerRef, tableScrollY] = useTableScrollY(300, 24);

  return (
    <div className="flex flex-col h-full p-3 bg-white">
      <div className="mb-4 flex-shrink-0">{/* 搜索表单等固定内容 */}</div>

      {/* 表格容器 */}
      <div ref={tableContainerRef} className="flex-1 overflow-hidden">
        <Table
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1200, y: tableScrollY }}
          pagination={
            {
              /* ... */
            }
          }
        />
      </div>
    </div>
  );
}
```

**工作原理：**

1. 通过 `querySelector` 自动查找表头（`.ant-table-thead`）和分页器（`.ant-pagination`）
2. 获取它们的实际渲染高度
3. 计算公式：`滚动高度 = 容器高度 - 表头高度 - 分页器高度 - 额外间距`
4. 使用多重监听机制确保实时更新：
   - `window.resize` - 监听窗口大小变化
   - `ResizeObserver` - 监听容器尺寸变化
   - `MutationObserver` - 监听 DOM 结构变化（如分页器显示/隐藏）

**特性：**

- ✅ 智能识别表格组件尺寸，无需手动配置
- ✅ 自动适配有/无分页器的场景
- ✅ 多重监听机制，确保任何变化都能响应
- ✅ 延迟计算策略，确保 DOM 完全渲染后再计算
- ✅ 开箱即用，极简 API

## SDK 使用指南

### 性能指标上报

LZ Monitor SDK 支持自动收集和上报网站性能指标，包括：

- **FCP (First Contentful Paint)**: 首次内容绘制时间
- **LCP (Largest Contentful Paint)**: 最大内容绘制时间
- **CLS (Cumulative Layout Shift)**: 累积布局偏移
- **INP (Interaction to Next Paint)**: 交互延迟
- **TTFB (Time To First Byte)**: 首字节时间

#### 初始化 SDK

```typescript
import Monitor from '@lz-monitor/core';
import collectPerformance from '@lz-monitor/performance';

// 初始化监控 SDK
Monitor.init({
  dsn: 'http://localhost:3001/monitor/report', // 上报接口地址
  apiKey: 'your-api-key', // 项目唯一标识
  userId: 'user-123' // 可选：用户ID
});

// 启用性能指标收集
collectPerformance();
```

#### 配置说明

**必需参数：**

- `dsn`: 监控数据上报接口地址
- `apiKey`: 项目唯一标识，用于区分不同项目

**可选参数：**

- `userId`: 用户ID，用于关联用户行为
- `beforeDataReport`: 数据上报前的钩子函数，可用于数据过滤或修改
- `useImgUpload`: 是否使用图片打点上报（默认 false，使用 sendBeacon/fetch）

#### 性能指标说明

| 指标 | 说明             | 良好阈值 | 需要改进阈值  |
| ---- | ---------------- | -------- | ------------- |
| FCP  | 首次内容绘制时间 | < 1.8s   | 1.8s - 3.0s   |
| LCP  | 最大内容绘制时间 | < 2.5s   | 2.5s - 4.0s   |
| CLS  | 累积布局偏移     | < 0.1    | 0.1 - 0.25    |
| INP  | 交互延迟         | < 200ms  | 200ms - 500ms |
| TTFB | 首字节时间       | < 0.8s   | 0.8s - 1.8s   |

#### 数据上报流程

1. web-vitals 库自动收集性能指标
2. 指标数据转换为 ReportData 格式
3. 通过 `transportData.send()` 上报到服务端
4. SDK 自动添加公共信息（apiKey、uuid、pageUrl、deviceInfo等）
5. 优先使用 `sendBeacon` 上报，失败时降级到 `fetch` 或图片打点
6. 后端接收数据并保存到 `monitor_performance` 表

#### 注意事项

- 性能指标会在页面加载和交互时自动收集，无需手动触发
- 每个指标收集到后会立即上报，不会批量上报
- 性能数据不会附带用户行为栈（breadcrumb），以减少数据量
- 确保在调用 `collectPerformance()` 之前已经初始化 SDK（调用 `Monitor.init()`）

## 快速开始

### 1. 数据库初始化

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE lz_monitor DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 执行初始化脚本（方案二：多表设计）
mysql -u root -p lz_monitor < server/migrations/001_init_database.sql
```

### 2. 配置环境变量

创建 `server/.env` 文件：

```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=lz_monitor
PORT=3001
```

### 3. 启动服务

```bash
# 安装依赖
pnpm install

# 启动后端
cd server
pnpm start:dev

# 启动前端
cd web
pnpm dev
```

### 4. 访问应用

- 前端管理平台：http://localhost:5173
- 后端 API：http://localhost:3001
- Swagger 文档：http://localhost:3001/api

## 数据库迁移

如果你正在使用旧版单表设计，可以迁移到新的多表设计：

```bash
# 1. 备份数据
mysqldump -u root -p lz_monitor > backup_$(date +%Y%m%d).sql

# 2. 执行迁移
mysql -u root -p lz_monitor < server/migrations/001_init_database.sql
mysql -u root -p lz_monitor < server/migrations/002_migrate_from_single_table.sql
```

详见：[迁移指南](server/docs/MIGRATION_GUIDE.md)

## 许可证

MIT
