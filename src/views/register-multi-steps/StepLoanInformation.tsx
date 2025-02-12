import React, { useEffect } from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, pipe, nonEmpty } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import LinearProgress from '@mui/material/LinearProgress'

// Import AWS Amplify data client
import { generateClient } from 'aws-amplify/data'

import DirectionalIcon from '@components/DirectionalIcon'

import { type Schema } from '../../../amplify/data/resource'

const client = generateClient<Schema>()

type FormData = InferInput<typeof schema>

const schema = object({
  loanamount: pipe(string(), nonEmpty('Amount is required'), minLength(6, 'Amount must be at least 100,000'))
})

type StepProps = {
  flowId: string
  handleNext: () => void
  formData: Record<string, string>
  updateFormData: (data: Record<string, string>) => void
}

const StepLoanInformation = ({ flowId, handleNext, formData, updateFormData }: StepProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormData>({
    resolver: valibotResolver(schema)
  })

  console.log(flowId)

  // Prepopulate form fields with existing data
  useEffect(() => {
    Object.entries(formData).forEach(([key, value]) => {
      setValue(key as keyof FormData, value || '')
    })
  }, [formData, setValue])

  const checkUserExists = async (email: string): Promise<string | null> => {
    try {
      const { data: users } = await client.models.Usergroup.list({
        filter: { email: { eq: email } }
      })

      return users.length > 0 ? users[0].id : null
    } catch (error) {
      console.error('Error checking user existence:', error)

      return null
    }
  }

  const updateorcreateUserInDB = async (data: FormData): Promise<void> => {
    try {
      const userExists = await checkUserExists(data.loanamount)

      if (userExists) {
        const updates = {
          loanamount: data.loanamount
        }

        const { errors } = await client.models.Usergroup.update({
          id: userExists,
          ...updates
        })

        if (errors) console.error('Error updating user:', errors)
      } else {
        console.log('User does not exist.')
      }
    } catch (error) {
      console.error('Failed to update user in database:', error)
    }
  }

  const onSubmit: SubmitHandler<FormData> = async data => {
    console.log('Validated Data:', data)
    updateFormData(data)
    await updateorcreateUserInDB(data) // Assuming updateUserInDB exists
    handleNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mbe-5'>
        <Typography variant='h4' className='mbe-1'>
          How much are you looking to borrow?
        </Typography>
        <Typography>Maximum desired amount for your working capital needs.</Typography>
      </div>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={12}>
          <Controller
            name='loanamount'
            control={control}
            defaultValue={formData.Mobile || ''}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='number'
                label='Loan Amount'
                placeholder='500,000'
                error={!!errors.loanamount}
                helperText={errors.loanamount?.message}
                InputProps={{
                  startAdornment: <InputAdornment position='start'>US $</InputAdornment>
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <LinearProgress variant='determinate' value={40} />
        </Grid>
        <Grid item xs={12} className='flex justify-end'>
          <Button
            type='submit'
            variant='contained'
            endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default StepLoanInformation
