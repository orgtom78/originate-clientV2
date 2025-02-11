// File: /amplify/data/models/transaction.ts
import { a } from '@aws-amplify/backend'

export const Transaction = a.customType({
  // Required fields
  transactionId: a.string().required(),
  userId: a.string().required(),

  // Entity relationships
  buyerId: a.string(),
  supplierId: a.string(),
  investorId: a.string(),
  brokerId: a.string(),
  spvId: a.string(),
  identityId: a.string(),

  // Transaction timing
  authorized_date: a.string(),
  transaction_date: a.string(),

  // Transaction details
  category: a.string(),
  transaction_code: a.string(),
  transaction_description: a.string(),
  transaction_status: a.string(),
  pending: a.string(),
  payment_channel: a.string(),
  location: a.string(),
  merchant_name: a.string(),

  // Currency and amount information
  iso_currency_code: a.string(),
  transaction_source_amount: a.string(),
  transaction_source_currency: a.string(),
  transaction_target_amount: a.string(),
  transaction_target_currency: a.string(),
  transaction_exchange_rate: a.string(),
  transaction_exchange_rate_fee: a.string(),

  // Sender information
  sender_account_name: a.string(),
  sender_bank_name: a.string(),
  sender_bank_branch: a.string(),
  sender_bank_account_number: a.string(),
  sender_bank_account_sortcode: a.string(),
  sender_bank_routing_number: a.string(),
  sender_bic_swift_code: a.string(),
  sender_iban: a.string(),
  senderaccountId: a.string(),

  // Recipient information
  recipient_account_name: a.string(),
  recipient_bank_name: a.string(),
  recipient_bank_branch: a.string(),
  recipient_bank_account_number: a.string(),
  recipient_bank_account_sortcode: a.string(),
  recipient_bank_routing_number: a.string(),
  recipient_bic_swift_code: a.string(),
  recipient_iban: a.string(),
  recipientaccountId: a.string(),

  // Recipient bank address
  recipient_bank_country: a.string(),
  recipient_bank_address_city: a.string(),
  recipient_bank_address_street: a.string(),
  recipient_bank_address_number: a.string(),
  recipient_bank_address_postalcode: a.string(),
  recipient_bank_address_refinment: a.string(),

  // Sorting
  sortkey: a.string()
})
