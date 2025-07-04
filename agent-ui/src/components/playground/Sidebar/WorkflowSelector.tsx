'use client'

import * as React from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { usePlaygroundStore } from '@/store'
import { useQueryState } from 'nuqs'
import Icon from '@/components/ui/icon'
import { useEffect } from 'react'
import useChatActions from '@/hooks/useChatActions'

export function WorkflowSelector() {
  const { workflows, setMessages, setHasStorage, setSelectedModel } = usePlaygroundStore()
  const { focusChatInput } = useChatActions()
  const [workflowId, setWorkflowId] = useQueryState('workflow', {
    parse: (value) => value || undefined,
    history: 'push'
  })
  const [, setSessionId] = useQueryState('session')
  const [, setAgentId] = useQueryState('agent')
  const [, setTeamId] = useQueryState('team')

  // Set the storage when the component mounts if a workflow is already selected
  useEffect(() => {
    if (workflowId && workflows.length > 0) {
      const workflow = workflows.find((workflow) => workflow.workflow_id === workflowId)
      if (workflow) {
        setHasStorage(!!workflow.storage)
        focusChatInput()
      } else if (workflows.length > 0) {
        setWorkflowId(workflows[0].workflow_id)
      }
    }
  }, [workflowId, workflows, setHasStorage, setWorkflowId, focusChatInput])

  const handleOnValueChange = (value: string) => {
    const newWorkflow = value === workflowId ? '' : value
    const selectedWorkflow = workflows.find((workflow) => workflow.workflow_id === newWorkflow)
    setHasStorage(!!selectedWorkflow?.storage)
    setWorkflowId(newWorkflow)
    setMessages([])
    setSessionId(null)
    setAgentId(null)
    setTeamId(null)
    if (selectedWorkflow) {
      focusChatInput()
    }
  }

  return (
    <Select
      value={workflowId || ''}
      onValueChange={(value) => handleOnValueChange(value)}
    >
      <SelectTrigger className="h-9 w-full rounded-xl border border-primary/15 bg-primaryAccent text-xs font-medium uppercase">
        <SelectValue placeholder="Select Workflow" />
      </SelectTrigger>
      <SelectContent className="border-none bg-primaryAccent font-dmmono shadow-lg">
        {workflows.map((workflow, index) => (
          <SelectItem
            className="cursor-pointer"
            key={`${workflow.workflow_id}-${index}`}
            value={workflow.workflow_id}
          >
            <div className="flex items-center gap-3 text-xs font-medium uppercase">
              <Icon type={'workflow'} size="xs" />
              {workflow.name}
            </div>
          </SelectItem>
        ))}
        {workflows.length === 0 && (
          <SelectItem
            value="no-workflows"
            className="cursor-not-allowed select-none text-center"
          >
            No workflows found
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
} 