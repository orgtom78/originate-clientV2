import { a } from '@aws-amplify/backend'

export const createOnboarding = a
  .mutation()
  .arguments({
    id: a.string().required(),

    loan_amount: a.string(),
    loan_type: a.string(),

    // Identity and relationship fields
    legalpersonId: a.string(),
    naturalpersonId: a.string(),

    // Address information
    legalperson_address_city: a.string(),
    legalpersonr_address_street: a.string(),
    legalperson_address_number: a.string(),
    legalperson_address_postalcode: a.string(),
    legalperson_address_refinment: a.string(),

    // Legal documents
    legalperson_articles_of_association_attachment: a.string(),
    legalperson_shareholder_list_attachment: a.string(),
    legalperson_director_list_attachment: a.string(),
    legalperson_registration_cert_attachment: a.string(),

    // Company information
    legalperson_description: a.string(),
    legalperson_country: a.string(),
    legalperson_industry: a.string(),
    legalperson_industry_code: a.string(),
    legalperson_logo: a.string(),
    legalperson_name: a.string(),
    legalperson_register_number: a.string(),
    legalperson_register_number_type: a.string(),
    legalperson_trading_name: a.string(),
    legalperson_type: a.string(),
    legalperson_website: a.string(),
    legalperson_duns_number: a.string(),

    // Contact information
    legalperson_contact_name: a.string(),
    legalperson_contact_email: a.string(),
    legalperson_contact_phone: a.string(),
    legalperson_contact_position: a.string(),
    legalperson_date_of_incorporation: a.string()
  })
  .returns(a.ref('Onboarding'))
  .authorization(allow => [allow.publicApiKey()])
  .handler(
    a.handler.custom({
      dataSource: 'onboardingTable',
      entry: '../handlers/item/createItem.js'
    })
  )

export const updateOnboarding = a
  .mutation()
  .arguments({
    id: a.string().required(),

    loan_amount: a.string(),
    loan_type: a.string(),

    // Identity and relationship fields
    legalpersonId: a.string(),
    naturalpersonId: a.string(),

    // Address information
    legalperson_address_city: a.string(),
    legalpersonr_address_street: a.string(),
    legalperson_address_number: a.string(),
    legalperson_address_postalcode: a.string(),
    legalperson_address_refinment: a.string(),

    // Legal documents
    legalperson_articles_of_association_attachment: a.string(),
    legalperson_shareholder_list_attachment: a.string(),
    legalperson_director_list_attachment: a.string(),
    legalperson_registration_cert_attachment: a.string(),

    // Company information
    legalperson_description: a.string(),
    legalperson_country: a.string(),
    legalperson_industry: a.string(),
    legalperson_industry_code: a.string(),
    legalperson_logo: a.string(),
    legalperson_name: a.string(),
    legalperson_register_number: a.string(),
    legalperson_register_number_type: a.string(),
    legalperson_trading_name: a.string(),
    legalperson_type: a.string(),
    legalperson_website: a.string(),
    legalperson_duns_number: a.string(),

    // Contact information
    legalperson_contact_name: a.string(),
    legalperson_contact_email: a.string(),
    legalperson_contact_phone: a.string(),
    legalperson_contact_position: a.string(),
    legalperson_date_of_incorporation: a.string()
  })
  .returns(a.ref('Onboarding'))
  .authorization(allow => [allow.publicApiKey()])
  .handler(
    a.handler.custom({
      dataSource: 'onboardingTable',
      entry: '../handlers/item/updateItem.js'
    })
  )
