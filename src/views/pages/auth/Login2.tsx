'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { type SignInOutput, confirmSignIn, signIn } from '@aws-amplify/auth'
import { Controller, useForm } from 'react-hook-form'
import { object, string, email, pipe } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { OTPInput } from 'input-otp'
import type { InferInput } from 'valibot'

import { Amplify } from 'aws-amplify'

import type { Mode } from '@core/types'

console.log(Amplify.getConfig())

type FormData = InferInput<typeof schema>

const schema = object({
  email: pipe(string(), email('Please enter a valid email address'))
})

const PasswordlessLogin = ({ mode }: { mode: Mode }) => {
  console.log(mode)
  const [authStep, setAuthStep] = useState<'EMAIL' | 'OTP'>('EMAIL')
  const [signInData, setSignInData] = useState<SignInOutput | null>(null)
  const [otp, setOtp] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { control, handleSubmit, getValues } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: ''
    }
  })

  const handleEmailSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await signIn({
        username: data.email,
        options: {
          authFlowType: 'USER_AUTH',
          preferredChallenge: 'EMAIL_OTP'
        }
      })

      await handleSignInResult(result)
    } catch (err) {
      console.error('Email submission failed:', err)
      setError('Failed to send verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignInResult = async (result: SignInOutput) => {
    console.log(result)

    switch (result.nextStep.signInStep) {
      case 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE': {
        const { codeDeliveryDetails } = result.nextStep

        console.log(`A confirmation code has been sent to ${codeDeliveryDetails?.destination}`)
        break
      }
    }

    setSignInData(result)
    setAuthStep('OTP')
  }

  const handleResendCode = async () => {
    const email = getValues('email')

    if (email) {
      await handleEmailSubmit({ email })
    }
  }

  const handleOTPSubmit = async () => {
    if (!signInData || otp.length !== 8) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await confirmSignIn({
        challengeResponse: otp
      })

      console.log(response)

      if (response) {
        console.log(response)
      }

      router.push('/about')
    } catch (err) {
      console.error('OTP verification failed:', err)
      setError('Invalid verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (authStep === 'OTP') {
    return (
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col gap-1'>
          <Typography variant='h4'>Enter Verification Code 💬</Typography>
          <Typography>We sent a verification code to your email. Please enter it below.</Typography>
        </div>

        {error && (
          <Alert severity='error' onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className='flex flex-col gap-5'>
          <div className='flex flex-col gap-2'>
            <Typography>Type your 8 digit security code</Typography>
            <OTPInput
              value={otp}
              onChange={setOtp}
              maxLength={8}
              containerClassName='group flex items-center'
              render={({ slots }) => (
                <div className='flex items-center justify-between w-full gap-4'>
                  {slots.map((slot, idx) => (
                    <div key={idx} className='w-12 h-12 border rounded flex items-center justify-center'>
                      {slot.char || ''}
                    </div>
                  ))}
                </div>
              )}
            />
          </div>

          <Button fullWidth variant='contained' onClick={handleOTPSubmit} disabled={isLoading || otp.length !== 8}>
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>

          <div className='flex justify-center items-center gap-2'>
            <Typography>Did not get the code?</Typography>
            <Button variant='text' onClick={handleResendCode} disabled={isLoading}>
              Resend
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <Typography variant='h4'>Welcome! 👋🏻</Typography>
        <Typography>Please enter your email to sign in</Typography>
      </div>

      {error && (
        <Alert severity='error' onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleEmailSubmit)} className='flex flex-col gap-5'>
        <Controller
          name='email'
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              autoFocus
              type='email'
              label='Email'
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isLoading}
            />
          )}
        />

        <Button fullWidth variant='contained' type='submit' disabled={isLoading}>
          {isLoading ? 'Sending Code...' : 'Send Verification Code'}
        </Button>
      </form>
    </div>
  )
}

export default PasswordlessLogin
