import { a } from '@aws-amplify/backend'

export const Investor = a
  .model({
    investorId: a.string().required(),
    identityId: a.string(),
    investor_address_city: a.string(),
    investor_address_number: a.string(),
    investor_address_postalcode: a.string(),
    investor_address_refinment: a.string(),
    investor_articles_of_association_attachment: a.string(),
    investor_shareholder_list_attachment: a.string(),
    investor_director_list_attachment: a.string(),
    investor_country: a.string(),
    investor_email: a.string(),
    investor_industry: a.string(),
    investor_industry_code: a.string(),
    investor_logo: a.string(),
    investor_name: a.string(),
    investor_register_number: a.string(),
    investor_trading_name: a.string(),
    investor_type: a.string(),
    investor_website: a.string(),
    investor_address_street: a.string(),
    createdAt: a.string(),
    investor_date_of_incorporation: a.string(),
    investor_registration_cert_attachment: a.string(),
    investor_duns_number: a.string(),
    sortkey: a.string(),
    userId: a.string().required()
  })
  .authorization(allow => [
    allow.owner().identityClaim('custom:groupid'),
    allow.group('Investor').to(['read']),
    allow.group('Admin'),
    allow.publicApiKey().to(['read'])
  ])
