'use client'

import type React from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { useStickToBottomContext } from 'use-stick-to-bottom'

import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

const ScrollToBottom: React.FC = () => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()

  return (
    <AnimatePresence>
      {!isAtBottom && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        >
          <Button
            onClick={() => scrollToBottom()}
            type="button"
            size="icon"
            className="h-10 w-10 rounded-full bg-white border border-border shadow-lg text-secondary-600 hover:bg-accent-hover hover:text-secondary-900 hover:shadow-xl transition-all duration-200 hover-lift"
          >
            <Icon type="arrow-down" size="xs" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ScrollToBottom
