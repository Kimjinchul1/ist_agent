import { useQueryState } from 'nuqs'
import { SessionEntry } from '@/types/playground'
import { Button } from '../../../ui/button'
import useSessionLoader from '@/hooks/useSessionLoader'
import { deletePlaygroundSessionAPI } from '@/api/playground'
import { usePlaygroundStore } from '@/store'
import { toast } from 'sonner'
import Icon from '@/components/ui/icon'
import { useState } from 'react'
import DeleteSessionModal from './DeleteSessionModal'
import useChatActions from '@/hooks/useChatActions'
import { truncateText, cn } from '@/lib/utils'

type SessionItemProps = SessionEntry & {
  isSelected: boolean
  onSessionClick: () => void
}
const SessionItem = ({
  title,
  session_id,
  isSelected,
  onSessionClick
}: SessionItemProps) => {
  const [agentId] = useQueryState('agent')
  const [teamId] = useQueryState('team')
  const { getSession } = useSessionLoader()
  const [, setSessionId] = useQueryState('session')
  const { selectedEndpoint, sessionsData, setSessionsData } =
    usePlaygroundStore()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { clearChat } = useChatActions()

  const handleGetSession = async () => {
    if (agentId || teamId) {
      onSessionClick()
      await getSession(session_id, agentId || '', teamId || undefined)
      setSessionId(session_id)
    }
  }

  const handleDeleteSession = async () => {
    if (agentId || teamId) {
      try {
        let response
        if (teamId) {
          const { deletePlaygroundTeamSessionAPI } = await import('@/api/playground')
          response = await deletePlaygroundTeamSessionAPI(
            selectedEndpoint,
            teamId,
            session_id
          )
        } else if (agentId) {
          response = await deletePlaygroundSessionAPI(
            selectedEndpoint,
            agentId,
            session_id
          )
        }
        
        if (response?.status === 200 && sessionsData) {
          setSessionsData(
            sessionsData.filter((session) => session.session_id !== session_id)
          )
          clearChat()
          toast.success('Session deleted')
        } else {
          toast.error('Failed to delete session')
        }
      } catch {
        toast.error('Failed to delete session')
      } finally {
        setIsDeleteModalOpen(false)
      }
    }
  }
  return (
    <>
      <div
        className={cn(
          'group flex h-8 w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1 transition-colors duration-200',
          isSelected
            ? 'cursor-default bg-primary/10'
            : 'bg-background-secondary hover:bg-background-secondary/80'
        )}
        onClick={handleGetSession}
      >
        <div className="flex flex-col">
          <h4
            className={cn('text-xs font-medium', isSelected && 'text-primary')}
          >
            {truncateText(title, 18)}
          </h4>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="transform opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            setIsDeleteModalOpen(true)
          }}
        >
          <Icon type="trash" size="xs" />
        </Button>
      </div>
      <DeleteSessionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteSession}
        isDeleting={false}
      />
    </>
  )
}

export default SessionItem
