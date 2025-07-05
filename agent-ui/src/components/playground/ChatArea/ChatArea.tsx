'use client'

import ChatInput from './ChatInput'
import MessageArea from './MessageArea'

const ChatArea = () => {
  return (
    <main className="flex flex-1 flex-col h-full bg-white overflow-hidden">
      <div className="flex-1 min-h-0">
        <MessageArea />
      </div>
      <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6">
        <ChatInput />
      </div>
    </main>
  )
}

export default ChatArea
