// context/ConfigureAmplify.tsx
"use client";

import { Amplify } from "aws-amplify";

import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs, { ssr: true });
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-2_XURmwWmvZ",
      userPoolClientId: "138r25n639vvm2ng5crtnn33fp",
      identityPoolId: "us-east-2:ca8e2e12-f384-4b93-80d7-5d6754f31b1f",
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: false,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
})

export default function ConfigureAmplifyClientSide() {
  return null;
}