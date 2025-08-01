import { type MotionProps, motion } from 'framer-motion'

import { varContainer, varFade } from './variants'

interface Props extends MotionProps {
  className?: string
}
/**
 * [whileInView: 元素可以在进出视口时设置动画](https://www.framer.com/motion/scroll-animations/#scroll-triggered-animations)
 *
 * + viewport: [视口](https://www.framer.com/motion/scroll-animations/###viewport)
 *
 *    + once: 仅触发一次
 */
export default function MotionViewport({ children, className }: Props) {
  console.log('MotionViewport')

  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit='exit'
      variants={varFade().inLeft}
      className={className}
    >
      {children}
    </motion.div>
  )
}
