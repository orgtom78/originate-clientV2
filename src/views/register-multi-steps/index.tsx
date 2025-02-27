'use client'

import React, { useState, useEffect, useRef } from 'react'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { useOnboardingFlow } from '../../hooks/useOnboardingFlow'
import Logo from '@components/layout/shared/Logo'
import StepperWrapper from '@core/styles/stepper'
import StepLoanInformation from './StepLoanInformation'
import StepLoanType from './StepLoanType'
import StepLoanApplicant from './StepLoanApplicant'
import StepLoanFinancials from './StepLoanFinancials'
import StepLoanBusiness from './StepLoanBusiness'
import StepLoanDocuments from './StepLoanDocuments'
import SuccessMessage from './SuccessMessage'

const steps = [
  { title: 'Amount', subtitle: 'Loan Details' },
  { title: 'Type', subtitle: 'Loan Type' },
  { title: 'Applicant', subtitle: 'Loan Applicant' },
  { title: 'Business', subtitle: 'Business Details', optional: true },
  { title: 'Financials', subtitle: 'Financial Details', optional: true },
  { title: 'Documents', subtitle: 'Documents', optional: true },
  { title: 'Additional', subtitle: 'Optional Details', optional: true }
]

const RegisterMultiSteps = () => {
  const searchParams = useSearchParams()
  const onboardingIdFromUrl = searchParams.get('onboardingId') || searchParams.get('partnerId') || undefined
  const [showSuccess, setShowSuccess] = useState(false)
  const isProcessingSubmitRef = useRef(false)
  const [showAllSteps, setShowAllSteps] = useState(false)
  const initialLoadRef = useRef(true)

  const { onboardingId, activeStep, formData, loading, error, handleNext, handlePrev, updateFormData, resetError } =
    useOnboardingFlow(onboardingIdFromUrl)

  // Check if we need to show all steps based on loaded data
  // This effect runs when formData or activeStep changes
  useEffect(() => {
    if (!loading && initialLoadRef.current) {
      initialLoadRef.current = false

      // If we loaded data with an onboardingId and we're past step 3, or progress is completed
      if (onboardingIdFromUrl) {
        const progress = formData.loanApplicant?.loan_progress_step || ''

        // Show all steps if we're beyond step 3 or progress is marked as completed
        if (activeStep >= 3 || progress === 'completed') {
          setShowAllSteps(true)
        }
      }
    }
  }, [formData, activeStep, loading, onboardingIdFromUrl])

  // Show loading state
  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent' />
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-red-600 mb-2'>Error Loading Form</h2>
          <p className='text-gray-600'>{error.message}</p>
          <div className='mt-4 flex justify-center space-x-4'>
            <Link href='/register' className='text-blue-600 hover:underline'>
              Start New Application
            </Link>
            <button onClick={resetError} className='text-blue-600 hover:underline'>
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Check URL parameters for buyer flow
  const isBuyerFlow = searchParams.get('type') === 'buyer'

  // Create a combined object with all form data
  const allFormData = {
    loanDetails: formData.loanDetails || {},
    loanType: formData.loanType || {},
    loanApplicant: formData.loanApplicant || {},
    loanBusiness: formData.loanBusiness || {},
    loanFinancials: formData.loanFinancials || {},
    loanDocuments: formData.loanDocuments || {}
  }

  const handleStepThreeComplete = async (formData: Record<string, string>) => {
    // Prevent duplicate submissions
    if (isProcessingSubmitRef.current) return
    isProcessingSubmitRef.current = true

    try {
      // Merge form data with data from previous steps
      const completeData = {
        ...formData,
        loan_progress_step: 'loanApplicant',

        // Now TypeScript knows these properties exist
        loan_amount: allFormData.loanDetails.loan_amount,
        loan_type: allFormData.loanType.loan_type
      }

      // Submit complete data
      await updateFormData('loanApplicant', completeData)

      // Show success message
      setShowSuccess(true)
      setShowAllSteps(true)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setTimeout(() => {
        isProcessingSubmitRef.current = false
      }, 1000)
    }
  }

  // Handler for continuing to optional step
  const handleContinue = () => {
    setShowSuccess(false)
    handleNext()
  }

  // Step components with correct props
  const stepComponents = [
    <StepLoanInformation
      key='amount'
      onboardingId={onboardingId}
      handleNext={handleNext}
      formData={formData.loanDetails}
      updateFormData={data => updateFormData('loanDetails', data)}
      allFormData={allFormData}
    />,
    <StepLoanType
      key='type'
      onboardingId={onboardingId}
      handleNext={handleNext}
      handlePrev={handlePrev}
      formData={formData.loanType}
      loanDetails={formData.loanDetails}
      updateFormData={data => updateFormData('loanType', data)}
      allFormData={allFormData}
    />,
    <StepLoanApplicant
      key='applicant'
      onboardingId={onboardingId}
      handlePrev={handlePrev}
      formData={formData.loanApplicant}
      loanDetails={formData.loanDetails}
      loanType={formData.loanType}
      updateFormData={data => updateFormData('loanApplicant', data)}
      onSubmit={handleStepThreeComplete}
      allFormData={allFormData}
    />,
    <StepLoanBusiness
      key='business'
      onboardingId={onboardingId}
      handleNext={handleNext}
      handlePrev={handlePrev}
      formData={formData.loanBusiness || {}}
      updateFormData={data => updateFormData('loanBusiness', data)}
      allFormData={allFormData}
    />,
    <StepLoanFinancials
      key='financials'
      onboardingId={onboardingId}
      handlePrev={handlePrev}
      handleNext={handleNext}
      formData={formData.loanFinancials || {}}
      updateFormData={data => updateFormData('loanFinancials', data)}
      allFormData={allFormData}
    />,
    <StepLoanDocuments
      key='documents'
      onboardingId={onboardingId}
      handlePrev={handlePrev}
      formData={formData.loanDocuments || {}}
      updateFormData={data => updateFormData('loanDocuments', data)}
      allFormData={allFormData}
      onSubmit={handleStepThreeComplete}
    />
  ]

  return (
    <div className='flex bs-full justify-between items-center'>
      <div className='flex bs-full items-center justify-center is-[450px] max-lg:hidden'>
        <img src='/images/pages/register.jpg' alt='multi-steps-character' />
      </div>
      <div className='flex flex-1 justify-center items-center bs-full bg-backgroundPaper'>
        <Link href='/' className='absolute block-start-5 sm:block-start-[25px]'>
          <Logo />
        </Link>
        <StepperWrapper className='p-6 sm:p-8 max-is-[740px] mbs-11 sm:mbs-14 lg:mbs-0'>
          {showSuccess ? (
            <SuccessMessage onboardingId={onboardingId} onContinue={handleContinue} allFormData={allFormData} />
          ) : (
            <>
              <div className='mb-6 md:mb-12'>
                <div className='flex justify-between items-center'>
                  {/* 
                    Show all steps if:
                    1. showAllSteps is true (completed step 3)
                    2. activeStep >= 3 (we're on step 4+)
                    3. isBuyerFlow is true (partner/buyer flow)
                  */}
                  {(showAllSteps || activeStep >= 3 || isBuyerFlow ? steps : steps.slice(0, 4)).map((step, index) => {
                    return (
                      <div
                        key={index}
                        className={`flex flex-col items-center ${
                          index === activeStep ? 'text-blue-600' : 'text-gray-500'
                        }`}
                      >
                        <div className='relative'>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                            ${index === activeStep ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
                          >
                            {index + 1}
                          </div>
                        </div>
                        <div className='text-center mt-2'>
                          <div className='font-medium'>{step.title}</div>
                          <div className='text-sm'>{step.subtitle}</div>
                          {step.optional && <div className='text-xs text-gray-400'>(Optional)</div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {stepComponents[activeStep]}
            </>
          )}
        </StepperWrapper>
      </div>
    </div>
  )
}

export default RegisterMultiSteps
