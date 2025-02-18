// email-sender/handler.ts
import { Logger } from '@aws-lambda-powertools/logger'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

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

export const handler = async (event: EmailPayload) => {
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
