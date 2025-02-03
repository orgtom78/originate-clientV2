import { a } from '@aws-amplify/backend'

export const Director = a
  .model({
    directorId: a.string().required(),
    supplierId: a.string(),
    buyerId: a.string(),
    investorId: a.string(),
    brokerId: a.string(),
    spvId: a.string(),
    identityId: a.string(),
    director_appointment_date: a.string(),
    director_country_of_residence: a.string(),
    director_date_of_birth: a.string(),
    director_email: a.string(),
    director_id_attachment: a.string(),
    director_id_expiry_date: a.string(),
    director_id_issue_date: a.string(),
    director_id_issuer_country: a.string(),
    director_id_issuer_state: a.string(),
    director_id_number: a.string(),
    director_id_type: a.string(),
    director_jobtitle: a.string(),
    director_name: a.string(),
    director_nationality: a.string(),
    director_pep_status: a.string(),
    director_phone_number: a.string(),
    director_poa_attachment: a.string(),
    director_ubo_status: a.string(),
    createdAt: a.string(),
    director_status: a.string(),
    sortkey: a.string(),
    userId: a.string().required()
  })
  .authorization(allow => [
    allow.owner().identityClaim('custom:groupid'),
    allow.group('Broker').to(['create', 'update', 'read']),
    allow.group('Investor').to(['read']),
    allow.group('Admin')
  ])
