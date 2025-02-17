import { defineBackend } from '@aws-amplify/backend'

import { aws_dynamodb } from 'aws-cdk-lib'

import { Stream } from 'aws-cdk-lib/aws-kinesis'

import { StartingPosition } from 'aws-cdk-lib/aws-lambda'

import { KinesisEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'

import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam'

import { data } from './data/resource'
import { auth } from './auth/resource'

import { myKinesisFunction } from './functions/kinesis-function/resource'

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
export const backend = defineBackend({
  auth,
  data,
  myKinesisFunction
})

const kinesisStack = backend.createStack('kinesis-stack')

const kinesisStream = new Stream(kinesisStack, 'KinesisStream', {
  streamName: 'myKinesisStream',
  shardCount: 1
})

const eventSource = new KinesisEventSource(kinesisStream, {
  startingPosition: StartingPosition.LATEST,
  reportBatchItemFailures: true
})

backend.myKinesisFunction.resources.lambda.addEventSource(eventSource)

// create a new policy to allow PutRecords to the Kinesis stream
const kinesisPolicy = new Policy(kinesisStack, 'KinesisPolicy', {
  statements: [
    new PolicyStatement({
      actions: ['kinesis:PutRecords'],
      resources: [kinesisStream.streamArn]
    })
  ]
})

// apply the policy to the authenticated and unauthenticated roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(kinesisPolicy)
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(kinesisPolicy)

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
