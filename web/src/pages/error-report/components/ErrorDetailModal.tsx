import { Modal } from 'antd'
import type { ErrorReport } from '@/api/error-report/error-report.type'

interface ErrorDetailModalProps {
  visible: boolean
  record: ErrorReport | null
  onClose: () => void
}

export default function ErrorDetailModal({ visible, record, onClose }: ErrorDetailModalProps) {
  if (!record) return null

  const recordAny = record as any

  return (
    <Modal
      title="错误详情"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 20 }}
    >
      <div className="space-y-4 max-h-[70vh] overflow-auto">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>ID：</strong>{recordAny.id || '未知'}
          </div>
          <div>
            <strong>事件类型：</strong>{recordAny.event_type || '未知'}
          </div>
          <div>
            <strong>错误子类型：</strong>{recordAny.sub_type || '未分类'}
          </div>
          <div>
            <strong>应用ID：</strong>{recordAny.app_id || '未知'}
          </div>
          <div>
            <strong>用户ID：</strong>{recordAny.user_id || '未知'}
          </div>
          <div>
            <strong>会话ID：</strong>{recordAny.session_id || '未知'}
          </div>
        </div>
        
        <div>
          <strong>页面URL：</strong>{recordAny.url || '未知'}
        </div>
        
        <div>
          <strong>页面标题：</strong>{recordAny.page_title || '未知'}
        </div>
        
        <div>
          <strong>来源页面：</strong>{recordAny.referrer || '未知'}
        </div>
        
        <div>
          <strong>时间戳：</strong>
          {recordAny.timestamp ? 
            `${recordAny.timestamp} (${new Date(parseInt(recordAny.timestamp)).toLocaleString()})` : 
            '未知'
          }
        </div>
        
        <div>
          <strong>创建时间：</strong>{recordAny.created_at || '未知'}
        </div>
        
        <div>
          <strong>IP地址：</strong>{recordAny.ip || '未知'}
        </div>
        
        {/* 事件数据 */}
        {recordAny.event_data && (
          <div>
            <strong>事件数据：</strong>
            <pre className="bg-gray-100 p-3 rounded text-sm mt-2 max-h-60 overflow-auto">
              {JSON.stringify(recordAny.event_data, null, 2)}
            </pre>
          </div>
        )}
        
        {/* 浏览器信息 */}
        {recordAny.browser_info && (
          <div>
            <strong>浏览器信息：</strong>
            <pre className="bg-gray-100 p-3 rounded text-sm mt-2">
              {JSON.stringify(recordAny.browser_info, null, 2)}
            </pre>
          </div>
        )}
        
        {/* 设备信息 */}
        {recordAny.device_info && (
          <div>
            <strong>设备信息：</strong>
            <pre className="bg-gray-100 p-3 rounded text-sm mt-2">
              {JSON.stringify(recordAny.device_info, null, 2)}
            </pre>
          </div>
        )}
        
        {/* 操作系统信息 */}
        {recordAny.os_info && (
          <div>
            <strong>操作系统信息：</strong>
            <pre className="bg-gray-100 p-3 rounded text-sm mt-2">
              {JSON.stringify(recordAny.os_info, null, 2)}
            </pre>
          </div>
        )}
        
        {/* 网络信息 */}
        {recordAny.network_info && (
          <div>
            <strong>网络信息：</strong>
            <pre className="bg-gray-100 p-3 rounded text-sm mt-2">
              {JSON.stringify(recordAny.network_info, null, 2)}
            </pre>
          </div>
        )}
        
        {/* 地理位置信息 */}
        {recordAny.geo_info && (
          <div>
            <strong>地理位置信息：</strong>
            <pre className="bg-gray-100 p-3 rounded text-sm mt-2">
              {JSON.stringify(recordAny.geo_info, null, 2)}
            </pre>
          </div>
        )}
        
        {/* 完整原始数据 */}
        <div>
          <strong>完整原始数据：</strong>
          <pre className="bg-gray-50 p-3 rounded text-xs mt-2 max-h-80 overflow-auto border">
            {JSON.stringify(recordAny, null, 2)}
          </pre>
        </div>
      </div>
    </Modal>
  )
}
