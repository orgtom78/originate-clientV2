import { generateClient } from 'aws-amplify/api'

import { type Schema } from '../../../amplify/data/resource'

type Nullable<T> = T | null

// Helper to safely convert to string array
const sanitizeStringArray = (value: unknown): string[] | null => {
  if (!value) return null

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item !== null)
  }

  if (typeof value === 'string') {
    return [value]
  }

  return null
}

export interface OnboardingData {
  id: string
  legalpersonId: Nullable<string>
  loan_amount?: Nullable<string>
  loan_type?: Nullable<string[]>
  loan_progress_step?: Nullable<string>
  loan_purpose?: Nullable<string>
  naturalpersonId?: Nullable<string>

  // Address information
  legalperson_address?: Nullable<string>
  legalperson_address_city?: Nullable<string>
  legalperson_address_street?: Nullable<string>
  legalperson_address_number?: Nullable<string>
  legalperson_address_postalcode?: Nullable<string>
  legalperson_address_refinment?: Nullable<string>

  // Legal documents
  legalperson_articles_of_association_attachment?: Nullable<string>
  legalperson_shareholder_list_attachment?: Nullable<string>
  legalperson_director_list_attachment?: Nullable<string>
  legalperson_registration_cert_attachment?: Nullable<string>

  // Company information
  legalperson_description?: Nullable<string>
  legalperson_country?: Nullable<string>
  legalperson_industry?: Nullable<string>
  legalperson_industry_code?: Nullable<string>
  legalperson_logo?: Nullable<string>
  legalperson_name?: Nullable<string>
  legalperson_register_number?: Nullable<string>
  legalperson_register_number_type?: Nullable<string>
  legalperson_trading_name?: Nullable<string>
  legalperson_type?: Nullable<string>
  legalperson_website?: Nullable<string>
  legalperson_duns_number?: Nullable<string>

  // Contact information
  legalperson_contact_name?: Nullable<string>
  legalperson_contact_email?: Nullable<string>
  legalperson_contact_phone?: Nullable<string>
  legalperson_contact_position?: Nullable<string>
  legalperson_date_of_incorporation?: Nullable<string>

  // Add other fields as needed
}

const client = generateClient<Schema>()

export const getOnboardingData = async (id: string): Promise<OnboardingData | null> => {
  try {
    console.log('Fetching onboarding data for ID:', id)

    const response = await client.queries.getOnboarding(
      { id },
      {
        authMode: 'apiKey'
      }
    )

    // Log the full response for debugging
    console.log('Full API Response:', JSON.stringify(response, null, 2))

    if (!response) {
      console.log('No response received')

      return null
    }

    const onboardingData: OnboardingData = {
      id: response.data?.id || '',
      legalpersonId: response.data?.legalpersonId || '',
      loan_amount: response.data?.loan_amount || '',
      loan_type: sanitizeStringArray(response.data?.loan_type),
      loan_progress_step: response.data?.loan_progress_step || '',
      naturalpersonId: response.data?.naturalpersonId || '',

      // Address information
      legalperson_address: response.data?.legalperson_address || '',
      legalperson_address_city: response.data?.legalperson_address_city || '',
      legalperson_address_street: response.data?.legalperson_address_street || '',
      legalperson_address_number: response.data?.legalperson_address_number || '',
      legalperson_address_postalcode: response.data?.legalperson_address_postalcode || '',
      legalperson_address_refinment: response.data?.legalperson_address_refinment || '',

      // Legal documents
      legalperson_articles_of_association_attachment:
        response.data?.legalperson_articles_of_association_attachment || '',
      legalperson_shareholder_list_attachment: response.data?.legalperson_shareholder_list_attachment || '',
      legalperson_director_list_attachment: response.data?.legalperson_director_list_attachment || '',
      legalperson_registration_cert_attachment: response.data?.legalperson_registration_cert_attachment || '',

      // Company information
      legalperson_description: response.data?.legalperson_description || '',
      legalperson_country: response.data?.legalperson_country || '',
      legalperson_industry: response.data?.legalperson_industry || '',
      legalperson_industry_code: response.data?.legalperson_industry_code || '',
      legalperson_logo: response.data?.legalperson_logo || '',
      legalperson_name: response.data?.legalperson_name || '',
      legalperson_register_number: response.data?.legalperson_register_number || '',
      legalperson_register_number_type: response.data?.legalperson_register_number_type || '',
      legalperson_trading_name: response.data?.legalperson_trading_name || '',
      legalperson_type: response.data?.legalperson_type || '',
      legalperson_website: response.data?.legalperson_website || '',
      legalperson_duns_number: response.data?.legalperson_duns_number || '',

      // Contact information
      legalperson_contact_name: response.data?.legalperson_contact_name || '',
      legalperson_contact_email: response.data?.legalperson_contact_email || '',
      legalperson_contact_phone: response.data?.legalperson_contact_phone || '',
      legalperson_contact_position: response.data?.legalperson_contact_position || '',
      legalperson_date_of_incorporation: response.data?.legalperson_date_of_incorporation || ''
    }

    // Log the transformed data
    console.log('Transformed onboarding data:', onboardingData)

    return onboardingData
  } catch (error) {
    console.error('API Error Details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    throw new Error(
      error instanceof Error
        ? `Failed to get onboarding progress: ${error.message}`
        : 'Failed to get onboarding progress'
    )
  }
}

