import type { DynamoDBStreamHandler } from 'aws-lambda'
import { Logger } from '@aws-lambda-powertools/logger'
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda'

const lambdaClient = new LambdaClient({ region: 'us-east-2' })

// Define interfaces for your data
export type Message = {
  subject: string
  body: string
  recipient: string
}

const invokeEmailSender = async (message: Message): Promise<void> => {
  const command = new InvokeCommand({
    FunctionName: 'amplify-originatecapital--emailfunctionlambda87FA1-L3JNSfG0XMH7',
    InvocationType: 'Event', // Asynchronous invocation
    Payload: JSON.stringify(message)
  })

  try {
    await lambdaClient.send(command)
    logger.info('Email sender function invoked successfully')
  } catch (error) {
    logger.error('Failed to invoke email sender', { error })
    throw error
  }
}

/** 
const sendEmail = async (message: Message): Promise<void> => {
  const command = new SendEmailCommand({
    Source: 'admin@originatecapital.co',
    Destination: {
      ToAddresses: ['tobias.pfuetze@gmail.com']
    },
    Message: {
      Body: {
        Text: { Data: message.body }
      },
      Subject: { Data: message.subject }
    }
  })

  try {
    const result = await sendEmail(command)

    console.log(`Email sent to ${message.recipient}: ${result.MessageId}`)
  } catch (error) {
    console.error(`Error sending email to ${message.recipient}: ${error}`)
    throw new Error(`Failed to send email to ${message.recipient}`, { cause: error })
  }
}
    */

const logger = new Logger({
  logLevel: 'INFO',
  serviceName: 'dynamodb-stream-handler'
})

export const handler: DynamoDBStreamHandler = async event => {
  for (const record of event.Records) {
    logger.info(`Processing record: ${record.eventID}`)
    logger.info(`Event Type: ${record.eventName}`)

    if (record.eventName === 'INSERT') {
      // business logic to process new records
      logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`)
      const message: Message = JSON.parse('{"body":"John", "subject":30, "recipient":"New York"}')

      await invokeEmailSender(message)
    }
  }

  logger.info(`Successfully processed ${event.Records.length} records.`)

  return {
    batchItemFailures: []
  }
}
