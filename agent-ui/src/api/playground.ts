import { toast } from 'sonner'

import { APIRoutes } from './routes'

import { Agent, ComboboxAgent, SessionEntry } from '@/types/playground'

export const getPlaygroundAgentsAPI = async (
  endpoint: string
): Promise<ComboboxAgent[]> => {
  const url = APIRoutes.GetPlaygroundAgents(endpoint)
  try {
    const response = await fetch(url, { method: 'GET' })
    if (!response.ok) {
      toast.error(`Failed to fetch playground agents: ${response.statusText}`)
      return []
    }
    const data = await response.json()
    // Transform the API response into the expected shape.
    const agents: ComboboxAgent[] = data.map((item: Agent) => ({
      value: item.agent_id || '',
      label: item.name || '',
      model: item.model || '',
      storage: item.storage || false
    }))
    return agents
  } catch {
    toast.error('Error fetching playground agents')
    return []
  }
}

export const getPlaygroundTeamsAPI = async (
  endpoint: string
): Promise<any[]> => {
  const url = APIRoutes.GetPlaygroundTeams(endpoint)
  try {
    const response = await fetch(url, { method: 'GET' })
    if (!response.ok) {
      toast.error(`Failed to fetch playground teams: ${response.statusText}`)
      return []
    }
    const data = await response.json()
    return data
  } catch {
    toast.error('Error fetching playground teams')
    return []
  }
}

export const getPlaygroundWorkflowsAPI = async (
  endpoint: string
): Promise<any[]> => {
  const url = APIRoutes.GetPlaygroundWorkflows(endpoint)
  try {
    const response = await fetch(url, { method: 'GET' })
    if (!response.ok) {
      toast.error(`Failed to fetch playground workflows: ${response.statusText}`)
      return []
    }
    const data = await response.json()
    return data
  } catch {
    toast.error('Error fetching playground workflows')
    return []
  }
}

export const getPlaygroundStatusAPI = async (base: string): Promise<number> => {
  const response = await fetch(APIRoutes.PlaygroundStatus(base), {
    method: 'GET'
  })
  return response.status
}

export const getAllPlaygroundSessionsAPI = async (
  base: string,
  agentId: string
): Promise<SessionEntry[]> => {
  try {
    const response = await fetch(
      APIRoutes.GetPlaygroundSessions(base, agentId),
      {
        method: 'GET'
      }
    )
    if (!response.ok) {
      if (response.status === 404) {
        // Return empty array when storage is not enabled
        return []
      }
      throw new Error(`Failed to fetch sessions: ${response.statusText}`)
    }
    return response.json()
  } catch {
    return []
  }
}

export const getPlaygroundSessionAPI = async (
  base: string,
  agentId: string,
  sessionId: string
) => {
  const response = await fetch(
    APIRoutes.GetPlaygroundSession(base, agentId, sessionId),
    {
      method: 'GET'
    }
  )
  return response.json()
}

export const deletePlaygroundSessionAPI = async (
  base: string,
  agentId: string,
  sessionId: string
) => {
  const response = await fetch(
    APIRoutes.DeletePlaygroundSession(base, agentId, sessionId),
    {
      method: 'DELETE'
    }
  )
  return response
}

// Team 세션 관련 API 함수들 추가
export const getAllPlaygroundTeamSessionsAPI = async (
  base: string,
  teamId: string
): Promise<SessionEntry[]> => {
  try {
    const response = await fetch(
      APIRoutes.GetPlaygroundTeamSessions(base, teamId),
      {
        method: 'GET'
      }
    )
    if (!response.ok) {
      if (response.status === 404) {
        // Return empty array when storage is not enabled
        return []
      }
      throw new Error(`Failed to fetch team sessions: ${response.statusText}`)
    }
    return response.json()
  } catch {
    return []
  }
}

export const getPlaygroundTeamSessionAPI = async (
  base: string,
  teamId: string,
  sessionId: string
) => {
  const response = await fetch(
    APIRoutes.GetPlaygroundTeamSession(base, teamId, sessionId),
    {
      method: 'GET'
    }
  )
  return response.json()
}

export const deletePlaygroundTeamSessionAPI = async (
  base: string,
  teamId: string,
  sessionId: string
) => {
  const response = await fetch(
    APIRoutes.DeletePlaygroundTeamSession(base, teamId, sessionId),
    {
      method: 'DELETE'
    }
  )
  return response
}

// Workflow 세션 관련 API 함수들 추가
export const getAllPlaygroundWorkflowSessionsAPI = async (
  base: string,
  workflowId: string
): Promise<SessionEntry[]> => {
  try {
    const response = await fetch(
      APIRoutes.GetPlaygroundWorkflowSessions(base, workflowId),
      {
        method: 'GET'
      }
    )
    if (!response.ok) {
      if (response.status === 404) {
        // Return empty array when storage is not enabled
        return []
      }
      throw new Error(`Failed to fetch workflow sessions: ${response.statusText}`)
    }
    return response.json()
  } catch {
    return []
  }
}

export const getPlaygroundWorkflowSessionAPI = async (
  base: string,
  workflowId: string,
  sessionId: string
) => {
  const response = await fetch(
    APIRoutes.GetPlaygroundWorkflowSession(base, workflowId, sessionId),
    {
      method: 'GET'
    }
  )
  return response.json()
}

export const deletePlaygroundWorkflowSessionAPI = async (
  base: string,
  workflowId: string,
  sessionId: string
) => {
  const response = await fetch(
    APIRoutes.DeletePlaygroundWorkflowSession(base, workflowId, sessionId),
    {
      method: 'DELETE'
    }
  )
  return response
}
