import React, { useEffect } from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, email, pipe, nonEmpty } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'

import type { InferInput } from 'valibot'

import DirectionalIcon from '@components/DirectionalIcon'

// Import the StepProps interface
export interface StepProps {
  onboardingId: string
  handlePrev?: () => void
  formData: Record<string, string>
  updateFormData: (data: Record<string, string>) => Promise<void>
  onSubmit?: () => Promise<void>
}

type FormData = InferInput<typeof schema>

const schema = object({
  legalperson_name: pipe(string(), nonEmpty('Company Name is required')),
  legalperson_address: pipe(string(), nonEmpty('Address is required')),
  legalperson_contact_email: pipe(string(), nonEmpty('Email is required'), email('Please enter a valid email address')),
  legalperson_contact_phone: pipe(string())
})

const StepLoanApplicant = ({ onboardingId, handlePrev, formData, updateFormData, onSubmit }: StepProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormData>({
    resolver: valibotResolver(schema)
  })

  console.log(onboardingId)

  // Prepopulate form fields with existing data
  useEffect(() => {
    Object.entries(formData).forEach(([key, value]) => {
      setValue(key as keyof FormData, value || '')
    })
  }, [formData, setValue])

  const onFormSubmit: SubmitHandler<FormData> = async data => {
    await updateFormData(data)

    // Call onSubmit prop if provided
    if (onSubmit) {
      await onSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
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
            defaultValue={formData.legalperson_contact_email || ''}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Email'
                placeholder='johndoe@gmail.com'
                error={!!errors.legalperson_contact_email}
                helperText={errors.legalperson_contact_email?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='legalperson_name'
            control={control}
            defaultValue={formData.legalperson_name || ''}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Company Name'
                placeholder='John Doe LLC'
                error={!!errors.legalperson_name}
                helperText={errors.legalperson_name?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='legalperson_address'
            control={control}
            defaultValue={formData.legalperson_address || ''}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Address'
                placeholder='123 Main St, New York'
                error={!!errors.legalperson_address}
                helperText={errors.legalperson_address?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='legalperson_contact_phone'
            control={control}
            defaultValue={formData.legalperson_contact_phone || ''}
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
          >
            Previous
          </Button>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default StepLoanApplicant
