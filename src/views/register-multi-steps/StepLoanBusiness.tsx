// src/views/register-multi-steps/StepLoanBusiness.tsx
import React, { useEffect } from 'react'

import { Grid, Button, TextField, Typography, InputAdornment } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, string, email, pipe, nonEmpty } from 'valibot'

import DirectionalIcon from '@components/DirectionalIcon'

// Properly typed props interface
export interface StepProps {
  onboardingId: string
  handlePrev?: () => void
  handleNext: () => void
  formData: Record<string, string>
  loanDetails?: Record<string, string>
  loanType?: Record<string, string>
  allFormData?: Record<string, Record<string, string>>
  updateFormData: (data: Record<string, string>) => Promise<void>
  onSubmit?: (formData: Record<string, string>) => Promise<void>
}

// Form validation schema
const schema = object({
  legalperson_name: pipe(string(), nonEmpty('Company Name is required')),
  legalperson_address: pipe(string(), nonEmpty('Address is required')),
  legalperson_contact_email: pipe(string(), nonEmpty('Email is required'), email('Please enter a valid email address')),
  legalperson_contact_phone: pipe(string())
})

type FormData = {
  legalperson_name: string
  legalperson_address: string
  legalperson_contact_email: string
  legalperson_contact_phone: string
}

const StepLoanBusiness = ({ handlePrev, handleNext, formData, updateFormData, onSubmit }: StepProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: formData
  })

  // Prepopulate form fields with existing data when they change
  useEffect(() => {
    reset(formData)
  }, [formData, reset])

  // Single submission handler
  const onFormSubmit = async (data: FormData) => {
    if (isSubmitting) return

    // Convert to Record<string, string>
    const submissionData = {
      legalperson_name: data.legalperson_name,
      legalperson_address: data.legalperson_address,
      legalperson_contact_email: data.legalperson_contact_email,
      legalperson_contact_phone: data.legalperson_contact_phone || ''
    }

    // Either call onSubmit or updateFormData, not both
    if (onSubmit) {
      await onSubmit(submissionData)
    } else {
      await updateFormData(submissionData)
    }

    handleNext()
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
      <div className='mbe-5'>
        <Typography variant='h4' className='mbe-1'>
          Account Information
        </Typography>
        <Typography>Enter Your Account Details</Typography>
      </div>

      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <Controller
            name='legalperson_contact_email'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Email'
                placeholder='johndoe@gmail.com'
                error={!!errors.legalperson_contact_email}
                helperText={errors.legalperson_contact_email?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name='legalperson_name'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Company Name'
                placeholder='John Doe LLC'
                error={!!errors.legalperson_name}
                helperText={errors.legalperson_name?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name='legalperson_address'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Address'
                placeholder='123 Main St, New York'
                error={!!errors.legalperson_address}
                helperText={errors.legalperson_address?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name='legalperson_contact_phone'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='tel'
                label='Mobile'
                placeholder='123-456-7890'
                error={!!errors.legalperson_contact_phone}
                helperText={errors.legalperson_contact_phone?.message}
                InputProps={{
                  startAdornment: <InputAdornment position='start'>US (+1)</InputAdornment>
                }}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} className='flex justify-between'>
          <Button
            variant='outlined'
            color='secondary'
            onClick={handlePrev}
            startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
            disabled={isSubmitting}
          >
            Previous
          </Button>

          <Button
            type='submit'
            variant='contained'
            color='primary'
            endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default StepLoanBusiness
