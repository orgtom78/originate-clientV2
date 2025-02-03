import { a } from '@aws-amplify/backend'

export const Spv = a
  .model({
    spvId: a.string().required(),
    identityId: a.string(),
    spv_address_city: a.string(),
    spv_address_number: a.string(),
    spv_address_postalcode: a.string(),
    spv_address_refinment: a.string(),
    spv_articles_of_association_attachment: a.string(),
    spv_shareholder_list_attachment: a.string(),
    spv_director_list_attachment: a.string(),
    spv_country: a.string(),
    spv_email: a.string(),
    spv_industry: a.string(),
    spv_industry_code: a.string(),
    spv_logo: a.string(),
    spv_name: a.string(),
    spv_register_number: a.string(),
    spv_trading_name: a.string(),
    spv_type: a.string(),
    spv_website: a.string(),
    spv_address_street: a.string(),
    createdAt: a.string(),
    spv_date_of_incorporation: a.string(),
    spv_registration_cert_attachment: a.string(),
    spv_duns_number: a.string(),
    sortkey: a.string(),
    userId: a.string().required()
  })
  .authorization(allow => [allow.owner().identityClaim('custom:groupid'), allow.group('Admin')])
