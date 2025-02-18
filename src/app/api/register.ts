import { generateClient } from 'aws-amplify/api'

import { type Schema } from '../../../amplify/data/resource'

export interface OnboardingData {
  id: string
  legalpersonId: string
  loan_amount?: string
  loan_type?: string
  loan_purpose?: string
  naturalpersonId?: string

  // Address information
  legalperson_address_city?: string
  legalpersonr_address_street?: string
  legalperson_address_number?: string
  legalperson_address_postalcode?: string
  legalperson_address_refinment?: string

  // Legal documents
  legalperson_articles_of_association_attachment?: string
  legalperson_shareholder_list_attachment?: string
  legalperson_director_list_attachment?: string
  legalperson_registration_cert_attachment?: string

  // Company information
  legalperson_description?: string
  legalperson_country?: string
  legalperson_industry?: string
  legalperson_industry_code?: string
  legalperson_logo?: string
  legalperson_name?: string
  legalperson_register_number?: string
  legalperson_register_number_type?: string
  legalperson_trading_name?: string
  legalperson_type?: string
  legalperson_website?: string
  legalperson_duns_number?: string

  // Contact information
  legalperson_contact_name?: string
  legalperson_contact_email?: string
  legalperson_contact_phone?: string
  legalperson_contact_position?: string
  legalperson_date_of_incorporation?: string

  // Add other fields as needed
}
interface ApiResponse {
  data?: {
    id: string
    legalpersonId: string
    loan_amount?: string | null

    // ... other fields
  } | null
  errors?: Array<{ message: string }>
}

const convertApiResponse = (response: ApiResponse): OnboardingData => {
  if (!response.data) {
    throw new Error('No data in response')
  }

  const { id, legalpersonId, ...rest } = response.data

  if (!id || !legalpersonId) {
    throw new Error('Missing required fields in response')
  }

  return {
    id,
    legalpersonId,
    ...Object.fromEntries(Object.entries(rest).map(([key, value]) => [key, value ?? '']))
  } as OnboardingData
}

const client = generateClient<Schema>()

export const saveProgress = async (
  id: string,
  userId: string,
  step: string,
  data: Record<string, string>
): Promise<OnboardingData> => {
  try {
    const response = await client.mutations.createOnboarding(
      {
        id,
        legalpersonId: userId,
        loan_amount: data.loanamount || '',
        naturalpersonId: data.loanamount || '',

        // Address information
        legalperson_address_city: data.loanamount || '',
        legalpersonr_address_street: data.loanamount || '',
        legalperson_address_number: data.loanamount || '',
        legalperson_address_postalcode: data.loanamount || '',
        legalperson_address_refinment: data.loanamount || '',

        // Legal documents
        legalperson_articles_of_association_attachment: data.loanamount || '',
        legalperson_shareholder_list_attachment: data.loanamount || '',
        legalperson_director_list_attachment: data.loanamount || '',
        legalperson_registration_cert_attachment: data.loanamount || '',

        // Company information
        legalperson_description: data.loanamount || '',
        legalperson_country: data.loanamount || '',
        legalperson_industry: data.loanamount || '',
        legalperson_industry_code: data.loanamount || '',
        legalperson_logo: data.loanamount || '',
        legalperson_name: data.loanamount || '',
        legalperson_register_number: data.loanamount || '',
        legalperson_register_number_type: data.loanamount || '',
        legalperson_trading_name: data.loanamount || '',
        legalperson_type: data.loanamount || '',
        legalperson_website: data.loanamount || '',
        legalperson_duns_number: data.loanamount || '',

        // Contact information
        legalperson_contact_name: data.loanamount || '',
        legalperson_contact_email: data.loanamount || '',
        legalperson_contact_phone: data.loanamount || '',
        legalperson_contact_position: data.loanamount || '',
        legalperson_date_of_incorporation: data.loanamount || ''
      },
      {
        authMode: 'apiKey'
      }
    )

    return convertApiResponse(response as ApiResponse)
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to save onboarding progress')
  }
}

export const getProgress = async (id: string): Promise<OnboardingData | null> => {
  try {
    const response = await client.queries.getOnboarding(
      { id },
      {
        authMode: 'apiKey'
      }
    )

    return convertApiResponse(response as ApiResponse)
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to get onboarding progress')
  }
}

export const submitRegistration = async (id: string, data: Record<string, string>): Promise<OnboardingData> => {
  try {
    // Transform formData into API format
    const apiData = {
      id,
      legalpersonId: data.userId,
      loan_amount: data.loanamount || '',
      naturalpersonId: data.loanamount || '',

      // Address information
      legalperson_address_city: data.loanamount || '',
      legalpersonr_address_street: data.loanamount || '',
      legalperson_address_number: data.loanamount || '',
      legalperson_address_postalcode: data.loanamount || '',
      legalperson_address_refinment: data.loanamount || '',

      // Legal documents
      legalperson_articles_of_association_attachment: data.loanamount || '',
      legalperson_shareholder_list_attachment: data.loanamount || '',
      legalperson_director_list_attachment: data.loanamount || '',
      legalperson_registration_cert_attachment: data.loanamount || '',

      // Company information
      legalperson_description: data.loanamount || '',
      legalperson_country: data.loanamount || '',
      legalperson_industry: data.loanamount || '',
      legalperson_industry_code: data.loanamount || '',
      legalperson_logo: data.loanamount || '',
      legalperson_name: data.loanamount || '',
      legalperson_register_number: data.loanamount || '',
      legalperson_register_number_type: data.loanamount || '',
      legalperson_trading_name: data.loanamount || '',
      legalperson_type: data.loanamount || '',
      legalperson_website: data.loanamount || '',
      legalperson_duns_number: data.loanamount || '',

      // Contact information
      legalperson_contact_name: data.loanamount || '',
      legalperson_contact_email: data.loanamount || '',
      legalperson_contact_phone: data.loanamount || '',
      legalperson_contact_position: data.loanamount || '',
      legalperson_date_of_incorporation: data.loanamount || ''

      // Map other fields
    }

    const response = await client.mutations.updateOnboarding(apiData, {
      authMode: 'apiKey'
    })

    return convertApiResponse(response as ApiResponse)
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to submit registration')
  }
}
