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

  // Set the model when the component mounts if a team is already selected
  useEffect(() => {
    if (teamId && teams.length > 0) {
      const team = teams.find((team) => team.team_id === teamId)
      if (team) {
        setSelectedModel(team.model?.provider || '')
        setHasStorage(!!team.storage)
        if (team.model?.provider) {
          focusChatInput()
        }
      } else if (teams.length > 0) {
        setTeamId(teams[0].team_id)
      }
    }
  }, [teamId, teams])

  const handleOnValueChange = useCallback((value: string) => {
    const newTeam = value === teamId ? '' : value
    const selectedTeam = teams.find((team) => team.team_id === newTeam)
    setSelectedModel(selectedTeam?.model?.provider || '')
    setHasStorage(!!selectedTeam?.storage)
    setTeamId(newTeam)
    setMessages([])
    setSessionId(null)
    if (selectedTeam?.model?.provider) {
      focusChatInput()
    }
  }, [teamId, teams, setSelectedModel, setHasStorage, setTeamId, setMessages, setSessionId, focusChatInput])

  return (
    <Select
      value={teamId || ''}
      onValueChange={handleOnValueChange}
    >
      <SelectTrigger className="h-9 w-full rounded-xl border border-primary/15 bg-primaryAccent text-xs font-medium uppercase">
        <SelectValue placeholder="Select Team" />
      </SelectTrigger>
      <SelectContent className="border-none bg-primaryAccent font-dmmono shadow-lg">
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