// email-sender/handler.ts
import { env } from '$amplify/env/email-function'
import { Logger } from '@aws-lambda-powertools/logger'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { RequestInfo, RequestInit, Response } from 'node-fetch'

const fetch = (...args: [RequestInfo, RequestInit?]): Promise<Response> =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const sesClient = new SESClient({ region: 'us-east-2' })
const logger = new Logger({
  logLevel: 'INFO',
  serviceName: 'email-sender'
})

interface OnboardingData {
  id: string
  legalperson_name: string
  loan_progress_step: string
  loan_amount: string
  loan_type: string
  legalperson_contact_name: string
  legalperson_contact_email: string
  legalperson_address: string
  loan_follow_up_emails?: number
}

export interface DirectApiEvent {
  type: 'direct'
  onboardingId: string
}

export interface PeriodicEvent {
  type: 'periodic'
}

export type HandlerEvent = DirectApiEvent | PeriodicEvent

async function queryGraphQL(url: string, apiKey: string, query: string, variables?: any) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    },
    body: JSON.stringify({ query, variables })
  })
  return response.json()
}

async function getOnboardingById(url: string, apiKey: string, id: string): Promise<OnboardingData | null> {
  const query = `
    query getOnboarding($id: ID!) {
      getOnboarding(id: $id) {
        id
        legalperson_name
        loan_progress_step
        loan_amount
        loan_type
        legalperson_contact_name
        legalperson_contact_email
        legalperson_address
        loan_follow_up_emails
      }
    }
  `
  const result = (await queryGraphQL(url, apiKey, query, { id })) as { data?: { getOnboarding?: OnboardingData } }

  return result.data?.getOnboarding || null
}

async function listAllOnboarding(url: string, apiKey: string): Promise<OnboardingData[]> {
  const query = `
    query listOnboarding($limit: Int, $nextToken: String) {
      listOnboarding(limit: $limit, nextToken: $nextToken) {
        items {
          id
          legalperson_name
          loan_progress_step
          loan_amount
          loan_type
          legalperson_contact_name
          legalperson_contact_email
          legalperson_address
          loan_follow_up_emails
        }
        nextToken
      }
    }
  `
  let allItems: OnboardingData[] = []
  let nextToken: string | null = null

  do {
    const result = (await queryGraphQL(url, apiKey, query, { limit: 100, nextToken })) as {
      data?: { listOnboarding?: { items: OnboardingData[]; nextToken: string | null } }
      errors?: any
    }

    // Add error handling and logging
    if (!result.data || !result.data.listOnboarding) {
      console.error('GraphQL response is missing data:', JSON.stringify(result))
      // Check for errors
      if (result.errors) {
        console.error('GraphQL errors:', JSON.stringify(result.errors))
      }
      break // Exit the loop if data is missing
    }

    allItems = [...allItems, ...result.data.listOnboarding.items]
    nextToken = result.data.listOnboarding.nextToken
  } while (nextToken)

  return allItems
}

async function sendEmail(recipient: string, subject: string, body: string) {
  const command = new SendEmailCommand({
    Source: 'admin@originatecapital.co',
    Destination: {
      ToAddresses: [recipient]
    },
    Message: {
      Body: {
        Text: { Data: body }
      },
      Subject: { Data: subject }
    }
  })

  try {
    const result = await sesClient.send(command)
    logger.info(`Email sent successfully`, { messageId: result.MessageId })
    return result.MessageId
  } catch (error) {
    logger.error(`Error sending email`, { error })
    throw error
  }
}

async function updateFollowUpCount(url: string, apiKey: string, id: string, currentCount: number) {
  const mutation = `
    mutation updateOnboarding($input: UpdateOnboardingInput!) {
      updateOnboarding(input: $input) {
        id
        loan_follow_up_emails
      }
    }
  `
  await queryGraphQL(url, apiKey, mutation, {
    input: {
      id,
      loan_follow_up_emails: currentCount + 1
    }
  })
}

export const handler = async (event: HandlerEvent) => {
  const apiKey = String(env.API_KEY)
  const url = 'https://ajpuowt4ojb53nkfhwcbvcuddq.appsync-api.us-east-2.amazonaws.com/graphql'

  try {
    if (event.type === 'direct') {
      // Handle direct API call with specific onboardingId
      const onboarding = await getOnboardingById(url, apiKey, event.onboardingId)
      if (!onboarding) {
        throw new Error(`Onboarding not found for ID: ${event.onboardingId}`)
      }

      // Send email for the specific onboarding
      await sendEmail(
        onboarding.legalperson_contact_email,
        `Your loan application update - ${onboarding.legalperson_name}`,
        `Dear ${onboarding.legalperson_contact_name},\n\nHere's an update on your loan application...`
      )
    } else {
      // Handle periodic check
      const onboardings = await listAllOnboarding(url, apiKey)

      for (const onboarding of onboardings) {
        const followUpCount = onboarding.loan_follow_up_emails || 0

        // Skip if max follow-ups reached or in last step
        if (followUpCount >= 40 || onboarding.loan_progress_step === 'laststep') {
          continue
        }

        // Send follow-up email
        await sendEmail(
          onboarding.legalperson_contact_email,
          `Follow-up: Your loan application - ${onboarding.legalperson_name}`,
          `Dear ${onboarding.legalperson_contact_name},\n\nThis is a follow-up regarding your loan application...`
        )

        // Update follow-up count
        await updateFollowUpCount(url, apiKey, onboarding.id, followUpCount)
      }
    }

    return {
      statusCode: 200,
      body: 'Emails processed successfully'
    }
  } catch (error) {
    logger.error('Error processing emails', { error })
    throw error
  }
}
