import React, { useState } from 'react'
import { Input, Button, List, Checkbox, Space, message } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

interface TodoItem {
  id: string
  text: string
  completed: boolean
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [inputValue, setInputValue] = useState('')

  // 添加新待办事项
  const addTodo = () => {
    if (inputValue.trim() === '') {
      message.warning('请输入待办事项内容')
      return
    }

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false
    }

    setTodos([...todos, newTodo])
    setInputValue('')
  }

  // 切换待办事项完成状态
  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  // 删除待办事项
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>待办事项列表</h1>

      {/* 添加新待办事项的表单 */}
      <Space.Compact style={{ width: '100%', marginBottom: '24px' }}>
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder='输入待办事项...'
          onPressEnter={addTodo}
        />
        <Button type='primary' icon={<PlusOutlined />} onClick={addTodo}>
          添加
        </Button>
      </Space.Compact>

      {/* 待办事项列表 */}
      <List
        bordered
        dataSource={todos}
        renderItem={todo => (
          <List.Item
            actions={[
              <Button
                type='text'
                danger
                icon={<DeleteOutlined />}
                onClick={() => deleteTodo(todo.id)}
              />
            ]}
          >
            <Space>
              <Checkbox checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
              <span
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#999' : '#333'
                }}
              >
                {todo.text}
              </span>
            </Space>
          </List.Item>
        )}
      />

      {/* 统计信息 */}
      {todos.length > 0 && (
        <div style={{ marginTop: '16px', textAlign: 'right', color: '#666' }}>
          总计: {todos.length} | 已完成: {todos.filter(t => t.completed).length} | 未完成:{' '}
          {todos.filter(t => !t.completed).length}
        </div>
      )}
    </div>
  )
}

export default TodoList
