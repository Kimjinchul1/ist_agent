import Icon from '@/components/ui/icon'
import MarkdownRenderer from '@/components/ui/typography/MarkdownRenderer'
import { usePlaygroundStore } from '@/store'
import type { PlaygroundChatMessage } from '@/types/playground'
import Videos from './Multimedia/Videos'
import Images from './Multimedia/Images'
import Audios from './Multimedia/Audios'
import { memo } from 'react'
import AgentThinkingLoader from './AgentThinkingLoader'

interface MessageProps {
  message: PlaygroundChatMessage
}

const AgentMessage = ({ message }: MessageProps) => {
  const { streamingErrorMessage } = usePlaygroundStore()
  let messageContent
  if (message.streamingError) {
    messageContent = (
      <div className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
        <p className="font-medium">Error occurred</p>
        <p className="text-sm mt-1">
          {streamingErrorMessage ? (
            <>{streamingErrorMessage}</>
          ) : (
            'Something went wrong while streaming. Please try refreshing the page or try again later.'
          )}
        </p>
      </div>
    )
  } else if (message.content) {
    messageContent = (
      <div className="flex w-full flex-col gap-4">
        <div className="prose prose-sm max-w-none">
          <MarkdownRenderer>{message.content}</MarkdownRenderer>
        </div>
        {message.videos && message.videos.length > 0 && (
          <Videos videos={message.videos} />
        )}
        {message.images && message.images.length > 0 && (
          <Images images={message.images} />
        )}
        {message.audio && message.audio.length > 0 && (
          <Audios audio={message.audio} />
        )}
      </div>
    )
  } else if (message.response_audio) {
    if (!message.response_audio.transcript) {
      messageContent = (
        <div className="flex items-center justify-center py-2">
          <AgentThinkingLoader />
        </div>
      )
    } else {
      messageContent = (
        <div className="flex w-full flex-col gap-4">
          <div className="prose prose-sm max-w-none">
            <MarkdownRenderer>
              {message.response_audio.transcript}
            </MarkdownRenderer>
          </div>
          {message.response_audio.content && message.response_audio && (
            <Audios audio={[message.response_audio]} />
          )}
        </div>
      )
    }
  } else {
    messageContent = (
      <div className="flex items-center justify-center py-2">
        <AgentThinkingLoader />
      </div>
    )
  }

  return (
    <div className="group relative px-4 py-6 hover:bg-gray-50/50 transition-colors">
      <div className="flex items-start gap-4 max-w-4xl mx-auto">
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
            <Icon type="agent" className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <span className="text-sm font-semibold text-gray-900">AI Assistant</span>
          </div>
          <div className="text-gray-800 leading-relaxed">
            {messageContent}
          </div>
        </div>
      </div>
    </div>
  )
}

const UserMessage = memo(({ message }: MessageProps) => {
  return (
    <div className="group relative px-4 py-6 bg-gray-50/30 hover:bg-gray-50/50 transition-colors">
      <div className="flex items-start gap-4 max-w-4xl mx-auto">
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-sm">
            <Icon type="user" className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <span className="text-sm font-semibold text-gray-900">You</span>
          </div>
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
      </div>
    </div>
  )
})

AgentMessage.displayName = 'AgentMessage'
UserMessage.displayName = 'UserMessage'
export { AgentMessage, UserMessage }
