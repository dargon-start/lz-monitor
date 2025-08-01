import React, { useState } from 'react'
import { Button } from 'antd'

interface CounterProps {
  initialValue?: number
  step?: number
}

const Counter: React.FC<CounterProps> = ({ initialValue = 0, step = 1 }) => {
  const [count, setCount] = useState<number>(initialValue)

  const increment = () => {
    setCount(prevCount => prevCount + step)
  }

  const decrement = () => {
    setCount(prevCount => Math.max(0, prevCount - step))
  }

  return (
    <div>
      <h2>计数器: {count}</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button onClick={increment} style={{ padding: '5px 10px' }}>
          +{step}
        </Button>
        <Button onClick={decrement} style={{ padding: '5px 10px' }} disabled={count <= 0}>
          -{step}
        </Button>
      </div>
    </div>
  )
}

export default Counter
