import { defineBackend } from '@aws-amplify/backend'

import { aws_dynamodb, Stack } from 'aws-cdk-lib'

import { Stream } from 'aws-cdk-lib/aws-kinesis'

import { StartingPosition, EventSourceMapping } from 'aws-cdk-lib/aws-lambda'

import { KinesisEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'

import { Policy, PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam'

import { data } from './data/resource'
import { auth } from './auth/resource'

import { myKinesisFunction } from './functions/kinesis-function/resource'

import { myDynamoDBFunction } from './functions/dynamoDB-function/resource'

import { myEmailSender } from './functions/email-sender/resource'

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */

export const backend = defineBackend({
  auth,
  data,
  myKinesisFunction,
  myDynamoDBFunction,
  myEmailSender
})

const kinesisStack = backend.createStack('kinesis-stack')

const kinesisStream = new Stream(kinesisStack, 'KinesisStream2', {
  streamName: 'myKinesisStream2',
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

const onTable = backend.data.addDynamoDbDataSource('onboardingTable', onboardingTable)

const policy = new Policy(Stack.of(onTable), 'MyDynamoDBFunctionStreamingPolicy', {
  statements: [
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['dynamodb:DescribeStream', 'dynamodb:GetRecords', 'dynamodb:GetShardIterator', 'dynamodb:ListStreams'],
      resources: ['*']
    })
  ]
})

backend.myDynamoDBFunction.resources.lambda.role?.attachInlinePolicy(policy)

const mapping = new EventSourceMapping(Stack.of(onTable), 'MyDynamoDBFunctionTodoEventStreamMapping', {
  target: backend.myDynamoDBFunction.resources.lambda,
  eventSourceArn:
    'arn:aws:dynamodb:us-east-2:361659031315:table/Onboarding-inyjwyok2ralnd7utuj4ctspbi-test/stream/2025-02-17T22:01:49.592',
  startingPosition: StartingPosition.LATEST
})

mapping.node.addDependency(policy)

backend.myDynamoDBFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['ses:SendEmail', 'ses:SendRawEmail', 'lambda:InvokeFunction'],
    resources: ['*']
  })
)

backend.myEmailSender.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['ses:SendEmail', 'ses:SendRawEmail'],
    resources: ['*']
  })
)
