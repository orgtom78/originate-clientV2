import React, { useEffect, useState, useCallback } from 'react'

// Third-party Imports
import { Grid, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, pipe, string, nonEmpty } from 'valibot'
import type { SelectChangeEvent } from '@mui/material';

// Amplify Data Client Import
import { generateClient } from 'aws-amplify/data'

// Local Imports
import DirectionalIcon from '@components/DirectionalIcon'

// Amplify Data Type Import
import type { Schema } from '../../../amplify/data/resource'

const US_STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
  'Other'
]

const OECD_COUNTRIES = [
  'Australia',
  'Austria',
  'Belgium',
  'Canada',
  'Chile',
  'Colombia',
  'Czech Republic',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Iceland',
  'Ireland',
  'Israel',
  'Italy',
  'Japan',
  'Korea',
  'Latvia',
  'Lithuania',
  'Luxembourg',
  'Mexico',
  'Netherlands',
  'New Zealand',
  'Norway',
  'Poland',
  'Portugal',
  'Slovak Republic',
  'Slovenia',
  'Spain',
  'Sweden',
  'Switzerland',
  'Turkey',
  'United Kingdom',
  'United States'
]

const ACCOUNT_TYPES = ['Individual', 'Joint', 'Corporation', 'Trust', 'IRA']

const client = generateClient<Schema>()

const schema = object({
  accounttype: pipe(string(), nonEmpty('Account Type is required')),
  legalname1: pipe(string(), nonEmpty('Full Legal Name is required')),
  address1: pipe(string(), nonEmpty('Address is required')),
  city1: pipe(string(), nonEmpty('City is required')),
  zip1: pipe(string(), nonEmpty('Zip Code is required')),
  dob1: pipe(string(), nonEmpty('Date of Birth is required')),
  tin1: pipe(string(), nonEmpty('TIN or SSN is required')),
  state1: pipe(string(), nonEmpty('State is required')),
  country1: pipe(string(), nonEmpty('Country is required')),
  legalname2: pipe(string()),
  address2: pipe(string()),
  city2: pipe(string()),
  zip2: pipe(string()),
  dob2: pipe(string()),
  tin2: pipe(string()),
  state2: pipe(string()),
  country2: pipe(string())
})

type FormData = {
  [key: string]: string
}

type StepProps = {
  handleNext: () => void
  handlePrev: () => void
  formData: Record<string, string>
  accountDetails: Record<string, string>
  updateFormData: (data: Record<string, string>) => void
}

