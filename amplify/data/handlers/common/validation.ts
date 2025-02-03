import { ValidationError } from './types'
import { createErrorMessage } from './errors'

// Generic validation functions
export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new ValidationError(createErrorMessage('Required field missing', fieldName))
  }
}

export function validateString(value: any, fieldName: string): void {
  if (typeof value !== 'string') {
    throw new ValidationError(createErrorMessage('Invalid string value', fieldName))
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format')
  }
}

// Model-specific validation functions
export function validateSupplierInput(input: Record<string, any>): void {
  // Required fields
  validateRequired(input.supplierId, 'supplierId')
  validateRequired(input.userId, 'userId')

  // String validations
  if (input.supplier_email) {
    validateEmail(input.supplier_email)
  }

  // Business logic validations
  if (input.supplier_date_of_incorporation) {
    const incorporationDate = new Date(input.supplier_date_of_incorporation)

    if (incorporationDate > new Date()) {
      throw new ValidationError('Incorporation date cannot be in the future')
    }
  }
}

export function validateBuyerInput(input: Record<string, any>): void {
  validateRequired(input.buyerId, 'buyerId')
  validateRequired(input.userId, 'userId')

  if (input.buyer_contact_email) {
    validateEmail(input.buyer_contact_email)
  }
}

export function validateFinancialsInput(input: Record<string, any>): void {
  validateRequired(input.financialsId, 'financialsId')
  validateRequired(input.userId, 'userId')

  // Validate numeric fields if present
  const numericFields = ['current_assets', 'cash_flow', 'current_long_term_debt', 'current_liabilities']

  numericFields.forEach(field => {
    if (input[field] !== undefined) {
      const value = parseFloat(input[field])

      if (isNaN(value)) {
        throw new ValidationError(`${field} must be a valid number`)
      }
    }
  })
}

export function validateRequestInput(input: Record<string, any>): void {
  validateRequired(input.requestId, 'requestId')
  validateRequired(input.userId, 'userId')

  if (input.investor_email) {
    validateEmail(input.investor_email)
  }

  // Validate dates if present
  const dateFields = ['invoice_date', 'invoice_due_date', 'purchase_order_date']

  dateFields.forEach(field => {
    if (input[field]) {
      const date = new Date(input[field])

      if (isNaN(date.getTime())) {
        throw new ValidationError(`Invalid date format for ${field}`)
      }
    }
  })
}
