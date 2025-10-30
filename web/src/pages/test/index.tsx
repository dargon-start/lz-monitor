import { ConfettiButton } from '@/components/ui/confetti';
import { Tabs } from 'antd';
import { motion } from 'framer-motion';
import Counter from './components/counter';
import ErrorTest from './components/ErrorTest';
import TodoList from './components/todolist';
import { CustomText } from './style';

const box = {
  width: 100,
  height: 100,
  backgroundColor: '#9911ff',
  borderRadius: 5
};

export default function Test() {
  const items = [
    {
      key: '1',
      label: '原有功能测试',
      children: (
        <div>
          <h1>test</h1>
          <Counter initialValue={10} step={2}></Counter>
          <TodoList></TodoList>

          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }} style={box} />
          <CustomText>Welcome Back !11111</CustomText>
          <ConfettiButton>Click me</ConfettiButton>
        </div>
      )
    },
    {
      key: '2',
      label: '错误监控测试',
      children: <ErrorTest />
    }
  ];

  return (
    <div className="p-6">
      <Tabs items={items} defaultActiveKey="2" />
    </div>
  );
}
