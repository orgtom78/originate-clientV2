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

const client = generateClient<Schema>()

interface ApiResponse<T = any> {
  data?: {
    createOnboarding?: T
    updateOnboarding?: T
    getOnboarding?: T
  }
  errors?: Array<{ message: string }>
}

export const saveProgress = async (
  id: string,
  userId: string,
  step: string,
  data: Record<string, string>
): Promise<OnboardingData> => {
  try {
    const response = (await client.mutations.createOnboarding(
      {
        id,
        legalpersonId: data.loanamount,
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
    )) as ApiResponse<OnboardingData>

    if (!response?.data?.createOnboarding) {
      throw new Error('Failed to create onboarding record')
    }

    return response.data.createOnboarding
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to save onboarding progress')
  }
}

export const getProgress = async (id: string): Promise<OnboardingData | null> => {
  try {
    const response = (await client.queries.getOnboarding(
      { id },
      {
        authMode: 'apiKey'
      }
    )) as ApiResponse<OnboardingData>

    return response?.data?.getOnboarding || null
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to get onboarding progress')
  }
}

export const submitRegistration = async (id: string, data: Record<string, any>): Promise<OnboardingData> => {
  console.log(data)

  try {
    // Remove undefined values from data
    const cleanData = Object.fromEntries(Object.entries(data).filter(([, v]) => v != null))

    const response = (await client.mutations.updateOnboarding(
      {
        id,
        ...cleanData
      },
      {
        authMode: 'apiKey'
      }
    )) as ApiResponse<OnboardingData>

    if (!response?.data?.updateOnboarding) {
      console.error('Update response:', response)
      throw new Error('Failed to update onboarding record')
    }

    return response.data.updateOnboarding
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to submit registration')
  }
}
