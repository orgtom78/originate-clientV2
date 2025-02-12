import React, { useState, useEffect } from 'react'

import { Grid, Button, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, array, string } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import classnames from 'classnames'

import LinearProgress from '@mui/material/LinearProgress'

import type { CustomInputVerticalData } from '@core/components/custom-inputs/types'
import CustomInputVertical from '@core/components/custom-inputs/Vertical'
import DirectionalIcon from '@components/DirectionalIcon'

const loanTypeData: CustomInputVerticalData[] = [
  {
    value: 'importfinance',
    title: 'Import Finance',
    isSelected: true,
    content:
      'Extend payment terms with your suppliers from abroad while making sure they get paid on day 1 through our bank',
    asset: 'ri-import-line'
  },
  {
    value: 'exportfinance',
    title: 'Export Finance',
    content:
      'Get paid on day 1 for all exports to your clients in Canada or Europe regardless of the payment terms negotiated with your clients',
    asset: 'ri-export-line'
  },
  {
    value: 'domesticfactoring',
    title: 'Domestic Factoring',
    content: 'Get paid early for all invoices that you issue to your clients in the USA',
    asset: 'ri-home-line'
  },
  {
    value: 'scf',
    title: 'Supply Chain Finance',
    content: 'A program that extends all your days payables outstanding for your entire supplier base',
    asset: 'ri-wallet-3-line'
  }
]

// Valibot schema
const schema = object({
  loanTypes: array(string())
})

type FormData = InferInput<typeof schema>

type StepProps = {
  flowId: string
  handleNext: () => void
  handlePrev: () => void
  formData: Record<string, string>
  loanDetails: Record<string, string>
  updateFormData: (data: Record<string, string>) => void
}

const StepLoanType = ({ flowId, handleNext, handlePrev, formData, loanDetails, updateFormData }: StepProps) => {
  const initialSelected = loanTypeData.filter(item => item.isSelected).map(item => item.value)
  const [selected, setSelected] = useState<string[]>(initialSelected)

  console.log(loanDetails, flowId)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      loanTypes: formData.loanTypes ? JSON.parse(formData.loanTypes) : initialSelected
    }
  })

  // Prepopulate form fields with existing data
  useEffect(() => {
    if (formData.loanTypes) {
      const parsedTypes = JSON.parse(formData.loanTypes)

      setSelected(parsedTypes)
      setValue('loanTypes', parsedTypes)
    }
  }, [formData, setValue])

  const handleChange = (value: string) => {
    const updatedSelected = selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value]

    setSelected(updatedSelected)
    setValue('loanTypes', updatedSelected)
  }

  const handlePrevious = () => {
    updateFormData({ ...formData, loanTypes: JSON.stringify(selected) })
    handlePrev()
  }

  const onSubmit: SubmitHandler<FormData> = async data => {
    console.log('Validated Data:', data)
    updateFormData({ ...formData, loanTypes: JSON.stringify(data.loanTypes) })
    handleNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mbe-5'>
        <Typography variant='h4'>What type of funding are you looking for?</Typography>
      </div>
      <Grid container spacing={5}>
        <Controller
          name='loanTypes'
          control={control}
          render={() => (
            <Grid container spacing={3}>
              {loanTypeData.map((item, index) => {
                const asset =
                  item.asset && typeof item.asset === 'string' ? (
                    <i className={classnames(item.asset, 'text-[28px]')} />
                  ) : null

                return (
                  <CustomInputVertical
                    type='checkbox'
                    key={index}
                    selected={selected}
                    data={{ ...item, asset }}
                    handleChange={handleChange}
                    name='custom-checkbox-icons'
                    gridProps={{ xs: 12, sm: 6 }}
                  />
                )
              })}
            </Grid>
          )}
        />

        <Typography variant='body1' color={errors.loanTypes ? 'error' : 'textPrimary'}>
          {errors.loanTypes?.message || 'Please select all that apply.'}
        </Typography>

        <Grid item xs={12} sm={12}>
          <LinearProgress variant='determinate' value={80} />
        </Grid>

        <Grid item xs={12} className='flex justify-between'>
          <Button
            variant='outlined'
            onClick={handlePrevious}
            startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
          >
            Previous
          </Button>
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

export default StepLoanType