// Helper function to clean data before sending to API
const cleanApiData = (data: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => {
      // Remove null, undefined, and empty strings
      if (value === null || value === undefined || value === '') {
        return false
      }

      // Keep zero values and boolean false
      if (value === 0 || value === false) {
        return true
      }

      return true
    })
  )
}

export const saveProgress = async (id: string, step: string, data: Record<string, any>): Promise<OnboardingData> => {
  try {
    // Initialize with required fields
    const apiData: OnboardingData = {
      id, // Required field
      legalpersonId: id,
      loan_progress_step: step
    }

    // Add step-specific data
    switch (step) {
      case 'loanDetails':
        apiData.loan_amount = data.loan_amount || null
        break
      case 'loanType':
        apiData.loan_type = sanitizeStringArray(data.loan_type)
        break
      case 'loanApplicant':
        apiData.legalperson_name = data.legalperson_name || null
        apiData.legalperson_contact_email = data.legalperson_contact_email || null
        apiData.legalperson_contact_phone = data.legalperson_contact_phone || null
        apiData.legalperson_address = data.legalperson_address || null
        break
    }

    console.log('Prepared API data:', apiData)

    const response = await client.mutations.createOnboarding(apiData, {
      authMode: 'apiKey'
    })

    console.log('Create onboarding response:', JSON.stringify(response, null, 2))

    if (!response?.data) {
      throw new Error('No data returned from API')
    }

    // Transform the response data to match OnboardingData type
    const onboardingData: OnboardingData = {
      id: response.data.id || '',
      legalpersonId: response.data.legalpersonId || '',
      loan_amount: response.data.loan_amount || '',
      loan_type: sanitizeStringArray(response.data.loan_type),
      naturalpersonId: response.data.naturalpersonId || '',

      // Address information
      legalperson_address: response.data.legalperson_address || '',
      legalperson_address_city: response.data.legalperson_address_city || '',
      legalperson_address_street: response.data.legalperson_address_street || '',
      legalperson_address_number: response.data.legalperson_address_number || '',
      legalperson_address_postalcode: response.data.legalperson_address_postalcode || '',
      legalperson_address_refinment: response.data.legalperson_address_refinment || '',

      // Legal documents
      legalperson_articles_of_association_attachment:
        response.data.legalperson_articles_of_association_attachment || '',
      legalperson_shareholder_list_attachment: response.data.legalperson_shareholder_list_attachment || '',
      legalperson_director_list_attachment: response.data.legalperson_director_list_attachment || '',
      legalperson_registration_cert_attachment: response.data.legalperson_registration_cert_attachment || '',

      // Company information
      legalperson_description: response.data.legalperson_description || '',
      legalperson_country: response.data.legalperson_country || '',
      legalperson_industry: response.data.legalperson_industry || '',
      legalperson_industry_code: response.data.legalperson_industry_code || '',
      legalperson_logo: response.data.legalperson_logo || '',
      legalperson_name: response.data.legalperson_name || '',
      legalperson_register_number: response.data.legalperson_register_number || '',
      legalperson_register_number_type: response.data.legalperson_register_number_type || '',
      legalperson_trading_name: response.data.legalperson_trading_name || '',
      legalperson_type: response.data.legalperson_type || '',
      legalperson_website: response.data.legalperson_website || '',
      legalperson_duns_number: response.data.legalperson_duns_number || '',

      // Contact information
      legalperson_contact_name: response.data.legalperson_contact_name || '',
      legalperson_contact_email: response.data.legalperson_contact_email || '',
      legalperson_contact_phone: response.data.legalperson_contact_phone || '',
      legalperson_contact_position: response.data.legalperson_contact_position || '',
      legalperson_date_of_incorporation: response.data.legalperson_date_of_incorporation || ''
    }

    return onboardingData
  } catch (error) {
    console.error('API Error Details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    throw new Error(
      error instanceof Error
        ? `Failed to save onboarding progress: ${error.message}`
        : 'Failed to save onboarding progress'
    )
  }
}

