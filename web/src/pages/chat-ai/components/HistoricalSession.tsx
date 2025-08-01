import { Conversations } from '@ant-design/x'
import type { ConversationsProps } from '@ant-design/x'
import { DeleteOutlined, EditOutlined, StopOutlined } from '@ant-design/icons'
import { type GetProp, theme } from 'antd'

interface HistoricalSessionProps {}

export default function HistoricalSession({}: HistoricalSessionProps) {
  const { token } = theme.useToken()

  const menuConfig: ConversationsProps['menu'] = conversation => ({
    items: [
      {
        label: 'Operation 1',
        key: 'operation1',
        icon: <EditOutlined />
      },
      {
        label: 'Operation 2',
        key: 'operation2',
        icon: <StopOutlined />,
        disabled: true
      },
      {
        label: 'Operation 3',
        key: 'operation3',
        icon: <DeleteOutlined />,
        danger: true
      }
    ],
    onClick: menuInfo => {
      menuInfo.domEvent.stopPropagation()
    }
  })

  const items: GetProp<ConversationsProps, 'items'> = Array.from({ length: 4 }).map((_, index) => ({
    key: `item${index + 1}`,
    label: `Conversation Item ${index + 1}`,
    disabled: index === 3
  }))

  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
    height: '100%',
    border: `1px solid ${token.colorBorder}`
  }

  return (
    <>
      <Conversations defaultActiveKey='item1' menu={menuConfig} items={items} style={style} />
    </>
  )
}
