# monitor sdk

## 项目概述
`lz-monitor` 是一个基于 Monorepo 架构的前端监控 SDK，旨在为 Web 应用提供全面的异常监控、性能监测和用户行为追踪功能。

## 核心模块结构
项目采用 pnpm workspace 管理，主要包含以下包：
- **`packages/core`**: 核心逻辑层。包含初始化、事件处理、数据上报、白屏检测等。
- **`packages/performance`**: 性能监控层。集成 `web-vitals`，自动采集 FCP, LCP, CLS 等指标。
- **`packages/types`**: 类型定义层。统一管理 TypeScript 类型。
- **`packages/utils`**: 工具函数层。
- **`packages/common`**: 公共常量层。

## 关键功能特性
- **多框架支持**: 支持 Vue (`install`), React (`errorBoundary`), 及原生 JS。
- **全面的异常捕获**: JS 错误, Promise 异常, 资源加载错误, 接口异常。
- **智能数据上报**: 优先 `sendBeacon`，支持降级和自定义 Hook。
- **白屏检测**: 采样对比法检测白屏。
- **用户行为回溯**: 记录面包屑 (Breadcrumb) 辅助排查。

## 核心执行逻辑

### 入口 (Entry Points)
- **`init()`**: 通用初始化，核心入口。
- **`install()`**: Vue 插件入口，会先劫持 Vue 的 `errorHandler`，然后调用 `init()`。
- **`errorBoundary()`**: React 错误边界处理函数。
- **`use()`**: 插件注册机制。

### 初始化 (Initialization)
- **`handleOptions()`**: 处理和绑定用户配置。
- **`setupReplace()`**: 核心中的核心，负责重写原生方法和绑定事件监听器。

### 事件捕获 (Event Capture)
- 通过 `setupReplace` 启动，涵盖了全局错误、Promise 异常、XHR/Fetch 请求、点击事件、路由变化和白屏检测。

### 事件处理 (Event Processing)
- **`HandleEvents`**: 对象包含各种处理函数（如 `handleError`, `handleHttp`）。
- **主要职责**:
  1. 将行为记录到 `breadcrumb`（面包屑）中。
  2. 如果是错误或异常，调用 `transportData.send` 进行上报。

### 数据上报 (Data Reporting)
- **`transportData.send()`**: 统一上报入口。
- **策略**: 优先使用 `sendBeacon`，失败则降级为图片打点 (`Image Request`)，最后尝试 `XHR Post`。
- **Hook**: 支持 `beforePost` 钩子在发送前修改数据。