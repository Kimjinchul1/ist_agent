import React, { useState } from 'react'
import { ReasoningSteps } from '@/types/playground'
import Icon from '@/components/ui/icon'

interface CollapsibleReasoningStepProps {
  step: ReasoningSteps
  index: number
}

const CollapsibleReasoningStep: React.FC<CollapsibleReasoningStepProps> = ({ step, index }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="bg-white rounded-lg border border-blue-200 overflow-hidden">
      {/* Collapsed Header */}
      <div 
        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50 transition-colors"
        onClick={toggleExpanded}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
          <span className="text-xs font-medium">{index + 1}</span>
        </div>
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">DEBUG</span>
            <span className="text-sm text-blue-800 font-medium">{step.title}</span>
          </div>
          <Icon 
            type={isExpanded ? "chevron-up" : "chevron-down"} 
            size="sm" 
            className="text-blue-600 transition-transform"
          />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-blue-100">
          <div className="space-y-3 pt-3">
            {/* Title */}
            <div>
              <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Title</h5>
              <p className="text-sm text-gray-900">{step.title}</p>
            </div>

            {/* Reasoning */}
            {step.reasoning && (
              <div>
                <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Reasoning</h5>
                <p className="text-sm text-gray-800 leading-relaxed">{step.reasoning}</p>
              </div>
            )}

            {/* Action */}
            {step.action && (
              <div>
                <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Action</h5>
                <p className="text-sm text-gray-800">{step.action}</p>
              </div>
            )}

            {/* Confidence */}
            {step.confidence !== undefined && (
              <div>
                <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Confidence</h5>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${(step.confidence * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-blue-600">{step.confidence}</span>
                </div>
              </div>
            )}

            {/* Result */}
            {step.result && (
              <div>
                <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Result</h5>
                <p className="text-sm text-gray-800">{step.result}</p>
              </div>
            )}

            {/* Next Action */}
            {step.next_action && (
              <div>
                <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Next Action</h5>
                <p className="text-sm text-gray-800">{step.next_action}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface CollapsibleReasoningProps {
  reasoning: ReasoningSteps[]
}

const CollapsibleReasoning: React.FC<CollapsibleReasoningProps> = ({ reasoning }) => {
  return (
    <div className="space-y-2">
      {reasoning.map((step, index) => (
        <CollapsibleReasoningStep
          key={`${step.title}-${step.action}-${index}`}
          step={step}
          index={index}
        />
      ))}
    </div>
  )
}

export default CollapsibleReasoning 