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
import { useEffect, useCallback } from 'react'
import useChatActions from '@/hooks/useChatActions'

export function TeamSelector() {
  const { teams, setMessages, setSelectedModel, setHasStorage } =
    usePlaygroundStore()
  const { focusChatInput } = useChatActions()
  const [teamId, setTeamId] = useQueryState('team', {
    parse: (value) => value || undefined,
    history: 'push'
  })
  const [, setSessionId] = useQueryState('session')
  const [, setAgentId] = useQueryState('agent')

  // Set the model when the component mounts if a team is already selected
  useEffect(() => {
    console.log('TeamSelector useEffect:', { teamId, teams })
    if (teamId && teams.length > 0) {
      const team = teams.find((team) => team.team_id === teamId)
      console.log('Found team:', team)
      if (team) {
        const provider = team.model?.provider || ''
        console.log('Setting model provider:', provider)
        setSelectedModel(provider)
        setHasStorage(!!team.storage)
        if (provider) {
          focusChatInput()
        }
      } else if (teams.length > 0) {
        console.log('Team not found, setting first team:', teams[0])
        setTeamId(teams[0].team_id)
      }
    }
  }, [teamId, teams, setSelectedModel, setHasStorage, setTeamId, focusChatInput])

  const handleOnValueChange = useCallback((value: string) => {
    console.log('Team selection changed:', value)
    const selectedTeam = teams.find((team) => team.team_id === value)
    console.log('Selected team:', selectedTeam)
    
    if (selectedTeam) {
      const provider = selectedTeam.model?.provider || ''
      console.log('Setting model provider:', provider)
      setSelectedModel(provider)
      setHasStorage(!!selectedTeam.storage)
      setTeamId(value)
      setMessages([])
      setSessionId(null)
      setAgentId(null)
      if (provider) {
        focusChatInput()
      }
    }
  }, [teams, setSelectedModel, setHasStorage, setTeamId, setMessages, setSessionId, setAgentId, focusChatInput])

  return (
    <Select
      value={teamId || ''}
      onValueChange={handleOnValueChange}
    >
      <SelectTrigger className="h-9 w-full rounded-xl border border-primary/15 bg-primaryAccent text-xs font-medium uppercase">
        <SelectValue placeholder="Select Team" />
      </SelectTrigger>
      <SelectContent className="border-none bg-white font-dmmono shadow-lg">
        {teams.map((team, index) => (
          <SelectItem
            className="cursor-pointer"
            key={`${team.team_id}-${index}`}
            value={team.team_id}
          >
            <div className="flex items-center gap-3 text-xs font-medium uppercase">
              <Icon type={'users'} size="xs" />
              {team.name}
            </div>
          </SelectItem>
        ))}
        {teams.length === 0 && (
          <SelectItem
            value="no-teams"
            className="cursor-not-allowed select-none text-center"
          >
            No teams found
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
} 