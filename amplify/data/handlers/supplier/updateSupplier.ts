import type { HandlerContext } from '../common/types'
import { handleError } from '../common/errors'
import { validateSupplierInput } from '../common/validation'
import { updateDatabase } from '../common/db'

// Define the Supplier input type based on the schema
interface SupplierInput {
  supplierId?: string
  identityId?: string
  brokerId?: string
  supplier_address_city?: string
  supplier_address_street?: string
  supplier_address_number?: string
  supplier_address_postalcode?: string
  supplier_address_refinment?: string
  supplier_articles_of_association_attachment?: string
  supplier_shareholder_list_attachment?: string
  supplier_description?: string
  supplier_director_list_attachment?: string
  supplier_country?: string
  supplier_industry?: string
  supplier_industry_code?: string
  supplier_logo?: string
  supplier_name?: string
  supplier_register_number?: string
  supplier_register_number_type?: string
  supplier_trading_name?: string
  supplier_type?: string
  supplier_website?: string
  supplier_contact_name?: string
  supplier_contact_email?: string
  supplier_contact_phone?: string
  supplier_contact_position?: string
  supplier_date_of_incorporation?: string
  supplier_registration_cert_attachment?: string
  supplier_duns_number?: string
  sortkey?: string
  userId?: string
}

export async function handler(ctx: HandlerContext) {
  try {
    // Ensure both id and input exist
    if (!ctx.arguments.id) {
      throw new Error('ID is required')
    }

    if (!ctx.arguments.input) {
      throw new Error('Input is required')
    }

    const { id, input } = ctx.arguments
    const updateInput = input as SupplierInput

    // Validate the input
    validateSupplierInput(updateInput)

    // Add metadata
    const updateData = {
      ...updateInput,
      updatedAt: new Date().toISOString()
    }

    const result = await updateDatabase('Supplier', id, updateData)

    if (!result.success) {
      throw result.error
    }

    return result.data
  } catch (error) {
    return handleError(error)
  }
}
