import { referenceAuth } from '@aws-amplify/backend'

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */

export const auth = referenceAuth({
  userPoolId: 'us-east-2_XURmwWmvZ',
  identityPoolId: 'us-east-2:ca8e2e12-f384-4b93-80d7-5d6754f31b1f',
  authRoleArn: 'arn:aws:iam::361659031315:role/amplify-originateclient-test-115620-authRole',
  unauthRoleArn: 'arn:aws:iam::361659031315:role/amplify-originateclient-test-115620-unauthRole',
  userPoolClientId: '138r25n639vvm2ng5crtnn33fp'
})

/**

export const auth = defineAuth({
  loginWith: {
    email: true,
    phone: true
  },
  multifactor: {
    mode: 'OPTIONAL',
    sms: true,
    totp: false
  },

  // Important! The logic to resolve this value cannot determine whether email mfa is enabled when overriding the resource.
  // Be sure to pick a recovery option appropriate for your application.
  accountRecovery: 'EMAIL_AND_PHONE_WITHOUT_MFA',
  senders: {
    email: {
      fromEmail: 'investor@originatecapital.co' //Emails are send correctly via aws SES
    }
  }
})
 */
