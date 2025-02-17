import { defineBackend } from '@aws-amplify/backend'

import { aws_dynamodb } from 'aws-cdk-lib'

import { auth } from './auth/resource'

import { data } from './data/resource'

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
export const backend = defineBackend({
  auth,
  data
})

/** 
const { cfnResources } = backend.auth.resources
const { cfnUserPool, cfnUserPoolClient } = cfnResources

// enable ASF
cfnUserPool.userPoolAddOns = {
  advancedSecurityMode: 'AUDIT'
}

// add email mfa
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-enabledmfas
cfnUserPool.enabledMfas = [...(cfnUserPool.enabledMfas || []), 'EMAIL_OTP']

cfnUserPool.addPropertyOverride('Policies.SignInPolicy.AllowedFirstAuthFactors', [
  'PASSWORD',
  'WEB_AUTHN',
  'EMAIL_OTP',
  'SMS_OTP'
])

cfnUserPoolClient.explicitAuthFlows = ['ALLOW_REFRESH_TOKEN_AUTH', 'ALLOW_USER_AUTH']

Needed for WebAuthn 
cfnUserPool.addPropertyOverride('WebAuthnRelyingPartyID', '<RELYING_PARTY>')
cfnUserPool.addPropertyOverride('WebAuthnUserVerification', 'preferred')
*/

const externalDataSourcesStack = backend.createStack('MyExternalDataSources')

const usergroupTable = aws_dynamodb.Table.fromTableName(
  externalDataSourcesStack,
  'usergroupTable',
  'Usergroup-inyjwyok2ralnd7utuj4ctspbi-test'
)

backend.data.addDynamoDbDataSource('usergroupTable', usergroupTable)

const supplierTable = aws_dynamodb.Table.fromTableName(
  externalDataSourcesStack,
  'supplierTable',
  'Supplier-inyjwyok2ralnd7utuj4ctspbi-test'
)

backend.data.addDynamoDbDataSource('supplierTable', supplierTable)

const onboardingTable = aws_dynamodb.Table.fromTableName(
  externalDataSourcesStack,
  'onboardingTable',
  'Onboarding-inyjwyok2ralnd7utuj4ctspbi-test'
)

backend.data.addDynamoDbDataSource('onboardingTable', onboardingTable)
