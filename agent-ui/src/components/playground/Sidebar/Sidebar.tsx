'use client'
import { Button } from '@/components/ui/button'
import { Playground } from '@/components/playground/Playground'
import useChatActions from '@/hooks/useChatActions'
import { usePlaygroundStore } from '@/store'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Icon from '@/components/ui/icon'
import Sessions from './Sessions'
import { isValidUrl } from '@/lib/utils'
import { toast } from 'sonner'
import { useQueryState } from 'nuqs'
import { truncateText } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const ENDPOINT_PLACEHOLDER = 'No endpoint configured'

const SidebarHeader = () => (
  <div className="flex items-center gap-3 p-1">
    <div className="flex items-center justify-center w-10 h-10 rounded-lg">
      <img 
        src="/IST_LOGO.png" 
        alt="Agent UI Logo" 
        className="w-10 h-10 object-contain rounded-lg"
      />
    </div>
    <div>
      <h1 className="text-sm font-semibold text-secondary-900">Agent UI</h1>
      <p className="text-xs text-secondary-500">Professional AI Interface</p>
    </div>
  </div>
)

const NewChatButton = ({
  disabled,
  onClick
}: {
  disabled: boolean
  onClick: () => void
}) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    className="h-10 w-full rounded-lg bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover-lift"
  >
    <Icon type="plus-icon" size="xs" className="text-white mr-2" />
    New Conversation
  </Button>
)

const Endpoint = () => {
  const {
    selectedEndpoint,
    isEndpointActive,
    setSelectedEndpoint,
    setAgents,
    setTeams,
    setWorkflows,
    setSessionsData,
    setMessages
  } = usePlaygroundStore()
  const { initializePlayground } = useChatActions()
  const [isEditing, setIsEditing] = useState(false)
  const [endpointValue, setEndpointValue] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [, setAgentId] = useQueryState('agent')
  const [, setTeamId] = useQueryState('team')
  const [, setWorkflowId] = useQueryState('workflow')
  const [, setSessionId] = useQueryState('session')

  useEffect(() => {
    setEndpointValue(selectedEndpoint)
    setIsMounted(true)
  }, [selectedEndpoint])

  const getStatusColor = (isActive: boolean) =>
    isActive ? 'bg-success-500' : 'bg-destructive-500'

  const handleSave = async () => {
    if (!isValidUrl(endpointValue)) {
      toast.error('Please enter a valid URL')
      return
    }
    const cleanEndpoint = endpointValue.replace(/\/$/, '').trim()
    setSelectedEndpoint(cleanEndpoint)
    setAgentId(null)
    setTeamId(null)
    setWorkflowId(null)
    setSessionId(null)
    setIsEditing(false)
    setIsHovering(false)
    setAgents([])
    setTeams([])
    setWorkflows([])
    setSessionsData([])
    setMessages([])
  }

  const handleCancel = () => {
    setEndpointValue(selectedEndpoint)
    setIsEditing(false)
    setIsHovering(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleRefresh = async () => {
    setIsRotating(true)
    await initializePlayground()
    setTimeout(() => setIsRotating(false), 500)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-secondary-700">API Endpoint</label>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="h-8 w-8 p-0 hover:bg-accent-hover"
        >
          <motion.div
            animate={{ rotate: isRotating ? 360 : 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Icon type="refresh" size="xs" className="text-secondary-500" />
          </motion.div>
        </Button>
      </div>
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={endpointValue}
            onChange={(e) => setEndpointValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm text-secondary-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            placeholder="Enter API endpoint URL..."
            autoFocus
          />
          <Button
            onClick={handleSave}
            size="sm"
            className="h-10 px-3 bg-primary-600 hover:bg-primary-700 text-white"
          >
            <Icon type="save" size="xs" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <motion.div
            className="flex-1 relative cursor-pointer"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => setIsEditing(true)}
          >
            <div className="h-10 px-3 rounded-lg border border-border bg-background-secondary flex items-center justify-between hover:border-border-medium transition-colors">
              <AnimatePresence mode="wait">
                {isHovering ? (
                  <motion.div
                    key="hover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Icon type="edit" size="xs" className="text-secondary-500" />
                    <span className="text-sm text-secondary-600">Edit endpoint</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between w-full"
                  >
                    <span className="text-sm text-secondary-600 truncate">
                      {isMounted 
                        ? truncateText(selectedEndpoint, 28) || ENDPOINT_PLACEHOLDER
                        : 'Loading...'
                      }
                    </span>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(isEndpointActive)}`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
      
      {isEndpointActive && (
        <div className="flex items-center gap-2 px-3 py-2 bg-success-50 rounded-lg border border-success-200">
          <div className="w-2 h-2 rounded-full bg-success-500" />
          <span className="text-xs text-success-700 font-medium">Connected</span>
        </div>
      )}
    </div>
  )
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { clearChat, focusChatInput, initializePlayground } = useChatActions()
  const {
    messages,
    selectedEndpoint,
    isEndpointActive,
    hydrated
  } = usePlaygroundStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (hydrated) initializePlayground()
  }, [selectedEndpoint, initializePlayground, hydrated])

  const handleNewChat = () => {
    clearChat()
    focusChatInput()
  }

  return (
    <motion.aside
      className="relative flex h-screen shrink-0 flex-col bg-background-secondary border-r border-border"
      initial={{ width: '20rem' }}
      animate={{ width: isCollapsed ? '3rem' : '20rem' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="p-4 border-b border-border">
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-4 top-4 z-10 p-2 rounded-lg border border-border hover:bg-accent-hover hover:border-primary-300 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
                  <Icon
          type="sheet"
          size="xs"
          className={`text-black hover:text-primary-600 transition-all ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}
        />
        </motion.button>
        
        <motion.div
          className="pr-8"
          initial={{ opacity: 1 }}
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <SidebarHeader />
        </motion.div>
      </div>

      <motion.div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        initial={{ opacity: 1 }}
        animate={{ opacity: isCollapsed ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: isCollapsed ? 'none' : 'auto' }}
      >
        <NewChatButton
          disabled={messages.length === 0}
          onClick={handleNewChat}
        />
        
        {isMounted && (
          <>
            <Endpoint />
            {isEndpointActive && (
              <div className="space-y-4">
                <div className="border-t border-border pt-4">
                  <Playground />
                </div>
                <div className="border-t border-border pt-4">
                  <Sessions />
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.aside>
  )
}

export default Sidebar
