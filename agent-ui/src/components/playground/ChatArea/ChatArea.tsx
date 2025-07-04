'use client'

import ChatInput from './ChatInput'
import MessageArea from './MessageArea'

const ChatArea = () => {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <div className="flex-1 overflow-hidden">
        <MessageArea />
      </div>
      <div className="border-t border-border bg-background-secondary/50 p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput />
        </div>
      </div>
    </main>
  )
}

export default ChatArea
