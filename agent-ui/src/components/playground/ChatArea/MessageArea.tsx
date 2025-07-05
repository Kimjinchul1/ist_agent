'use client'

import { usePlaygroundStore } from '@/store'
import Messages from './Messages'
import ScrollToBottom from '@/components/playground/ChatArea/ScrollToBottom'
import { useEffect, useRef, useCallback } from 'react'

const MessageArea = () => {
  const { messages, isStreaming } = usePlaygroundStore()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const isUserScrollingRef = useRef(false)
  const lastMessageCountRef = useRef(0)

  // Check if user is manually scrolling
  const handleScroll = useCallback(() => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50
      
      // If user scrolled up significantly, they're manually controlling scroll
      if (!isNearBottom && scrollTop < scrollHeight - clientHeight - 100) {
        isUserScrollingRef.current = true
      } else if (isNearBottom) {
        isUserScrollingRef.current = false
      }
    }
  }, [])

  // Auto-scroll to bottom when new messages are added or when streaming
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current
      const { scrollTop, scrollHeight, clientHeight } = scrollElement
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100
      const isNewMessage = messages.length > lastMessageCountRef.current
      
      // Auto-scroll if:
      // 1. New message arrived and user was near bottom
      // 2. User is not manually scrolling
      // 3. First few messages (initial load)
      // 4. Currently streaming
      if (
        (!isUserScrollingRef.current && (isNearBottom || isNewMessage)) ||
        messages.length <= 2 ||
        isStreaming
      ) {
        setTimeout(() => {
          scrollElement.scrollTo({
            top: scrollElement.scrollHeight,
            behavior: messages.length <= 2 ? 'instant' : 'smooth'
          })
        }, 50)
      }
      
      lastMessageCountRef.current = messages.length
    }
  }, [messages, isStreaming])

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      isUserScrollingRef.current = false // Reset user scrolling flag
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [])

  // Reset scroll position when starting fresh
  useEffect(() => {
    if (messages.length === 0) {
      isUserScrollingRef.current = false
      lastMessageCountRef.current = 0
    }
  }, [messages.length])

  return (
    <div className="relative h-full flex flex-col bg-white">
      <div 
        ref={scrollAreaRef}
        data-scroll-area
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scroll-smooth"
        style={{ height: '100%' }}
      >
        <Messages messages={messages} />
      </div>
      <ScrollToBottom onScrollToBottom={scrollToBottom} />
    </div>
  )
}

export default MessageArea
