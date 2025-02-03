import { a } from '@aws-amplify/backend'

export const Bank = a
  .model({
    bankId: a.string(),
    buyerId: a.string(),
    supplierId: a.string(),
    investorId: a.string(),
    identityId: a.string(),
    account_statement_attachment: a.string(),
    balance: a.string(),
    balance_available: a.string(),
    bank_account_name: a.string(),
    bank_account_number: a.string(),
    bank_account_sortcode: a.string(),
    bank_address_city: a.string(),
    bank_address_number: a.string(),
    bank_address_postalcode: a.string(),
    bank_address_refinment: a.string(),
    bank_address_street: a.string(),
    bank_branch: a.string(),
    bank_country: a.string(),
    bank_name: a.string(),
    bank_routing_number: a.string(),
    bank_status: a.string(),
    bic_swift_code: a.string(),
    createdAt: a.string(),
    iban: a.string(),
    iso_currency_code: a.string(),
    overdraft: a.string(),
    payments_incoming: a.string(),
    payments_outgoing: a.string(),
    pre_auth_amount: a.string(),
    reporting_end_date: a.string(),
    reporting_start_date: a.string(),
    sortkey: a.string(),
    userId: a.string().required()
  })
  .authorization(allow => [
    allow.owner().identityClaim('custom:groupid'),
    allow.group('Broker').to(['create', 'update', 'read']),
    allow.group('Investor').to(['read']),
    allow.group('Admin')
  ])
