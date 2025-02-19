import { useState, useCallback, useEffect } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { saveProgress, submitRegistration, getOnboardingData } from '../app/api/register'
import type { OnboardingData } from '../app/api/register'

type FormDataRecord = Record<string, string>

interface FormData {
  loanDetails: FormDataRecord
  loanType: FormDataRecord
  loanApplicant: FormDataRecord
}

interface OnboardingState {
  loading: boolean
  error: Error | null
  data: FormData
}

const INITIAL_FORM_DATA: FormData = {
  loanDetails: {},
  loanType: {},
  loanApplicant: {}
}

// Helper to safely convert to string array
const sanitizeStringArray = (value: unknown): string[] | null => {
  if (!value) return null

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item !== null)
  }

  if (typeof value === 'string') {
    return [value]
  }

  return null
}

export const useOnboardingFlow = (existingonboardingId?: string) => {
  const [onboardingId] = useState(() => existingonboardingId || uuidv4())
  const [activeStep, setActiveStep] = useState(0)

  const [state, setState] = useState<OnboardingState>({
    loading: !!existingonboardingId,
    error: null,
    data: INITIAL_FORM_DATA
  })

  const transformApiDataToFormData = useCallback((apiData: OnboardingData): FormData => {
    return {
      loanDetails: {
        loan_amount: apiData.loan_amount || ''
      },
      loanType: {
        loan_type: sanitizeStringArray(apiData.loan_type)?.join(', ') || ''
      },
      loanApplicant: {
        legalperson_name: apiData.legalperson_name || '',
        legalperson_address: apiData.legalperson_address || '',
        legalperson_contact_email: apiData.legalperson_contact_email || '',
        legalperson_contact_phone: apiData.legalperson_contact_phone || ''
      }
    }
  }, [])

  const getStepIndex = (progress_step?: string | null): number => {
    switch (progress_step) {
      case 'loanDetails':
        return 0
      case 'loanType':
        return 1
      case 'loanApplicant':
        return 2
      default:
        return 0
    }
  }

  // Fetch existing data if onboardingId is provided
  useEffect(() => {
    if (existingonboardingId) {
      const fetchData = async () => {
        try {
          const result = await getOnboardingData(existingonboardingId)

          if (result) {
            const newStep = getStepIndex(result.loan_progress_step)

            setActiveStep(newStep)
            setState(prev => ({
              ...prev,
              loading: false,
              data: transformApiDataToFormData(result)
            }))
          }
        } catch (error) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error as Error
          }))
        }
      }

      fetchData()
    }
  }, [existingonboardingId, transformApiDataToFormData])

  const mapFormDataToApi = useCallback(
    (stepKey: keyof FormData, data: FormDataRecord): Partial<OnboardingData> => {
      const baseData = {
        id: onboardingId,
        legalpersonId: data.onboardingId
      }

      switch (stepKey) {
        case 'loanDetails':
          return {
            ...baseData,
            loan_amount: data.loan_amount || ''
          }
        case 'loanType':
          return {
            ...baseData,
            loan_type: sanitizeStringArray(data.loan_type)
          }
        case 'loanApplicant':
          return {
            ...baseData,
            legalperson_name: data.legalperson_name || '',
            legalperson_contact_email: data.legalperson_contact_email || '',
            legalperson_contact_phone: data.legalperson_contact_phone || '',
            legalperson_address: data.legalperson_address || ''
          }
        default:
          return baseData
      }
    },
    [onboardingId]
  )

  const handleNext = useCallback(() => setActiveStep(prev => prev + 1), [])

  const handlePrev = useCallback(() => setActiveStep(prev => Math.max(prev - 1, 0)), [])

  const updateFormData = useCallback(
    async (stepKey: keyof FormData, data: Record<string, string>) => {
      try {
        setState(prev => ({
          ...prev,
          loading: true,
          error: null
        }))

        // Update local state immediately for better UX
        setState(prev => ({
          ...prev,
          data: {
            ...prev.data,
            [stepKey]: { ...prev.data[stepKey], ...data }
          }
        }))

        const apiData = mapFormDataToApi(stepKey, data)

        if (activeStep !== 0) {
          await submitRegistration(apiData.id || '', stepKey, apiData)
        } else {
          await saveProgress(apiData.id || '', stepKey, apiData)
        }

        setState(prev => ({
          ...prev,
          loading: false
        }))
      } catch (error) {
        console.error('Failed to save progress:', error)
        setState(prev => ({
          ...prev,
          loading: false,
          error: error as Error
        }))
      }
    },
    [mapFormDataToApi, activeStep]
  )

  const resetError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }))
  }, [])

  return {
    onboardingId,
    activeStep,
    formData: state.data,
    loading: state.loading,
    error: state.error,
    handleNext,
    handlePrev,
    updateFormData,
    resetError
  }
}
