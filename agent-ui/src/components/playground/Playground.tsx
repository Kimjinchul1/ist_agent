'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { AgentSelector } from '@/components/playground/Sidebar/AgentSelector'
import { TeamSelector } from '@/components/playground/Sidebar/TeamSelector'
import { WorkflowSelector } from '@/components/playground/Sidebar/WorkflowSelector'
import { usePlaygroundStore } from '@/store'
import { useQueryState } from 'nuqs'
import Icon from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import useChatActions from '@/hooks/useChatActions'
import { getProviderIcon } from '@/lib/modelProvider'

type PlaygroundTab = 'agents' | 'teams' | 'workflows'

const ModelDisplay = ({ model }: { model: string }) => {
  const icon = getProviderIcon(model)
  return (
    <div className="flex items-center gap-2 rounded-lg bg-accent/50 px-3 py-2">
      {icon && <Icon type={icon} size="xs" />}
      <span className="text-xs font-medium text-muted">{model}</span>
    </div>
  )
}

export function Playground() {
  const {
    agents,
    teams,
    workflows,
    selectedModel,
    isEndpointLoading,
    isEndpointActive,
    setMessages,
    setSessionsData
  } = usePlaygroundStore()
  const { initializePlayground } = useChatActions()
  const [activeTab, setActiveTab] = useState<PlaygroundTab>('agents')
  const [agentId, setAgentId] = useQueryState('agent')
  const [teamId, setTeamId] = useQueryState('team')
  const [workflowId, setWorkflowId] = useQueryState('workflow')
  const [, setSessionId] = useQueryState('session')
  const userClickedTab = useRef(false)
  const isInitialRender = useRef(true)

  // URL 파라미터에 따라 적절한 탭 선택
  useEffect(() => {
    // 초기 렌더링인 경우만 처리하여 무한 루프 방지
    if (!isInitialRender.current) {
      return
    }
    
    // 사용자가 직접 탭을 클릭한 경우는 무시
    if (userClickedTab.current) {
      userClickedTab.current = false
      return
    }

    // URL 파라미터에 따라 탭 결정
    if (teamId && !agentId && !workflowId) {
      setActiveTab('teams')
    } else if (workflowId && !agentId && !teamId) {
      setActiveTab('workflows')
    } else if (agentId && !teamId && !workflowId) {
      setActiveTab('agents')
    }
    
    isInitialRender.current = false
  }, [agentId, teamId, workflowId])

  const handleRefresh = async () => {
    await initializePlayground()
  }

  const handleTabChange = (tab: PlaygroundTab) => {
    // 사용자가 직접 클릭했음을 표시
    userClickedTab.current = true
    
    // 탭 즉시 설정
    setActiveTab(tab)
    
    // 메시지/세션 초기화
    setMessages([])
    setSessionsData([])
    setSessionId(null)
    
    // 다른 파라미터들 즉시 정리 (setTimeout 제거)
    switch (tab) {
      case 'agents':
        if (teamId) setTeamId(null)
        if (workflowId) setWorkflowId(null)
        break
      case 'teams':
        if (agentId) setAgentId(null)
        if (workflowId) setWorkflowId(null)
        break
      case 'workflows':
        if (agentId) setAgentId(null)
        if (teamId) setTeamId(null)
        break
    }
  }

  const renderSelector = () => {
    switch (activeTab) {
      case 'agents':
        return <AgentSelector />
      case 'teams':
        return <TeamSelector />
      case 'workflows':
        return <WorkflowSelector />
      default:
        return null
    }
  }

  const hasSelectedItem = () => {
    switch (activeTab) {
      case 'agents':
        return agentId && selectedModel
      case 'teams':
        return teamId && selectedModel
      case 'workflows':
        return workflowId
      default:
        return false
    }
  }

  const getTabCount = (tab: PlaygroundTab) => {
    switch (tab) {
      case 'agents':
        return agents.length
      case 'teams':
        return teams.length
      case 'workflows':
        return workflows.length
      default:
        return 0
    }
  }

  if (!isEndpointActive) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Icon type="cloud-off" size="lg" className="mb-4 text-muted" />
        <h3 className="mb-2 text-lg font-medium">No endpoint connected</h3>
        <p className="text-sm text-muted">
          Please configure an endpoint to access agents, teams, and workflows.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Playground Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Playground</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          className="hover:cursor-pointer hover:bg-transparent"
        >
          <Icon type="refresh" size="xs" />
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 rounded-xl bg-accent p-1">
        {(['agents', 'teams', 'workflows'] as PlaygroundTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium uppercase transition-colors ${
              activeTab === tab
                ? 'bg-primary text-background'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <Icon 
              type={tab === 'agents' ? 'agent' : tab === 'teams' ? 'users' : 'workflow'} 
              size="xs" 
            />
            {tab}
            {getTabCount(tab) > 0 && (
              <span className="ml-1 rounded-full bg-background/20 px-1.5 py-0.5 text-xs">
                {getTabCount(tab)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <motion.div
        className="flex w-full flex-col items-start gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-xs font-medium uppercase text-primary">
          {activeTab.slice(0, -1)} {/* Remove 's' from plural */}
        </div>
        
        {isEndpointLoading ? (
          <div className="flex w-full flex-col gap-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {renderSelector()}
            {hasSelectedItem() && selectedModel && (
              <ModelDisplay model={selectedModel} />
            )}
          </>
        )}
      </motion.div>
    </div>
  )
} 