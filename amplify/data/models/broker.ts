import { a } from '@aws-amplify/backend'

export const Broker = a
  .model({
    brokerId: a.string().required(),
    identityId: a.string(),
    broker_address_city: a.string(),
    broker_address_number: a.string(),
    broker_address_postalcode: a.string(),
    broker_address_refinment: a.string(),
    broker_articles_of_association_attachment: a.string(),
    broker_shareholder_list_attachment: a.string(),
    broker_director_list_attachment: a.string(),
    broker_country: a.string(),
    broker_email: a.string(),
    broker_industry: a.string(),
    broker_industry_code: a.string(),
    broker_logo: a.string(),
    broker_name: a.string(),
    broker_register_number: a.string(),
    broker_trading_name: a.string(),
    broker_type: a.string(),
    broker_website: a.string(),
    broker_address_street: a.string(),
    createdAt: a.string(),
    broker_date_of_incorporation: a.string(),
    broker_registration_cert_attachment: a.string(),
    broker_duns_number: a.string(),
    sortkey: a.string(),
    userId: a.string().required()
  })
  .authorization(allow => [
    allow.owner().identityClaim('custom:groupid'),
    allow.group('Admin'),
    allow.publicApiKey().to(['read'])
  ])
