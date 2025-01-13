import { defineBackend } from '@aws-amplify/backend';

import { aws_dynamodb } from "aws-cdk-lib";

import { auth } from './auth/resource';

import { data } from './data/resource';


/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
export const backend = defineBackend({
  auth,
  data,
});


const externalDataSourcesStack = backend.createStack("MyExternalDataSources");

const externalTable = aws_dynamodb.Table.fromTableName(
  externalDataSourcesStack,
  "SupplierTable",
  "SupplierTable"
);


backend.data.addDynamoDbDataSource(
  "SupplierTable",
  externalTable
);