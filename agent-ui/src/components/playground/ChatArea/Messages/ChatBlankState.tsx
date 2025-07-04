'use client'

import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import Icon from '@/components/ui/icon'
import { IconType } from '@/components/ui/icon/types'
import React, { useState } from 'react'

const EXTERNAL_LINKS = {
  documentation: 'http://localhost:8000',
  playground: 'http://localhost:6006',
  agno: 'https://agno.com'
}

const TECH_ICONS = [
  {
    type: 'nextjs' as IconType,
    position: 'left-0',
    link: 'https://nextjs.org',
    name: 'Next.js',
    zIndex: 10
  },
  {
    type: 'shadcn' as IconType,
    position: 'left-[15px]',
    link: 'https://ui.shadcn.com',
    name: 'shadcn/ui',
    zIndex: 20
  },
  {
    type: 'tailwind' as IconType,
    position: 'left-[30px]',
    link: 'https://tailwindcss.com',
    name: 'Tailwind CSS',
    zIndex: 30
  }
]



interface ActionButtonProps {
  href: string
  variant?: 'primary' | 'secondary'
  text: string
}

const ActionButton = ({ href, variant = 'secondary', text }: ActionButtonProps) => {
  const baseStyles = 'px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg hover-lift'
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-professional',
    secondary: 'border border-border text-secondary-700 hover:bg-accent-hover hover:text-secondary-900'
  }

  return (
    <Link
      href={href}
      target="_blank"
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {text}
    </Link>
  )
}



const ChatBlankState = () => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)

  // Animation variants for the icon
  const iconVariants: Variants = {
    initial: { y: 0, scale: 1 },
    hover: {
      y: -4,
      scale: 1.1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        mass: 0.5
      }
    },
    exit: {
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        mass: 0.6
      }
    }
  }

  // Animation variants for the tooltip
  const tooltipVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 5,
      transition: {
        duration: 0.15,
        ease: 'easeInOut'
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.15,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <section
      className="flex flex-col items-center text-center max-w-6xl mx-auto py-16"
      aria-label="Welcome to Agent UI"
    >
      <div className="space-y-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <img 
                  src="/IST_LOGO.png" 
                  alt="Agent UI Logo" 
                  className="w-12 h-12 object-contain rounded-lg"
                />
              </div>
              <h1 className="text-3xl font-bold text-secondary-900">정보전략팀 Agent Open UI</h1>
            </div>
            
            <p className="text-xl text-secondary-700 max-w-2xl mx-auto leading-relaxed">
              Provided by AI Center, Information & Strategy Team
            </p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-secondary-500">
              <span>Built with</span>
              <div className="relative ml-2 h-[40px] w-[90px]">
                {TECH_ICONS.map((icon) => (
                  <motion.div
                    key={icon.type}
                    className={`absolute ${icon.position} top-0`}
                    style={{ zIndex: icon.zIndex }}
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                    animate={hoveredIcon === icon.type ? 'hover' : 'exit'}
                    onHoverStart={() => setHoveredIcon(icon.type)}
                    onHoverEnd={() => setHoveredIcon(null)}
                  >
                    <Link
                      href={icon.link}
                      target="_blank"
                      rel="noopener"
                      className="relative block cursor-pointer"
                    >
                      <div>
                        <Icon type={icon.type} size="default" />
                      </div>
                      <motion.div
                        className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-lg bg-secondary-900 px-3 py-1 text-xs text-white shadow-lg"
                        variants={tooltipVariants}
                        initial="hidden"
                        animate={hoveredIcon === icon.type ? 'visible' : 'hidden'}
                      >
                        {icon.name}
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center gap-4"
          >
            <ActionButton
              href={EXTERNAL_LINKS.playground}
              variant="primary"
              text="Chat Tracing 하기"
            />
            <ActionButton
              href={EXTERNAL_LINKS.documentation}
              text="AI 모델 비교하기"
            />
          </motion.div>
        </motion.div>


      </div>
    </section>
  )
}

export default ChatBlankState
