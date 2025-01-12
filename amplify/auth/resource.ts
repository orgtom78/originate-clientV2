import { referenceAuth } from '@aws-amplify/backend';

export const auth = referenceAuth({
  userPoolId: 'us-east-2_XURmwWmvZ',
  identityPoolId: 'us-east-2:ca8e2e12-f384-4b93-80d7-5d6754f31b1f',
  authRoleArn: 'arn:aws:iam::361659031315:role/amplify-originateclient-test-115620-authRole',
  unauthRoleArn: 'arn:aws:iam::361659031315:role/amplify-originateclient-test-115620-unauthRole',
  userPoolClientId: '138r25n639vvm2ng5crtnn33fp',
});