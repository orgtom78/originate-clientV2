// /hooks/useOnboardingFlow.ts
import { useState, useCallback } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { saveProgress } from '../app/api/register'

interface FormData {
  loanDetails: Record<string, string>
  loanType: Record<string, string>
  loanApplicant: Record<string, string>
}

export const useRegisterFlow = () => {
  const [flowId] = useState(() => uuidv4()) // Generate UUID once when hook is initialized
  const [activeStep, setActiveStep] = useState(0)
  const [id] = useState(() => uuidv4())

  const initialFormData: FormData = {
    loanDetails: {},
    loanType: {},
    loanApplicant: {}
  }

  const [formData, setFormData] = useState<FormData>(initialFormData)

  const handleNext = useCallback(() => setActiveStep(prev => prev + 1), [])
  const handlePrev = useCallback(() => setActiveStep(prev => Math.max(prev - 1, 0)), [])

  const updateFormData = useCallback(
    async (stepKey: keyof FormData, data: Record<string, string>) => {
      // Update local state
      setFormData(prev => ({
        ...prev,
        [stepKey]: { ...prev[stepKey], ...data }
      }))

      // Make API call to save progress
      try {
        await saveProgress(id, flowId, stepKey, data)
      } catch (error) {
        console.error('Failed to save progress:', error)

        // Handle error appropriately
      }
    },
    [flowId, id]
  )

  return {
    flowId,
    activeStep,
    formData,
    handleNext,
    handlePrev,
    updateFormData
  }
}
