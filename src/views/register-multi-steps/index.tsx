'use client'

import React, { useState } from 'react'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// Custom Components
import { useOnboardingFlow } from '../../hooks/useOnboardingFlow'
import Logo from '@components/layout/shared/Logo'
import StepperWrapper from '@core/styles/stepper'
import StepLoanInformation from './StepLoanInformation'
import StepLoanType from './StepLoanType'
import StepLoanApplicant from './StepLoanApplicant'

const steps = [
  { title: 'Amount', subtitle: 'Loan Details' },
  { title: 'Type', subtitle: 'Loan Type' },
  { title: 'Applicant', subtitle: 'Loan Applicant' },
  { title: 'Additional', subtitle: 'Optional Details', optional: true }
]

interface SuccessMessageProps {
  onboardingId: string
  onContinue: () => void
}

const SuccessMessage = ({ onboardingId, onContinue }: SuccessMessageProps) => (
  <div className='space-y-6 p-6'>
    {/* Success Alert */}
    <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
      <div className='flex items-start'>
        <div className='flex-shrink-0'>
          <span className='text-green-600 text-xl'>✓</span>
        </div>
        <div className='ml-3'>
          <h3 className='text-lg font-semibold text-green-800'>Application Submitted Successfully!</h3>
          <p className='mt-2 text-sm text-green-700'>
            Your application has been received. You will receive an email with further instructions.
          </p>
        </div>
      </div>
    </div>

    {/* Application Details */}
    <div className='space-y-2 bg-gray-50 p-4 rounded-lg'>
      <p className='text-gray-600'>
        Application ID: <span className='font-mono'>{onboardingId}</span>
      </p>
      <p className='text-sm text-gray-500'>
        Please save this ID for your reference. A confirmation email will be sent shortly.
      </p>
    </div>

    {/* Action Buttons */}
    <div className='flex justify-between items-center pt-4'>
      <button
        onClick={() => (window.location.href = '/')}
        className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2'
      >
        <span className='text-sm'>←</span>
        Return Home
      </button>

      <button
        onClick={onContinue}
        className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2'
      >
        Continue with Additional Info
        <span className='text-sm'>→</span>
      </button>
    </div>
  </div>
)

// Update the type definition for StepLoanApplicant props
export interface StepProps {
  onboardingId: string
  handlePrev?: () => void
  formData: Record<string, string>
  updateFormData: (data: Record<string, string>) => Promise<void>
  onSubmit?: () => Promise<void>
}

const RegisterMultiSteps = () => {
  const searchParams = useSearchParams()
  const onboardingIdFromUrl = searchParams.get('onboardingId') || undefined
  const [showSuccess, setShowSuccess] = useState(false)

  const { onboardingId, activeStep, formData, loading, error, handleNext, handlePrev, updateFormData } =
    useOnboardingFlow(onboardingIdFromUrl)

  // Show loading state while fetching existing data
  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent' />
      </div>
    )
  }

  // Show error state if data fetch failed
  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-red-600 mb-2'>Error Loading Form</h2>
          <p className='text-gray-600'>{error.message}</p>
          <Link href='/register' className='mt-4 text-blue-600 hover:underline'>
            Start New Application
          </Link>
        </div>
      </div>
    )
  }

  const handleStepThreeComplete = async () => {
    setShowSuccess(true)
  }

  const handleContinue = () => {
    setShowSuccess(false)
    handleNext()
  }

  const stepComponents = [
    <StepLoanInformation
      key='amount'
      onboardingId={onboardingId}
      handleNext={handleNext}
      formData={formData.loanDetails}
      updateFormData={data => updateFormData('loanDetails', data)}
    />,
    <StepLoanType
      key='type'
      onboardingId={onboardingId}
      handleNext={handleNext}
      handlePrev={handlePrev}
      formData={formData.loanType}
      loanDetails={formData.loanDetails}
      updateFormData={data => updateFormData('loanType', data)}
    />,
    <StepLoanApplicant
      key='applicant'
      onboardingId={onboardingId}
      handlePrev={handlePrev}
      formData={formData.loanApplicant}
      updateFormData={data => updateFormData('loanApplicant', data)}
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
            <SuccessMessage onboardingId={onboardingId} onContinue={handleContinue} />
          ) : (
            <>
              <div className='mb-6 md:mb-12'>
                <div className='flex justify-between items-center'>
                  {steps.map((step, index) => (
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
                  ))}
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
