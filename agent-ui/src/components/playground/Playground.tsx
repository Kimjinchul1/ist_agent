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
    <div className="flex items-center gap-1.5 rounded-lg bg-primary-50 border border-primary-200 px-2 py-1.5">
      {icon && <Icon type={icon} size="xs" className="text-primary-600" />}
      <span className="text-xs font-medium text-primary-700">{model}</span>
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
    console.log('Tab change requested:', tab, { agentId, teamId, workflowId })
    
    // 사용자가 직접 클릭했음을 표시
    userClickedTab.current = true
    
    // 탭 즉시 설정
    setActiveTab(tab)
    
    // 메시지/세션 초기화
    setMessages([])
    setSessionsData([])
    setSessionId(null)
    
    // 다른 파라미터들 정리하고 필요시 기본 선택
    switch (tab) {
      case 'agents':
        if (teamId) setTeamId(null)
        if (workflowId) setWorkflowId(null)
        // 첫 번째 에이전트 자동 선택
        if (agents.length > 0 && !agentId) {
          const firstAgent = agents[0]
          console.log('Auto-selecting first agent on tab change:', firstAgent)
          setAgentId(firstAgent.value)
        }
        break
      case 'teams':
        if (agentId) setAgentId(null)
        if (workflowId) setWorkflowId(null)
        // 첫 번째 팀 자동 선택
        if (teams.length > 0 && !teamId) {
          const firstTeam = teams[0]
          console.log('Auto-selecting first team on tab change:', firstTeam)
          setTeamId(firstTeam.team_id)
        }
        break
      case 'workflows':
        if (agentId) setAgentId(null)
        if (teamId) setTeamId(null)
        // 첫 번째 워크플로우 자동 선택
        if (workflows.length > 0 && !workflowId) {
          const firstWorkflow = workflows[0]
          console.log('Auto-selecting first workflow on tab change:', firstWorkflow)
          setWorkflowId(firstWorkflow.workflow_id)
        }
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

  const getTabIcon = (tab: PlaygroundTab) => {
    switch (tab) {
      case 'agents':
        return 'agent'
      case 'teams':
        return 'users'
      case 'workflows':
        return 'workflow'
      default:
        return 'agent'
    }
  }

  const getTabLabel = (tab: PlaygroundTab) => {
    switch (tab) {
      case 'agents':
        return 'Agents'
      case 'teams':
        return 'Teams'
      case 'workflows':
        return 'Workflows'
      default:
        return 'Agents'
    }
  }

  if (!isEndpointActive) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
          <Icon type="cloud-off" size="md" className="text-secondary-400" />
        </div>
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">No Connection</h3>
        <p className="text-sm text-secondary-500 max-w-xs">
          Please configure an API endpoint to access agents, teams, and workflows.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Playground Header */}
      <div>
        <h2 className="text-base font-semibold text-secondary-900">Playground</h2>
        <p className="text-xs text-secondary-500">Configure your AI workspace</p>
      </div>

      {/* Tab Navigation */}
      <div className="p-1 bg-background-secondary rounded-lg border border-border">
        <div className="flex space-x-0.5">
          {(['agents', 'teams', 'workflows'] as PlaygroundTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-secondary-600 hover:text-secondary-900 hover:bg-accent-hover'
              }`}
            >
              <Icon 
                type={getTabIcon(tab)} 
                size="xs" 
                className={activeTab === tab ? 'text-white' : 'text-secondary-500'}
              />
              {getTabLabel(tab)}
              {getTabCount(tab) > 0 && (
                <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${
                  activeTab === tab 
                    ? 'bg-white/20 text-white' 
                    : 'bg-secondary-100 text-secondary-600'
                }`}>
                  {getTabCount(tab)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-secondary-700 uppercase">
            Select {getTabLabel(activeTab).slice(0, -1)} {/* Remove 's' from plural */}
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="h-6 w-6 p-0 hover:bg-accent-hover"
          >
            <Icon type="refresh" size="xs" className="text-secondary-500" />
          </Button>
        </div>
        
        {isEndpointLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {renderSelector()}
            {hasSelectedItem() && selectedModel && (
              <div className="pt-3 border-t border-border">
                <label className="text-xs font-medium text-secondary-700 uppercase block mb-2">
                  Selected Model
                </label>
                <ModelDisplay model={selectedModel} />
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}