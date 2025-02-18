import { useState, useCallback, useEffect } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { saveProgress, getProgress, submitRegistration } from '../app/api/register'

import type { OnboardingData } from '../app/api/register'

interface FormData {
  loanDetails: FormDataRecord
  loanType: FormDataRecord
  loanApplicant: FormDataRecord
}

type FormDataRecord = Record<string, string>
interface OnboardingFlowState {
  flowId: string
  id: string
  activeStep: number
  formData: FormData
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}
interface OnboardingFlowState {
  flowId: string
  id: string
  activeStep: number
  formData: FormData
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

const INITIAL_FORM_DATA: FormData = {
  loanDetails: {},
  loanType: {},
  loanApplicant: {}
}

export const useOnboardingFlow = (initialStep = 0) => {
  const [state, setState] = useState<OnboardingFlowState>(() => ({
    flowId: uuidv4(),
    id: uuidv4(),
    activeStep: initialStep,
    formData: INITIAL_FORM_DATA,
    isLoading: true,
    error: null,
    isInitialized: false
  }))

  const mapFormDataToApi = useCallback(
    (stepKey: keyof FormData, data: FormDataRecord): Partial<OnboardingData> => {
      const baseData = {
        id: state.id,
        legalpersonId: state.flowId
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
    [state.id, state.flowId]
  )

  // Load existing progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await getProgress(state.id)

        if (progress) {
          setState(prev => ({
            ...prev,
            formData: {
              loanDetails: {
                ...prev.formData.loanDetails,
                loanamount: progress.loan_amount || ''
              },
              loanType: {
                ...prev.formData.loanType,
                type: progress.loan_type || '',
                purpose: progress.loan_purpose || ''
              },
              loanApplicant: {
                ...prev.formData.loanApplicant,
                name: progress.legalperson_name || '',
                email: progress.legalperson_contact_email || ''
              }
            },
            isInitialized: true,
            isLoading: false
          }))
        } else {
          setState(prev => ({
            ...prev,
            isInitialized: true,
            isLoading: false
          }))
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to load progress',
          isLoading: false,
          isInitialized: true
        }))
      }
    }

    if (!state.isInitialized) {
      loadProgress()
    }
  }, [state.id, state.isInitialized])

  const handleNext = useCallback(() => {
    setState(prev => ({
      ...prev,
      activeStep: prev.activeStep + 1
    }))
  }, [])

  const handlePrev = useCallback(() => {
    setState(prev => ({
      ...prev,
      activeStep: Math.max(prev.activeStep - 1, 0)
    }))
  }, [])

  const updateFormData = useCallback(
    async (stepKey: keyof FormData, data: FormDataRecord) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }))

      try {
        // Update local state immediately for better UX
        const updatedFormData = {
          ...state.formData,
          [stepKey]: { ...state.formData[stepKey], ...data }
        }

        const apiData = mapFormDataToApi(stepKey, data)

        if (state.isInitialized) {
          // Update existing record
          await submitRegistration(state.id, {
            userId: state.flowId,
            ...apiData
          })
        } else {
          // Create new record
          await saveProgress(state.id, state.flowId, stepKey, data)
        }

        setState(prev => ({
          ...prev,
          formData: updatedFormData,
          isLoading: false
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to save progress',
          isLoading: false,

          // Revert form data on error
          formData: {
            ...prev.formData,
            [stepKey]: { ...prev.formData[stepKey] }
          }
        }))
      }
    },
    [state.flowId, state.id, state.formData, state.isInitialized, mapFormDataToApi]
  )

  const resetError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }))
  }, [])

  return {
    flowId: state.flowId,
    id: state.id,
    activeStep: state.activeStep,
    formData: state.formData,
    isLoading: state.isLoading,
    error: state.error,
    isInitialized: state.isInitialized,
    handleNext,
    handlePrev,
    updateFormData,
    resetError
  }
}
