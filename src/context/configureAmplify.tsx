'use client'

import { Amplify } from 'aws-amplify'
import { parseAmplifyConfig } from 'aws-amplify/utils'

import outputs from '../../amplify_outputs.json'

const amplifyConfig = parseAmplifyConfig(outputs)

Amplify.configure(
  {
    ...amplifyConfig,
    Analytics: {
      Kinesis: {
        // REQUIRED -  Amazon Kinesis service region
        region: 'us-east-2',

        // OPTIONAL - The buffer size for events in number of items.
        bufferSize: 1000,

        // OPTIONAL - The number of events to be deleted from the buffer when flushed.
        flushSize: 100,

        // OPTIONAL - The interval in milliseconds to perform a buffer check and flush if necessary.
        flushInterval: 5000, // 5s

        // OPTIONAL - The limit for failed recording retries.
        resendLimit: 5
      }
    }
  },
  {
    ssr: true // required when using Amplify with Next.js
  }
)

export default function RootLayoutThatConfiguresAmplifyOnTheClient({ children }: { children: React.ReactNode }) {
  return children
}
