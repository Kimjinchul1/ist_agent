import type { PlaygroundChatMessage } from '@/types/playground'

import { AgentMessage, UserMessage } from './MessageItem'
import { memo } from 'react'
import {
  ToolCallProps,
  ReferenceData,
  Reference
} from '@/types/playground'
import React, { type FC } from 'react'
import ChatBlankState from './ChatBlankState'
import Icon from '@/components/ui/icon'
import CollapsibleReasoning from './CollapsibleReasoning'

interface MessageListProps {
  messages: PlaygroundChatMessage[]
}

interface MessageWrapperProps {
  message: PlaygroundChatMessage
  isLastMessage: boolean
}

interface ReferenceProps {
  references: ReferenceData[]
}

interface ReferenceItemProps {
  reference: Reference
}

const ReferenceItem: FC<ReferenceItemProps> = ({ reference }) => (
  <div className="relative flex h-[68px] w-[220px] cursor-default flex-col justify-between overflow-hidden rounded-lg bg-gray-50 border border-gray-200 p-4 transition-all hover:bg-gray-100 hover:shadow-sm">
    <p className="text-sm font-medium text-gray-900 truncate">{reference.name}</p>
    <p className="truncate text-xs text-gray-600">{reference.content}</p>
  </div>
)

const References: FC<ReferenceProps> = ({ references }) => (
  <div className="space-y-6">
    {references.map((referenceData, index) => (
      <div
        key={`${referenceData.query}-${index}`}
        className="space-y-3"
      >
        <div className="flex flex-wrap gap-3">
          {referenceData.references.map((reference, refIndex) => (
            <ReferenceItem
              key={`${reference.name}-${reference.meta_data.chunk}-${refIndex}`}
              reference={reference}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
)

const AgentMessageWrapper = ({ message }: MessageWrapperProps) => {
  return (
    <div className="space-y-6">
      {message.extra_data?.reasoning_steps &&
        message.extra_data.reasoning_steps.length > 0 && (
          <div className="px-4 py-6 bg-blue-50/50 border-l-4 border-blue-200">
            <div className="flex items-start gap-4 max-w-4xl mx-auto">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 mt-1">
                <Icon type="reasoning" size="sm" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-blue-900">Reasoning Process</h4>
                  <div className="h-px flex-1 bg-blue-200" />
                </div>
                <CollapsibleReasoning reasoning={message.extra_data.reasoning_steps} />
              </div>
            </div>
          </div>
        )}
      {message.extra_data?.references &&
        message.extra_data.references.length > 0 && (
          <div className="px-4 py-6 bg-gray-50/50 border-l-4 border-gray-200">
            <div className="flex items-start gap-4 max-w-4xl mx-auto">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 mt-1">
                <Icon type="references" size="sm" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900">References</h4>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
                <References references={message.extra_data.references} />
              </div>
            </div>
          </div>
        )}
      {message.tool_calls && message.tool_calls.length > 0 && (
        <div className="px-4 py-6 bg-amber-50/50 border-l-4 border-amber-200">
          <div className="flex items-start gap-4 max-w-4xl mx-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 mt-1">
              <Icon type="hammer" size="sm" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-amber-900">Tool Calls</h4>
                <div className="h-px flex-1 bg-amber-200" />
              </div>
              <div className="flex flex-wrap gap-2">
                {message.tool_calls.map((toolCall, index) => (
                  <ToolComponent
                    key={
                      toolCall.tool_call_id ||
                      `${toolCall.tool_name}-${toolCall.created_at}-${index}`
                    }
                    tools={toolCall}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <AgentMessage message={message} />
    </div>
  )
}



const ToolComponent = memo(({ tools }: ToolCallProps) => (
  <div className="cursor-default rounded-full bg-amber-100 border border-amber-200 px-3 py-2">
    <p className="font-mono text-xs font-medium text-amber-800 uppercase">{tools.tool_name}</p>
  </div>
))
ToolComponent.displayName = 'ToolComponent'

const Messages = ({ messages }: MessageListProps) => {
  if (messages.length === 0) {
    return <ChatBlankState />
  }

  return (
    <div className="min-h-full pb-4">
      {messages.map((message, index) => {
        const key = `${message.role}-${message.created_at}-${index}`
        const isLastMessage = index === messages.length - 1

        if (message.role === 'agent') {
          return (
            <div key={key} className="border-b border-gray-50 last:border-b-0">
              <AgentMessageWrapper
                message={message}
                isLastMessage={isLastMessage}
              />
            </div>
          )
        }
        return (
          <div key={key} className="border-b border-gray-50 last:border-b-0">
            <UserMessage message={message} />
          </div>
        )
      })}
    </div>
  )
}

export default Messages
