// email-sender/handler.ts
import { Logger } from '@aws-lambda-powertools/logger'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import type { Handler } from 'aws-lambda'

import { Amplify } from 'aws-amplify'

import { generateClient } from 'aws-amplify/data'

import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'

import type { Schema } from '../../data/resource'

// eslint-disable-next-line import/no-unresolved
import { env } from '$amplify/env/email-function' // replace with your function name

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)

Amplify.configure(resourceConfig, libraryOptions)

const client = generateClient<Schema>()

const sesClient = new SESClient({ region: 'us-east-2' })

const logger = new Logger({
  logLevel: 'INFO',
  serviceName: 'email-sender'
})

export type EmailPayload = {
  subject: string
  body: string
  recipient: string
}

export const handler: Handler = async (event: EmailPayload) => {
  const { errors: createErrors, data: Onboarding } = await client.queries.getOnboarding({
    id: '1a6c0182-46f3-43d4-abd6-4aff8c0dfd5d'
  })

  console.log(createErrors, Onboarding)

  const command = new SendEmailCommand({
    Source: 'admin@originatecapital.co',
    Destination: {
      ToAddresses: ['tobias.pfuetze@gmail.com']
    },
    Message: {
      Body: {
        Text: { Data: event.body }
      },
      Subject: { Data: event.subject }
    }
  })

  try {
    const result = await sesClient.send(command)

    logger.info(`Email sent successfully`, { messageId: result.MessageId })

    return { statusCode: 200, messageId: result.MessageId }
  } catch (error) {
    logger.error(`Error sending email`, { error })
    throw error
  }
}
