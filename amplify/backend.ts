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
