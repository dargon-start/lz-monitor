import { useState } from 'react'
import { Flex } from 'antd'
import { Bubble, Sender } from '@ant-design/x'
import { UserOutlined } from '@ant-design/icons'

interface AnswerBoxProps {}

export default function AnswerBox({}: AnswerBoxProps) {
  const fooAvatar: React.CSSProperties = {
    color: '#f56a00',
    backgroundColor: '#fde3cf'
  }

  const barAvatar: React.CSSProperties = {
    color: '#fff',
    backgroundColor: '#87d068'
  }

  const hideAvatar: React.CSSProperties = {
    visibility: 'hidden'
  }

  // 输入框
  const [value, setValue] = useState<string>('Hello? this is X!')
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <Flex
      vertical
      justify='space-between'
      className='border border-ant-color-border rounded-md flex-1 p-4'
    >
      <Flex gap='middle' vertical>
        <Bubble
          placement='start'
          content='Good morning, how are you?'
          avatar={{ icon: <UserOutlined />, style: fooAvatar }}
        />
        <Bubble
          placement='start'
          content='What a beautiful day!'
          styles={{ avatar: hideAvatar }}
          avatar={{}}
        />
        <Bubble
          placement='end'
          content="Hi, good morning, I'm fine!"
          avatar={{ icon: <UserOutlined />, style: barAvatar }}
        />
        <Bubble placement='end' content='Thank you!' styles={{ avatar: hideAvatar }} avatar={{}} />
      </Flex>
      <Sender
        loading={loading}
        value={value}
        onChange={v => {
          setValue(v)
        }}
        onSubmit={() => {
          setValue('')
          setLoading(true)
        }}
        onCancel={() => {
          setLoading(false)
        }}
        autoSize={{ minRows: 2, maxRows: 6 }}
      />
    </Flex>
  )
}
