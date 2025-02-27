import { defineFunction, secret } from '@aws-amplify/backend'

export const myEmailSenderBuyer = defineFunction({
  name: 'email-function-buyer',
  resourceGroupName: 'data',
  schedule: [
    // every tuesday at 9am
    '0 9 ? * 3 *',

    // every friday at 9am
    '0 9 ? * 6 *'
  ],
  environment: {
    API_KEY: secret('appsyncapikey') // this assumes you created a secret named "MY_API_KEY"
  }
})
