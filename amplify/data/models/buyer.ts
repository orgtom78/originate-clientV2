import { a } from '@aws-amplify/backend'

export const Buyer = a.customType({
  // Required fields
  buyerId: a.string().required(),
  supplierId: a.string().array(),
  investorId: a.string(),
  identityId: a.string(),
  brokerId: a.string(),
  spvId: a.string(),

  // Basic information
  buyer_address_city: a.string(),
  buyer_address_number: a.string(),
  buyer_address_postalcode: a.string(),
  buyer_address_refinment: a.string(),
  buyer_address_street: a.string(),
  buyer_name: a.string(),
  buyer_trading_name: a.string(),
  buyer_country: a.string(),
  buyer_country_year_of_rating_downgrade: a.string(),
  buyer_country_year_of_rating_downgrade_risk: a.string(),

  // Contact information
  buyer_contact_name: a.string(),
  buyer_contact_email: a.string(),
  buyer_contact_phone: a.string(),
  buyer_contact_position: a.string(),
  buyer_website: a.string(),

  // Timestamps and core data
  createdAt: a.string(),
  buyer_currency: a.string(),
  buyer_date_of_incorporation: a.string(),
  buyer_date_of_incorporation_risk: a.string(),
  buyer_description: a.string(),

  // Risk and dispute information
  buyer_existing_disputes: a.string(),
  buyer_existing_disputes_risk: a.string(),
  buyer_existing_disputes_source: a.string(),

  // Contact and communication
  buyer_finance_department_contact_exists: a.string(),
  buyer_finance_department_contact_email: a.string(),
  buyer_field_visit_conducted: a.string(),

  // Business terms
  buyer_incoterms: a.string(),
  buyer_industry: a.string(),
  buyer_industry_code: a.string(),

  // Invoice and payment history
  buyer_invoices_paid_on_time: a.string(),
  buyer_invoices_paid_on_time_risk: a.string(),
  buyer_invoices_past_due: a.string(),
  buyer_invoices_past_due_30_days: a.string(),
  buyer_invoices_past_due_30_days_risk: a.string(),
  buyer_invoices_past_due_60_days: a.string(),
  buyer_invoices_past_due_60_days_risk: a.string(),
  buyer_invoices_past_due_90_days: a.string(),

  // Insurance information
  buyer_insurance_name: a.string(),
  buyer_insurance_rating: a.string(),
  buyer_insurance_status: a.string(),
  buyer_insurance_status_risk: a.string(),

  // Documents and attachments
  buyer_one_off_ipu_attachment: a.string(),

  // Loan details
  buyer_loan_request_amount: a.string(),
  buyer_loan_approved_amount: a.string(),
  buyer_loan_advance_rate: a.string(),
  buyer_loan_collateral: a.string(),
  buyer_loan_covenants: a.string(),
  buyer_loan_transaction_fee: a.string(),
  buyer_loan_discount_fee: a.string(),
  buyer_loan_spv_fee: a.string(),
  buyer_loan_broker_fee: a.string(),
  buyer_loan_purpose: a.string(),
  buyer_loan_rate: a.string(),
  buyer_loan_type: a.string(),

  // Company information
  buyer_logo: a.string(),

  // Transaction projections and history
  buyer_next_year_projected_transaction_amount: a.string(),
  buyer_next_year_projected_number_invoices: a.string(),
  buyer_payment_terms: a.string(),
  buyer_previous_year_transaction_amount: a.string(),
  buyer_previous_year_number_invoices: a.string(),

  // Reporting
  buyer_reporting_year: a.string(),
  buyer_reporting_year_transaction_amount: a.string(),
  buyer_reporting_year_number_invoices: a.string(),
  buyer_reporting_year_number_invoices_risk: a.string(),

  // Business documentation
  buyer_sample_trading_docs_attachment: a.string(),
  buyer_sold_goods_description: a.string(),
  buyer_supplier_year_business_relation_started: a.string(),
  buyer_supplier_year_business_relation_started_risk: a.string(),

  // Status and type
  buyer_status: a.string(),
  buyer_type: a.string(),

  // Use of goods
  buyer_use_of_goods_purchased: a.string(),
  buyer_use_of_goods_purchased_risk: a.string(),

  // Legal documents
  buyer_registration_cert_attachment: a.string(),
  buyer_shareholder_list_attachment: a.string(),
  buyer_director_list_attachment: a.string(),
  buyer_articles_of_association_attachment: a.string(),
  buyer_duns_number: a.string(),

  // Sorting and user information
  sortkey: a.string(),
  userId: a.string().required().array()
})
