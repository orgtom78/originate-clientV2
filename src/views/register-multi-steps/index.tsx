'use client'

import React, { useState, useCallback } from 'react'

import Link from 'next/link'

import MuiStepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// Custom Components
import StepperCustomDot from '@components/stepper-dot'

import Logo from '@components/layout/shared/Logo'

import StepperWrapper from '@core/styles/stepper'

import StepAccountDetails from './StepAccountDetails'

import StepPersonalInfo from './StepPersonalInfo'

import StepBillingDetails from './StepBillingDetails'


// Define types for form data
interface FormData {
  accountDetails: Record<string, string>
  personalInfo: Record<string, string>
  billingDetails: Record<string, string>
}

const steps = [
  { title: 'Account', subtitle: 'Account Details' },
  { title: 'Investor', subtitle: 'Investor Information' },
  { title: 'Subscription', subtitle: 'Purchase Agreement' }
]

const Stepper = styled(MuiStepper)(({ theme }) => ({
  justifyContent: 'center',
  '& .MuiStep-root': {
    '&:first-of-type': { paddingInlineStart: 0 },
    '&:last-of-type': { paddingInlineEnd: 0 },
    [theme.breakpoints.down('md')]: { paddingInline: 0 }
  }
}))

const RegisterMultiSteps = () => {
  const [activeStep, setActiveStep] = useState(0)

  const initialFormData: FormData = {
    accountDetails: {},
    personalInfo: {},
    billingDetails: {}
  }

  const [formData, setFormData] = useState<FormData>(initialFormData)

  const handleNext = useCallback(() => setActiveStep(prev => prev + 1), [])
  const handlePrev = useCallback(() => setActiveStep(prev => Math.max(prev - 1, 0)), [])

  const updateFormData = useCallback((stepKey: keyof FormData, data: Record<string, string>) => {
    setFormData(prev => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], ...data }
    }))
  }, [])

  const stepComponents = [
    <StepAccountDetails
      key='account'
      handleNext={handleNext}
      formData={formData.accountDetails}
      updateFormData={data => updateFormData('accountDetails', data)}
    />,
    <StepPersonalInfo
      key='personal'
      handleNext={handleNext}
      handlePrev={handlePrev}
      formData={formData.personalInfo}
      accountDetails={formData.accountDetails}
      updateFormData={data => updateFormData('personalInfo', data)}
    />,
    <StepBillingDetails
      key='billing'
      handlePrev={handlePrev}
      formData={formData.billingDetails}
      updateFormData={data => updateFormData('billingDetails', data)}
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
          <Stepper className='mbe-6 md:mbe-12' activeStep={activeStep}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel StepIconComponent={StepperCustomDot}>
                  <div className='step-label'>
                    <Typography className='step-number'>{`0${index + 1}`}</Typography>
                    <div>
                      <Typography className='step-title'>{step.title}</Typography>
                      <Typography className='step-subtitle'>{step.subtitle}</Typography>
                    </div>
                  </div>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {stepComponents[activeStep]}
        </StepperWrapper>
      </div>
    </div>
  )
}

export default RegisterMultiSteps
