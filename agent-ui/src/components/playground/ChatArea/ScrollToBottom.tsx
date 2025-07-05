'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

interface ScrollToBottomProps {
  onScrollToBottom: () => void
}

const ScrollToBottom: React.FC<ScrollToBottomProps> = ({ onScrollToBottom }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkScrollPosition = () => {
      const scrollElement = document.querySelector('[data-scroll-area]') as HTMLElement
      if (scrollElement) {
        const { scrollTop, scrollHeight, clientHeight } = scrollElement
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100
        setIsVisible(!isNearBottom && scrollHeight > clientHeight)
      }
    }

    const scrollElement = document.querySelector('[data-scroll-area]')
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollPosition, { passive: true })
      
      // Check initial position
      checkScrollPosition()
      
      // Check periodically when content might change
      const interval = setInterval(checkScrollPosition, 500)
      
      return () => {
        scrollElement.removeEventListener('scroll', checkScrollPosition)
        clearInterval(interval)
      }
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute bottom-4 right-4 z-10"
        >
          <Button
            onClick={onScrollToBottom}
            type="button"
            size="icon"
            className="h-10 w-10 rounded-full bg-white border border-gray-300 shadow-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-xl transition-all duration-200 hover:scale-105"
            aria-label="Scroll to bottom"
          >
            <Icon type="arrow-down" size="xs" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ScrollToBottom
