// email-sender/handler.ts
import { Logger } from '@aws-lambda-powertools/logger'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import type { RequestInfo, RequestInit, Response } from 'node-fetch'

// eslint-disable-next-line import/no-unresolved
import { env } from '$amplify/env/email-function'

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

  console.log(result)

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

async function sendEmail(recipient: string, subject: string, bodyText: string, onboarding: OnboardingData) {
  // Create HTML version of the email with proper formatting
  const htmlBody = `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Your Loan Application</title>
    <style>
      @media only screen and (max-width: 620px) {
        table.body h1 {
          font-size: 28px !important;
          margin-bottom: 10px !important;
        }
        table.body p,
        table.body ul,
        table.body ol,
        table.body td,
        table.body span,
        table.body a {
          font-size: 16px !important;
        }
        table.body .wrapper,
        table.body .article {
          padding: 10px !important;
        }
        table.body .content {
          padding: 0 !important;
        }
        table.body .container {
          padding: 0 !important;
          width: 100% !important;
        }
        table.body .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important;
        }
        table.body .btn table {
          width: 100% !important;
        }
        table.body .btn a {
          width: 100% !important;
        }
        table.body .img-responsive {
          height: auto !important;
          max-width: 100% !important;
          width: auto !important;
        }
      }
      @media all {
        .ExternalClass {
          width: 100%;
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important;
        }
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
        .btn-primary table td:hover {
          background-color: #34495e !important;
        }
        .btn-primary a:hover {
          background-color: #34495e !important;
          border-color: #34495e !important;
        }
      }
    </style>
  </head>
  <body style="background-color: #f9f9f9; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.6; margin: 0; padding: 0; color: #333333;">
  <!-- Modern Header with subtle gradient -->
  <div style="background-image: linear-gradient(120deg, #2e9787, #1a7a6d); padding: 30px 20px; text-align: center;">
    <img src="https://originatecapital.co/wp-content/uploads/2020/04/Horizontal-Dark-480.png" alt="Originate Capital Logo" width="180" style="max-width: 100%;">
  </div>
  
  <!-- Main content with card-like design -->
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-top: -20px; padding: 30px; position: relative;">
    <h1 style="font-weight: 300; color: #333; font-size: 24px; margin-bottom: 25px;">Your Application Status</h1>
    
    <p style="margin-bottom: 20px; color: #555;">Dear ${onboarding.legalperson_name || 'Valued Customer'},</p>
    <p style="margin-bottom: 25px; color: #555;">${bodyText}</p>
    
    <!-- Modern button with hover effect -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="https://app.originatecapital.co/register?onboardingId=${onboarding.id}" 
         style="display: inline-block; background-color: #2e9787; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: 500; transition: all 0.2s ease; border: none;">
         Complete Your Application
      </a>
    </div>
    
    <!-- Timeline element -->
    <div style="margin: 40px 0 30px; border-left: 2px solid #e0e0e0; padding-left: 20px;">
      <div style="margin-bottom: 15px; position: relative;">
        <div style="width: 10px; height: 10px; border-radius: 50%; background: #2e9787; position: absolute; left: -25px; top: 6px;"></div>
        <p style="margin: 0; font-weight: 500;">Application Started</p>
        <p style="margin: 5px 0 0; color: #888; font-size: 14px;">Step 1 of 3 completed</p>
      </div>
      <div style="margin-bottom: 15px; position: relative;">
        <div style="width: 10px; height: 10px; border-radius: 50%; background: #e0e0e0; position: absolute; left: -25px; top: 6px;"></div>
        <p style="margin: 0; font-weight: 500; color: #888;">Financial Details</p>
        <p style="margin: 5px 0 0; color: #888; font-size: 14px;">Waiting for completion</p>
      </div>
    </div>
  </div>
  
  <!-- Modern footer -->
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; color: #888; font-size: 14px;">
    <p>Originate Capital Inc, 8 The Green, Dover DE 19901</p>
    <div style="margin: 15px 0;">
      <a href="#" style="color: #2e9787; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
      <a href="#" style="color: #2e9787; text-decoration: none; margin: 0 10px;">Contact Us</a>
    </div>
  </div>
</body>
</html>
  `

  const command = new SendEmailCommand({
    Source: 'admin@originatecapital.co',
    Destination: {
      ToAddresses: [recipient]
    },
    Message: {
      Body: {
        Html: {
          Data: htmlBody
        },
        Text: {
          Data: bodyText // Plain text version as fallback
        }
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
  const apiKey = String('da2-4o76updeb5bkbfgdik63uj7qjy')
  const url = env.AMPLIFY_DATA_GRAPHQL_ENDPOINT

  try {
    if (event.type === 'direct') {
      // Handle direct API call with specific onboardingId
      const onboarding = await getOnboardingById(url, apiKey, event.onboardingId)

      if (!onboarding) {
        throw new Error(`Onboarding not found for ID: ${event.onboardingId}`)
      }

      // Create text body for email (both plain text and HTML)
      const bodyText = `Thank you for starting your loan application with Originate Capital. Your application is currently pending completion.

Please click the button below to continue with your application process. The current loan amount requested is $${onboarding.loan_amount || '0'}.

If you do not complete this application within 7 days, it may be archived.`

      // Send email for the specific onboarding
      await sendEmail(
        onboarding.legalperson_contact_email,
        `Your loan application - ${onboarding.legalperson_name}`,
        bodyText,
        onboarding
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

        // Create reminder text
        const reminderText = `This is a reminder that you have an incomplete loan application with Originate Capital.

Your application for $${onboarding.loan_amount || '0'} is still pending. To complete the process, please click the button below.

If you have any questions or need assistance, our support team is here to help.`

        // Send follow-up email
        await sendEmail(
          onboarding.legalperson_contact_email,
          `Reminder: Complete your loan application - ${onboarding.legalperson_name}`,
          reminderText,
          onboarding
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