const StepAccountDetails = ({ handleNext, handlePrev, formData, accountDetails, updateFormData }: StepProps) => {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: formData,
    resolver: valibotResolver(schema)
  })

  const [accountType, setAccountType] = useState<string>(formData.accounttype || 'Individual')

  // Wrap `updateFormData` in `useCallback` to stabilize reference
  const stableUpdateFormData = useCallback(updateFormData, [])

  // Update formData when account type changes
  useEffect(() => {
    if (formData.accounttype !== accountType) {
      stableUpdateFormData({ accounttype: accountType })
    }
  }, [accountType, formData.accounttype, stableUpdateFormData])

  const handleAccountTypeChange = (event: SelectChangeEvent) => {
    setAccountType(event.target.value);
  };
  
  // Trigger updateFormData and go to the previous step
  const handlePrevious = () => {
    const currentFormData = getValues()

    updateFormData(currentFormData)

    handlePrev()
  }

  const renderTextField = (name: string, label: string, placeholder: string, type = 'text') => (
    <Grid item xs={12} sm={6} key={name}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label={label}
            placeholder={placeholder}
            type={type}
            error={!!errors[name]}
            helperText={errors[name]?.message}
          />
        )}
      />
    </Grid>
  )

  const renderSelectField = (name: string, label: string, options: string[]) => (
    <Grid item xs={12} sm={6} key={name}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select {...field} value={field.value || ''}>
              {options.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
    </Grid>
  )

  const renderPersonalInfoFields = () => (
    <>
      {[
        {
          name: 'legalname2',
          label: 'Full Legal Name',
          placeholder: 'John Doe'
        },
        { name: 'address2', label: 'Address', placeholder: '123 Main St' },
        { name: 'city2', label: 'City', placeholder: 'New York' },
        {
          name: 'zip2',
          label: 'Zip Code',
          placeholder: '10001',
          type: 'number'
        },
        { name: 'dob2', label: 'Date of Birth', placeholder: 'MM-DD-YYYY' },
        { name: 'tin2', label: 'TIN/SSN', placeholder: '123-45-6789' }
      ].map(({ name, label, placeholder, type }) => renderTextField(name, label, placeholder, type))}
      {renderSelectField('state2', 'State', US_STATES)}
      {renderSelectField('country2', 'Country', OECD_COUNTRIES)}
    </>
  )

  const checkUserExists = async (email: string): Promise<string | null> => {
    try {
      const { data: users } = await client.models.User.list({
        filter: { email: { eq: email } }
      })

      return users.length > 0 ? users[0].id : null
    } catch (error) {
      console.error('Error checking user existence:', error)

      return null
    }
  }

  const updateUserInDB = async (data: FormData): Promise<void> => {
    try {
      const userExists = await checkUserExists(accountDetails.email)

      if (userExists) {
        const updates = {
          accounttype: data.accounttype,
          legalname: JSON.stringify({
            legalname1: data.legalname1,
            legalname2: data.legalname2
          }),
          address: JSON.stringify({
            address1: data.address1,
            address2: data.address2
          }),
          city: JSON.stringify({ city1: data.city1, city2: data.city2 }),
          zipcode: JSON.stringify({ zip1: data.zip1, zip2: data.zip2 }),
          state: JSON.stringify({ state1: data.state1, state2: data.state2 }),
          country: JSON.stringify({
            country1: data.country1,
            country2: data.country2
          }),
          dob: JSON.stringify({ dob1: data.dob1, dob2: data.dob2 }),
          tin: JSON.stringify({ tin1: data.tin1, tin2: data.tin2 })
        }

        const { errors } = await client.models.User.update({
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

  const onSubmit = async (data: FormData) => {
    console.log('Validated Data:', data)
    updateFormData(data)
    await updateUserInDB(data) // Assuming updateUserInDB exists
    handleNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant='h4'>Account Information</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name='accounttype'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Account Type</InputLabel>
                <Select
                  {...field}
                  value={field.value || 'Individual'}
                  onChange={e => {
                    field.onChange(e)
                    handleAccountTypeChange(e)
                  }}
                >
                  {ACCOUNT_TYPES.map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        {[
          {
            name: 'legalname1',
            label: 'Full Legal Name',
            placeholder: 'John Doe'
          },
          { name: 'address1', label: 'Address', placeholder: '123 Main St' },
          { name: 'city1', label: 'City', placeholder: 'New York' },
          {
            name: 'zip1',
            label: 'Zip Code',
            placeholder: '10001',
            type: 'number'
          },
          { name: 'dob1', label: 'Date of Birth', placeholder: 'MM-DD-YYYY' },
          { name: 'tin1', label: 'TIN/SSN', placeholder: '123-45-6789' }
        ].map(({ name, label, placeholder, type }) => renderTextField(name, label, placeholder, type))}
        {renderSelectField('state1', 'State', US_STATES)}
        {renderSelectField('country1', 'Country', OECD_COUNTRIES)}
        {accountType === 'Joint' && renderPersonalInfoFields()}

        {/* Navigation Buttons */}
        <Grid item xs={12} className='flex justify-between'>
          <Button
            variant='outlined'
            onClick={event => {
              event.preventDefault() // Prevent default button behavior
              handlePrevious() // Call your function with `formData`
            }}
          >
            <DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />
            Previous
          </Button>
          <Button type='submit' variant='contained'>
            Next
            <DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default StepAccountDetails