export const submitRegistration = async (
  id: string,
  step: string,
  data: Record<string, any>
): Promise<OnboardingData> => {
  try {
    console.log('Submitting registration with data:', data)

    const cleanedData = cleanApiData(data)

    console.log('Cleaned data for submission:', cleanedData)

    // Ensure required fields are present
    const apiData: OnboardingData = {
      id,
      legalpersonId: id,
      loan_progress_step: step,
      ...cleanedData
    }

    const response = await client.mutations.updateOnboarding(apiData, {
      authMode: 'apiKey'
    })

    // Log the full response
    console.log('Update response:', JSON.stringify(response, null, 2))

    if (!response?.data) {
      throw new Error('No data returned from API')
    }

    // Transform the response data to match OnboardingData type
    const onboardingData: OnboardingData = {
      id: response.data.id || '',
      legalpersonId: response.data.legalpersonId || '',
      loan_amount: response.data.loan_amount || '',
      loan_type: sanitizeStringArray(response.data.loan_type),
      loan_progress_step: response.data.loan_progress_step || '',
      naturalpersonId: response.data.naturalpersonId || '',

      // Address information
      legalperson_address: response.data.legalperson_address || '',
      legalperson_address_city: response.data.legalperson_address_city || '',
      legalperson_address_street: response.data.legalperson_address_street || '',
      legalperson_address_number: response.data.legalperson_address_number || '',
      legalperson_address_postalcode: response.data.legalperson_address_postalcode || '',
      legalperson_address_refinment: response.data.legalperson_address_refinment || '',

      // Legal documents
      legalperson_articles_of_association_attachment:
        response.data.legalperson_articles_of_association_attachment || '',
      legalperson_shareholder_list_attachment: response.data.legalperson_shareholder_list_attachment || '',
      legalperson_director_list_attachment: response.data.legalperson_director_list_attachment || '',
      legalperson_registration_cert_attachment: response.data.legalperson_registration_cert_attachment || '',

      // Company information
      legalperson_description: response.data.legalperson_description || '',
      legalperson_country: response.data.legalperson_country || '',
      legalperson_industry: response.data.legalperson_industry || '',
      legalperson_industry_code: response.data.legalperson_industry_code || '',
      legalperson_logo: response.data.legalperson_logo || '',
      legalperson_name: response.data.legalperson_name || '',
      legalperson_register_number: response.data.legalperson_register_number || '',
      legalperson_register_number_type: response.data.legalperson_register_number_type || '',
      legalperson_trading_name: response.data.legalperson_trading_name || '',
      legalperson_type: response.data.legalperson_type || '',
      legalperson_website: response.data.legalperson_website || '',
      legalperson_duns_number: response.data.legalperson_duns_number || '',

      // Contact information
      legalperson_contact_name: response.data.legalperson_contact_name || '',
      legalperson_contact_email: response.data.legalperson_contact_email || '',
      legalperson_contact_phone: response.data.legalperson_contact_phone || '',
      legalperson_contact_position: response.data.legalperson_contact_position || '',
      legalperson_date_of_incorporation: response.data.legalperson_date_of_incorporation || ''
    }

    return onboardingData
  } catch (error) {
    console.error('API Error Details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    throw new Error(
      error instanceof Error ? `Failed to submit registration: ${error.message}` : 'Failed to submit registration'
    )
  }
}
