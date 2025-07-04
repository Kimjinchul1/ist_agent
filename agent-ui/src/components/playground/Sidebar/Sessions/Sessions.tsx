'use client'

import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { usePlaygroundStore } from '@/store'
import { useQueryState } from 'nuqs'
import SessionItem from './SessionItem'
import SessionBlankState from './SessionBlankState'
import useSessionLoader from '@/hooks/useSessionLoader'

import { cn } from '@/lib/utils'
import { FC } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface SkeletonListProps {
  skeletonCount: number
}

const SkeletonList: FC<SkeletonListProps> = ({ skeletonCount }) => {
  const skeletons = useMemo(
    () => Array.from({ length: skeletonCount }, (_, i) => i),
    [skeletonCount]
  )

  return skeletons.map((skeleton, index) => (
    <Skeleton
      key={skeleton}
      className={cn(
        'mb-1 h-8 rounded-lg px-2 py-1',
        index > 0 && 'bg-background-secondary'
      )}
    />
  ))
}

dayjs.extend(utc)

const formatDate = (
  timestamp: number,
  format: 'natural' | 'full' = 'full'
): string => {
  const date = dayjs.unix(timestamp).utc()
  return format === 'natural'
    ? date.format('HH:mm')
    : date.format('YYYY-MM-DD HH:mm:ss')
}

const Sessions = () => {
  const [agentId] = useQueryState('agent', {
    parse: (value) => value || undefined,
    history: 'push'
  })
  const [teamId] = useQueryState('team', {
    parse: (value) => value || undefined,
    history: 'push'
  })
  const [workflowId] = useQueryState('workflow', {
    parse: (value) => value || undefined,
    history: 'push'
  })
  const [sessionId] = useQueryState('session')
  const {
    selectedEndpoint,
    isEndpointActive,
    isEndpointLoading,
    sessionsData,
    hydrated,
    hasStorage,
    setSessionsData
  } = usePlaygroundStore()
  const [isScrolling, setIsScrolling] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  )
  const { getSession, getSessions } = useSessionLoader()
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
  const { isSessionsLoading } = usePlaygroundStore()

  const handleScroll = () => {
    setIsScrolling(true)

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 1500)
  }

  // Cleanup the scroll timeout when component unmounts
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Load a session on render if a session id exists in url
  useEffect(() => {
    if (sessionId && selectedEndpoint && hydrated) {
      // workflowId가 있으면 workflow 세션, teamId가 있으면 team 세션, agentId가 있으면 agent 세션
      if (workflowId) {
        getSession(sessionId, '', undefined, workflowId)
      } else if (teamId) {
        getSession(sessionId, '', teamId, undefined)
      } else if (agentId) {
        getSession(sessionId, agentId, undefined, undefined)
      }
    }
  }, [sessionId, selectedEndpoint, hydrated, workflowId, teamId, agentId, getSession])

  useEffect(() => {
    if (!selectedEndpoint || !hasStorage) {
      setSessionsData(() => null)
      return
    }
    if (!isEndpointLoading) {
      setSessionsData(() => null)
      // workflowId가 있으면 workflow 세션, teamId가 있으면 team 세션, agentId가 있으면 agent 세션
      if (workflowId) {
        getSessions('', undefined, workflowId)
      } else if (teamId) {
        getSessions('', teamId, undefined)
      } else if (agentId) {
        getSessions(agentId, undefined, undefined)
      }
    }
  }, [
    selectedEndpoint,
    agentId,
    teamId,
    workflowId,
    getSessions,
    isEndpointLoading,
    hasStorage,
    setSessionsData
  ])

  useEffect(() => {
    if (sessionId) {
      setSelectedSessionId(sessionId)
    }
  }, [sessionId])

  const formattedSessionsData = useMemo(() => {
    if (!sessionsData || !Array.isArray(sessionsData)) return []

    return sessionsData.map((entry) => ({
      ...entry,
      created_at: entry.created_at,
      formatted_time: formatDate(entry.created_at, 'natural')
    }))
  }, [sessionsData])

  const handleSessionClick = useCallback(
    (id: string) => () => setSelectedSessionId(id),
    []
  )

  if (isSessionsLoading || isEndpointLoading)
    return (
      <div className="w-full">
        <div className="mb-1 text-xs font-medium uppercase">Sessions</div>
        <div className="mt-2 h-32 w-full overflow-y-auto">
          <SkeletonList skeletonCount={3} />
        </div>
      </div>
    )
  return (
    <div className="w-full">
      <div className="mb-1 w-full text-xs font-medium uppercase">Sessions</div>
      <div
        className={`h-32 overflow-y-auto font-geist transition-all duration-300 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:transition-opacity [&::-webkit-scrollbar]:duration-300 ${isScrolling ? '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-background [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:opacity-0' : '[&::-webkit-scrollbar]:opacity-100'}`}
        onScroll={handleScroll}
        onMouseOver={() => setIsScrolling(true)}
        onMouseLeave={handleScroll}
      >
        {!isEndpointActive ||
        !hasStorage ||
        (!isSessionsLoading && (!sessionsData || sessionsData.length === 0)) ? (
          <SessionBlankState />
        ) : (
          <div className="flex flex-col gap-y-1 pr-1">
            {formattedSessionsData.map((entry, index) => (
              <SessionItem
                key={`${entry.session_id}-${index}`}
                {...entry}
                isSelected={selectedSessionId === entry.session_id}
                onSessionClick={handleSessionClick(entry.session_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sessions
