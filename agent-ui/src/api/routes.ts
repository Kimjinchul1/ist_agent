export const APIRoutes = {
  GetPlaygroundAgents: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/v1/playground/agents`,
  GetPlaygroundTeams: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/v1/playground/teams`,
  GetPlaygroundWorkflows: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/v1/playground/workflows`,
  AgentRun: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/v1/playground/agents/{agent_id}/runs`,
  TeamRun: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/v1/playground/teams/{team_id}/runs`,
  WorkflowRun: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/v1/playground/workflows/{workflow_id}/runs`,
  PlaygroundStatus: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/v1/playground/status`,
  GetPlaygroundSessions: (PlaygroundApiUrl: string, agentId: string) =>
    `${PlaygroundApiUrl}/v1/playground/agents/${agentId}/sessions`,
  GetPlaygroundSession: (
    PlaygroundApiUrl: string,
    agentId: string,
    sessionId: string
  ) =>
    `${PlaygroundApiUrl}/v1/playground/agents/${agentId}/sessions/${sessionId}`,

  DeletePlaygroundSession: (
    PlaygroundApiUrl: string,
    agentId: string,
    sessionId: string
  ) =>
    `${PlaygroundApiUrl}/v1/playground/agents/${agentId}/sessions/${sessionId}`
}
