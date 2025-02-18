import { defineFunction } from '@aws-amplify/backend'

export const myEmailSender = defineFunction({
  name: 'email-function',
  schedule: [
    // every tuesday at 9am
    '0 9 ? * 3 *',

    // every friday at 9am
    '0 9 ? * 6 *'
  ]
})
