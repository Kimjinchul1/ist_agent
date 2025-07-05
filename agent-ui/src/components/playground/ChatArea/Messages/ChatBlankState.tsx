'use client'

import { IconType } from '@/components/ui/icon/types'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { usePlaygroundStore } from '@/store'
import { PlaygroundChatMessage } from '@/types/playground'
import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import Icon from '@/components/ui/icon'

const EXTERNAL_LINKS = {
  phoenix: 'http://localhost:6006/v1/traces',
  evalhub: 'http://localhost:8080'
}

interface TechIcon {
  id: string
  type: IconType
  name: string
  position: string
  zIndex: number
  link: string
}

const TECH_ICONS: TechIcon[] = [
  {
    id: 'nextjs',
    type: 'nextjs',
    name: 'Next.js',
    position: 'left-0',
    zIndex: 30,
    link: 'https://nextjs.org/'
  },
  {
    id: 'react',
    type: 'nextjs',
    name: 'React',
    position: 'left-[20px]',
    zIndex: 20,
    link: 'https://react.dev/'
  },
  {
    id: 'typescript',
    type: 'nextjs',
    name: 'TypeScript',
    position: 'left-[40px]',
    zIndex: 10,
    link: 'https://www.typescriptlang.org/'
  },
  {
    id: 'tailwind',
    type: 'tailwind',
    name: 'Tailwind CSS',
    position: 'left-[60px]',
    zIndex: 0,
    link: 'https://tailwindcss.com/'
  }
]

interface ActionButtonProps {
  href: string
  text: string
  variant?: 'primary' | 'secondary'
}

const ActionButton: React.FC<ActionButtonProps> = ({
  href,
  text,
  variant = 'secondary'
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variantClasses = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 hover:shadow-lg hover:-translate-y-0.5',
    secondary:
      'border border-border bg-background text-secondary-700 hover:bg-accent-hover hover:text-secondary-900 focus:ring-primary-500 hover:shadow-md hover:-translate-y-0.5'
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {text}
    </Link>
  )
}

const ChatBlankState = () => {
  const { setMessages } = usePlaygroundStore()
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

  const addSampleMessages = () => {
    const sampleMessages: PlaygroundChatMessage[] = [
      {
        role: 'user',
        content: 'Can you solve this math problem and show me some code examples?',
        created_at: Date.now()
      },
      {
        role: 'agent',
        content: `Sure! Let me solve a mathematical problem and show you some code examples.

## Mathematical Problem: Quadratic Equation

Let's solve the equation $ax^2 + bx + c = 0$ where $a = 2$, $b = 5$, and $c = -3$.

Using the quadratic formula:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

Substituting our values:
$$x = \\frac{-5 \\pm \\sqrt{5^2 - 4(2)(-3)}}{2(2)}$$
$$x = \\frac{-5 \\pm \\sqrt{25 + 24}}{4}$$
$$x = \\frac{-5 \\pm \\sqrt{49}}{4}$$
$$x = \\frac{-5 \\pm 7}{4}$$

So we have two solutions:
- $x_1 = \\frac{-5 + 7}{4} = \\frac{2}{4} = 0.5$
- $x_2 = \\frac{-5 - 7}{4} = \\frac{-12}{4} = -3$

## Code Examples

### Python Implementation

\`\`\`python
import math

def solve_quadratic(a, b, c):
    """
    Solve quadratic equation ax^2 + bx + c = 0
    Returns tuple of solutions (x1, x2)
    """
    discriminant = b**2 - 4*a*c
    
    if discriminant < 0:
        return None  # No real solutions
    
    sqrt_discriminant = math.sqrt(discriminant)
    x1 = (-b + sqrt_discriminant) / (2*a)
    x2 = (-b - sqrt_discriminant) / (2*a)
    
    return (x1, x2)

# Test our function
a, b, c = 2, 5, -3
solutions = solve_quadratic(a, b, c)
print(f"Solutions: x1 = {solutions[0]}, x2 = {solutions[1]}")
\`\`\`

### JavaScript Implementation

\`\`\`javascript
function solveQuadratic(a, b, c) {
    const discriminant = b * b - 4 * a * c;
    
    if (discriminant < 0) {
        return null; // No real solutions
    }
    
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const x1 = (-b + sqrtDiscriminant) / (2 * a);
    const x2 = (-b - sqrtDiscriminant) / (2 * a);
    
    return [x1, x2];
}

// Test the function
const [x1, x2] = solveQuadratic(2, 5, -3);
console.log(\`Solutions: x1 = \${x1}, x2 = \${x2}\`);
\`\`\`

### C++ Implementation

\`\`\`cpp
#include <iostream>
#include <cmath>
#include <vector>

std::vector<double> solveQuadratic(double a, double b, double c) {
    double discriminant = b * b - 4 * a * c;
    
    if (discriminant < 0) {
        return {}; // No real solutions
    }
    
    double sqrtDiscriminant = std::sqrt(discriminant);
    double x1 = (-b + sqrtDiscriminant) / (2 * a);
    double x2 = (-b - sqrtDiscriminant) / (2 * a);
    
    return {x1, x2};
}

int main() {
    auto solutions = solveQuadratic(2, 5, -3);
    std::cout << "Solutions: x1 = " << solutions[0] 
              << ", x2 = " << solutions[1] << std::endl;
    return 0;
}
\`\`\`

As you can see, the mathematical result is consistent across all implementations: $x_1 = 0.5$ and $x_2 = -3$.`,
        created_at: Date.now()
      }
    ]
    
    setMessages(sampleMessages)
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
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <img 
                  src="/IST_LOGO.png" 
                  alt="IST Logo" 
                  className="w-24 h-24 object-contain rounded-lg"
                />
              </div>
              
              <h1 className="text-3xl font-bold text-secondary-900">The Easiest Agent-Framework</h1>
              
              <p className="text-l text-secondary-700 max-w-2xl mx-auto leading-relaxed">
                Provided by Information & Strategy Team, AI Center
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-secondary-500">
              <span>Built with</span>
              <div className="relative ml-2 h-[40px] w-[90px]">
                {TECH_ICONS.map((icon, index) => (
                  <motion.div
                    key={`${icon.id}-${index}`}
                    className={`absolute ${icon.position} top-0`}
                    style={{ zIndex: icon.zIndex }}
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                    animate={hoveredIcon === icon.id ? 'hover' : 'exit'}
                    onHoverStart={() => setHoveredIcon(icon.id)}
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
                        animate={hoveredIcon === icon.id ? 'visible' : 'hidden'}
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
              href={EXTERNAL_LINKS.phoenix}
              variant="primary"
              text="Chat Tracing 하기"
            />
            <ActionButton
              href={EXTERNAL_LINKS.evalhub}
              text="AI 모델 비교하기"
            />
          </motion.div>

          {/* Test section for markdown rendering */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="pt-8 border-t border-border"
          >
            <p className="text-sm text-secondary-500 mb-4">
              Test the enhanced markdown rendering with math and code support:
            </p>
            <Button
              onClick={addSampleMessages}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Load Sample Messages
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ChatBlankState
