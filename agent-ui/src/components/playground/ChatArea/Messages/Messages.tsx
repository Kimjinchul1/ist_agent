import type { PlaygroundChatMessage } from '@/types/playground'

import { AgentMessage, UserMessage } from './MessageItem'
import Tooltip from '@/components/ui/tooltip'
import { memo } from 'react'
import {
  ToolCallProps,
  ReasoningStepProps,
  ReasoningProps,
  ReferenceData,
  Reference
} from '@/types/playground'
import React, { type FC } from 'react'
import ChatBlankState from './ChatBlankState'
import Icon from '@/components/ui/icon'

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
  <div className="relative flex h-[68px] w-[220px] cursor-default flex-col justify-between overflow-hidden rounded-lg bg-background-secondary border border-border p-4 transition-all hover:bg-accent-hover hover:shadow-soft">
    <p className="text-sm font-medium text-secondary-900 truncate">{reference.name}</p>
    <p className="truncate text-xs text-secondary-500">{reference.content}</p>
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
    <div className="space-y-8">
      {message.extra_data?.reasoning_steps &&
        message.extra_data.reasoning_steps.length > 0 && (
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <Icon type="reasoning" size="sm" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-secondary-900">Reasoning Process</h4>
                <div className="h-px flex-1 bg-border" />
              </div>
              <Reasonings reasoning={message.extra_data.reasoning_steps} />
            </div>
          </div>
        )}
      {message.extra_data?.references &&
        message.extra_data.references.length > 0 && (
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-100 text-secondary-600">
              <Icon type="references" size="sm" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-secondary-900">References</h4>
                <div className="h-px flex-1 bg-border" />
              </div>
              <References references={message.extra_data.references} />
            </div>
          </div>
        )}
      {message.tool_calls && message.tool_calls.length > 0 && (
        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning-100 text-warning-600">
            <Icon type="hammer" size="sm" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-secondary-900">Tool Calls</h4>
              <div className="h-px flex-1 bg-border" />
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
      )}
      <AgentMessage message={message} />
    </div>
  )
}

const Reasoning: FC<ReasoningStepProps> = ({ index, stepTitle }) => (
  <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg border border-border">
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white">
      <span className="text-xs font-medium">{index + 1}</span>
    </div>
    <p className="text-sm text-secondary-700">{stepTitle}</p>
  </div>
)

const Reasonings: FC<ReasoningProps> = ({ reasoning }) => (
  <div className="space-y-2">
    {reasoning.map((title, index) => (
      <Reasoning
        key={`${title.title}-${title.action}-${index}`}
        stepTitle={title.title}
        index={index}
      />
    ))}
  </div>
)

const ToolComponent = memo(({ tools }: ToolCallProps) => (
  <div className="cursor-default rounded-full bg-secondary-100 border border-secondary-200 px-3 py-2">
    <p className="font-dmmono text-xs font-medium text-secondary-700 uppercase">{tools.tool_name}</p>
  </div>
))
ToolComponent.displayName = 'ToolComponent'

const Messages = ({ messages }: MessageListProps) => {
  if (messages.length === 0) {
    return <ChatBlankState />
  }

  return (
    <div className="space-y-12">
      {messages.map((message, index) => {
        const key = `${message.role}-${message.created_at}-${index}`
        const isLastMessage = index === messages.length - 1

        if (message.role === 'agent') {
          return (
            <AgentMessageWrapper
              key={key}
              message={message}
              isLastMessage={isLastMessage}
            />
          )
        }
        return <UserMessage key={key} message={message} />
      })}
    </div>
  )
}

export default Messages
