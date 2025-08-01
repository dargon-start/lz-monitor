import { Flex } from 'antd'

import HistoricalSession from './components/HistoricalSession'
import AnswerBox from './components/AnswerBox'

export default function chatAI() {
  return (
    <Flex gap={10} className='w-full h-full'>
      <HistoricalSession />
      <AnswerBox />
    </Flex>
  )
}
