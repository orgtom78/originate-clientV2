import { useState, useCallback, useEffect, useRef } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { saveProgress, submitRegistration, getOnboardingData } from '../app/api/register'
import type { OnboardingData } from '../app/api/register'

// Define types for form data with a unique name to avoid conflicts
interface LoanDetailsFormData {
  loan_amount: string
  [key: string]: string
}

interface LoanTypeFormData {
  loan_type: string
  [key: string]: string
}

interface LoanApplicantFormData {
  legalperson_name: string
  legalperson_address: string
  legalperson_contact_email: string
  legalperson_contact_phone: string
  [key: string]: string
}

// Use a different name than FormData to avoid conflicts with the DOM FormData
interface OnboardingFormData {
  loanDetails: LoanDetailsFormData
  loanType: LoanTypeFormData
  loanApplicant: LoanApplicantFormData
}

// State interface
interface OnboardingStateData {
  loading: boolean
  error: Error | null
  data: OnboardingFormData
}

// Helper function for string arrays
const sanitizeStringArray = (value: unknown): string[] | null => {
  if (!value) return null

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item !== null)
  }

  if (typeof value === 'string') {
    try {
      // Try to parse JSON if the string looks like an array
      if (value.startsWith('[') && value.endsWith(']')) {
        return JSON.parse(value)
      }

      return [value]
    } catch {
      return [value]
    }
  }

  return null
}

export const useOnboardingFlow = (existingonboardingId?: string) => {
  const [onboardingId] = useState(() => existingonboardingId || uuidv4())
  const [activeStep, setActiveStep] = useState(0)
  const isSubmittingRef = useRef(false)
  const lastApiCallRef = useRef('')

  // Initialize state with typed default values
  const [state, setState] = useState<OnboardingStateData>({
    loading: !!existingonboardingId,
    error: null,
    data: {
      loanDetails: { loan_amount: '' },
      loanType: { loan_type: '' },
      loanApplicant: {
        legalperson_name: '',
        legalperson_address: '',
        legalperson_contact_email: '',
        legalperson_contact_phone: ''
      }
    }
  })

  // Transform API data to form data format
  const transformApiDataToFormData = useCallback((apiData: OnboardingData): OnboardingFormData => {
    return {
      loanDetails: {
        loan_amount: apiData.loan_amount || ''
      },
      loanType: {
        // Fix for toString() error - handle null/undefined properly
        loan_type: Array.isArray(apiData.loan_type)
          ? apiData.loan_type.join(', ')
          : apiData.loan_type
            ? String(apiData.loan_type)
            : ''
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
    console.log('Current progress step from API:', progress_step) // Add logging

    switch (progress_step) {
      case 'loanDetails':
        return 0
      case 'loanType':
        return 1
      case 'loanApplicant':
        return 2
      case 'completed':
        return 3 // Handle completed case if you want to show success screen
      default:
        console.log('Unknown progress step, defaulting to 0:', progress_step)

        return 0
    }
  }

  // Fetch existing data if onboardingId is provided
  useEffect(() => {
    if (existingonboardingId) {
      let isMounted = true

      const fetchData = async () => {
        try {
          const result = await getOnboardingData(existingonboardingId)

          if (result && isMounted) {
            console.log('API result:', JSON.stringify(result, null, 2))
            const newStep = getStepIndex(result.loan_progress_step)

            console.log('Setting active step to:', newStep)

            // Set active step first
            setActiveStep(newStep)

            // Then update state with transformed data
            const transformedData = transformApiDataToFormData(result)

            console.log('Transformed data:', JSON.stringify(transformedData, null, 2))

            setActiveStep(newStep + 1)
            setState(prev => ({
              ...prev,
              loading: false,
              data: transformApiDataToFormData(result)
            }))
          }
        } catch (error) {
          if (isMounted) {
            setState(prev => ({
              ...prev,
              loading: false,
              error: error as Error
            }))
          }
        }
      }

      fetchData()

      return () => {
        isMounted = false
      }
    }
  }, [existingonboardingId, transformApiDataToFormData])

  // Update form data and handle API calls
  const updateFormData = useCallback(
    async (stepKey: keyof OnboardingFormData, data: Record<string, string>) => {
      // Prevent duplicate submissions
      if (isSubmittingRef.current) return

      // Create unique ID for this API call
      const apiCallId = Date.now().toString()

      lastApiCallRef.current = apiCallId
      isSubmittingRef.current = true

      try {
        // Update local state immediately for better UX
        setState(prev => ({
          ...prev,
          loading: true,
          error: null,
          data: {
            ...prev.data,
            [stepKey]: { ...prev.data[stepKey], ...data }
          }
        }))

        // Prepare API data directly (no mapFormDataToApi function)
        const apiData: Record<string, any> = {
          id: onboardingId,
          legalpersonId: onboardingId,
          ...data
        }

        // For loan applicant step, include data from previous steps
        if (stepKey === 'loanApplicant') {
          apiData.loan_amount = state.data.loanDetails.loan_amount || ''
          apiData.loan_type = sanitizeStringArray(state.data.loanType.loan_type)
          apiData.loan_progress_step = 'loanApplicant'

          await submitRegistration(onboardingId, stepKey, apiData)
        } else {
          // For intermediate steps, just save progress
          apiData.loan_progress_step = stepKey
          await saveProgress(onboardingId, stepKey, apiData)
        }

        // Only update state if this is still the current API call
        if (lastApiCallRef.current === apiCallId) {
          setState(prev => ({
            ...prev,
            loading: false
          }))
        }
      } catch (error) {
        console.error('Failed to save progress:', error)

        if (lastApiCallRef.current === apiCallId) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error as Error
          }))
        }
      } finally {
        // Reset submission flag after a delay
        setTimeout(() => {
          isSubmittingRef.current = false
        }, 500)
      }
    },
    [onboardingId, state.data]
  )

  // Navigation handlers
  const handleNext = useCallback(() => setActiveStep(prev => prev + 1), [])
  const handlePrev = useCallback(() => setActiveStep(prev => Math.max(prev - 1, 0)), [])
  const resetError = useCallback(() => setState(prev => ({ ...prev, error: null })), [])

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
