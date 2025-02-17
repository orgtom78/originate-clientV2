'use client'

import Link from 'next/link'

import { useParams } from 'next/navigation'

import MuiStepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// Custom Components
import { useRegisterFlow } from '../../hooks/useOnboardingFlow'

import StepperCustomDot from '@components/stepper-dot'

import Logo from '@components/layout/shared/Logo'

import StepperWrapper from '@core/styles/stepper'

import StepLoanInformation from './StepLoanInformation'

import StepLoanType from './StepLoanType'

import StepLoanApplicant from './StepLoanApplicant'

const steps = [
  { title: 'Amount', subtitle: 'Loan Details' },
  { title: 'Type', subtitle: 'Loan Type' },
  { title: 'Applicant', subtitle: 'Loan Applicant' }
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
  const { flowId, activeStep, formData, handleNext, handlePrev, updateFormData } = useRegisterFlow()
  const { tag } = useParams()

  console.log(tag)

  const stepComponents = [
    <StepLoanInformation
      key='amount'
      flowId={flowId}
      handleNext={handleNext}
      formData={formData.loanDetails}
      updateFormData={data => updateFormData('loanDetails', data)}
    />,
    <StepLoanType
      key='type'
      flowId={flowId}
      handleNext={handleNext}
      handlePrev={handlePrev}
      formData={formData.loanType}
      loanDetails={formData.loanDetails}
      updateFormData={data => updateFormData('loanType', data)}
    />,
    <StepLoanApplicant
      key='applicant'
      flowId={flowId}
      handlePrev={handlePrev}
      formData={formData.loanApplicant}
      updateFormData={data => updateFormData('loanApplicant', data)}
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
