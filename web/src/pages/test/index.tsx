import { Button } from 'antd'
import Counter from './components/counter'
import TodoList from './components/todolist'
import { motion } from 'framer-motion'

const box = {
  width: 100,
  height: 100,
  backgroundColor: '#9911ff',
  borderRadius: 5
}

export default function Test() {
  return (
    <div>
      <h1>test</h1>
      <Counter initialValue={10} step={2}></Counter>
      <TodoList></TodoList>

      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }} style={box} />
    </div>
  )
}
