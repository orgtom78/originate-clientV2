import { useState, useCallback } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { saveProgress, submitRegistration } from '../app/api/register'
import type { OnboardingData } from '../app/api/register'

type FormDataRecord = Record<string, string>

interface FormData {
  loanDetails: FormDataRecord
  loanType: FormDataRecord
  loanApplicant: FormDataRecord
}

export const useOnboardingFlow = () => {
  const [flowId] = useState(() => uuidv4()) // Generate UUID once when hook is initialized
  const [activeStep, setActiveStep] = useState(0)

  const initialFormData: FormData = {
    loanDetails: {},
    loanType: {},
    loanApplicant: {}
  }

  const [formData, setFormData] = useState<FormData>(initialFormData)

  const handleNext = useCallback(() => setActiveStep(prev => prev + 1), [])
  const handlePrev = useCallback(() => setActiveStep(prev => Math.max(prev - 1, 0)), [])

  const mapFormDataToApi = useCallback(
    (stepKey: keyof FormData, data: FormDataRecord): Partial<OnboardingData> => {
      const baseData = {
        id: flowId,
        legalpersonId: data.flowId
      }

      switch (stepKey) {
        case 'loanDetails':
          return {
            ...baseData,
            loan_amount: data.loanamount || ''
          }
        case 'loanType':
          return {
            ...baseData,
            loan_type: data.type || '',
            loan_purpose: data.purpose || ''
          }
        case 'loanApplicant':
          return {
            ...baseData,
            legalperson_name: data.name || '',
            legalperson_contact_email: data.email || '',
            legalperson_contact_phone: data.phone || ''
          }
        default:
          return baseData
      }
    },
    [flowId]
  )

  const updateFormData = useCallback(
    async (stepKey: keyof FormData, data: Record<string, string>) => {
      // Update local state
      setFormData(prev => ({
        ...prev,
        [stepKey]: { ...prev[stepKey], ...data }
      }))

      const apiData = mapFormDataToApi(stepKey, data)

      try {
        if (activeStep !== 0) {
          // Update existing record
          await submitRegistration(apiData.id || '', {
            ...apiData
          })
        } else {
          // Create new record
          await saveProgress(apiData.id || '', apiData.id || '', stepKey, data)
        }
      } catch (error) {
        console.error('Failed to save progress:', error)

        // Handle error appropriately
      }
    },
    [mapFormDataToApi, activeStep]
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
