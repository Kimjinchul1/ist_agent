'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { TextArea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { usePlaygroundStore } from '@/store'
import useAIChatStreamHandler from '@/hooks/useAIStreamHandler'
import { useQueryState } from 'nuqs'
import Icon from '@/components/ui/icon'

const ChatInput = () => {
  const { chatInputRef } = usePlaygroundStore()

  const { handleStreamResponse } = useAIChatStreamHandler()
  const [selectedAgent] = useQueryState('agent')
  const [selectedTeam] = useQueryState('team')
  const [selectedWorkflow] = useQueryState('workflow')
  const [inputMessage, setInputMessage] = useState('')
  const isStreaming = usePlaygroundStore((state) => state.isStreaming)

  const hasSelectedEntity = selectedAgent || selectedTeam || selectedWorkflow

  const handleSubmit = async () => {
    if (!inputMessage.trim()) return

    const currentMessage = inputMessage
    setInputMessage('')

    try {
      await handleStreamResponse(currentMessage)
    } catch (error) {
      toast.error(
        `Error in handleSubmit: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }

  const getPlaceholder = () => {
    if (selectedAgent) return 'Ask the agent anything...'
    if (selectedTeam) return 'Ask the team anything...'
    if (selectedWorkflow) return 'Start the workflow...'
    return 'Select an agent, team, or workflow to begin'
  }

  return (
    <div className="relative w-full">
      <div className="flex items-end gap-3 p-4 bg-white border border-border rounded-2xl shadow-professional hover:shadow-medium transition-shadow duration-200">
        <TextArea
          placeholder={getPlaceholder()}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.nativeEvent.isComposing &&
              !e.shiftKey &&
              !isStreaming
            ) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          className="flex-1 min-h-[48px] max-h-[200px] border-0 bg-transparent px-0 py-2 text-sm text-secondary-800 placeholder:text-secondary-400 focus:outline-none focus:ring-0 resize-none"
          disabled={!hasSelectedEntity}
          ref={chatInputRef}
        />
        <Button
          onClick={handleSubmit}
          disabled={!hasSelectedEntity || !inputMessage.trim() || isStreaming}
          size="icon"
          className="h-12 w-12 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover-lift shrink-0"
        >
          {isStreaming ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Icon type="send" size="sm" className="text-white" />
          )}
        </Button>
      </div>
      
      {!hasSelectedEntity && (
        <div className="absolute left-4 -top-8 text-xs text-secondary-500">
          Please select an agent, team, or workflow to start chatting
        </div>
      )}
    </div>
  )
}

export default ChatInput
