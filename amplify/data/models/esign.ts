import { a } from '@aws-amplify/backend'

export const esign = a
  .model({
    esignId: a.string().required(),
    userId: a.string(),
    buyerId: a.string(),
    supplierId: a.string(),
    investorId: a.string(),
    spvId: a.string(),
    identityId: a.string(),
    esign_template_ipu: a.string(),
    ipu_buyer_action_id: a.string(),
    ipu_supplier_action_id: a.string(),
    esign_template_offer: a.string(),
    offer_supplier_action_id: a.string(),
    esign_template_raa_offer: a.string(),
    raa_offer_oc_action_id: a.string(),
    raa_offer_oc2_action_id: a.string(),
    raa_offer_investor_action_id: a.string(),
    updatedAt: a.string(),
    createdAt: a.string()
  })
  .authorization(allow => [
    allow.owner().identityClaim('custom:groupid'),
    allow.group('Broker').to(['update', 'read']),
    allow.group('Investor').to(['read', 'update']),
    allow.group('Admin'),
    allow.group('Spv').to(['read', 'update']),
    allow.publicApiKey().to(['read'])
  ])
