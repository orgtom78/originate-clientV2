import { Buffer } from 'node:buffer'

import type { KinesisStreamBatchResponse, KinesisStreamHandler, KinesisStreamRecordPayload } from 'aws-lambda'
import { Logger } from '@aws-lambda-powertools/logger'

const logger = new Logger({
  logLevel: 'INFO',
  serviceName: 'kinesis-stream-handler'
})

export const handler: KinesisStreamHandler = async (event, context): Promise<KinesisStreamBatchResponse> => {
  console.log(event, context)

  for (const record of event.Records) {
    try {
      logger.info(`Processed Kinesis Event - EventID: ${record.eventID}`)
      const recordData = await getRecordDataAsync(record.kinesis)

      logger.info(`Record Data: ${recordData}`)
    } catch (err) {
      logger.error(`An error occurred ${err}`)

      /*
        When processing stream data, if any item fails, returning the failed item's position immediately
        prompts Lambda to retry from this item forward, ensuring continuous processing without skipping data.
        */
      return {
        batchItemFailures: [{ itemIdentifier: record.kinesis.sequenceNumber }]
      }
    }
  }

  logger.info(`Successfully processed ${event.Records.length} records.`)

  return { batchItemFailures: [] }
}

async function getRecordDataAsync(payload: KinesisStreamRecordPayload): Promise<string> {
  const data = Buffer.from(payload.data, 'base64').toString('utf-8')

  await Promise.resolve(1) // Placeholder for an async process

  return data
}
