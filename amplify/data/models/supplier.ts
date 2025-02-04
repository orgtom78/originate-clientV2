import { a } from '@aws-amplify/backend'

export const Supplier = a.customType({
  // Required fields
  supplierId: a.string().required(),

  // Identity and relationship fields
  identityId: a.string(),
  brokerId: a.string(),

  // Address information
  supplier_address_city: a.string(),
  supplier_address_street: a.string(),
  supplier_address_number: a.string(),
  supplier_address_postalcode: a.string(),
  supplier_address_refinment: a.string(),

  // Legal documents
  supplier_articles_of_association_attachment: a.string(),
  supplier_shareholder_list_attachment: a.string(),
  supplier_director_list_attachment: a.string(),
  supplier_registration_cert_attachment: a.string(),

  // Company information
  supplier_description: a.string(),
  supplier_country: a.string(),
  supplier_industry: a.string(),
  supplier_industry_code: a.string(),
  supplier_logo: a.string(),
  supplier_name: a.string(),
  supplier_register_number: a.string(),
  supplier_register_number_type: a.string(),
  supplier_trading_name: a.string(),
  supplier_type: a.string(),
  supplier_website: a.string(),
  supplier_duns_number: a.string(),

  // Contact information
  supplier_contact_name: a.string(),
  supplier_contact_email: a.string(),
  supplier_contact_phone: a.string(),
  supplier_contact_position: a.string(),

  // Timestamps
  createdAt: a.string(),
  supplier_date_of_incorporation: a.string(),

  // Sorting and user information
  sortkey: a.string(),
  userId: a.string().required()
})
