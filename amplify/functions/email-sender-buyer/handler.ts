// email-sender-buyer/handler.ts
import { Logger } from '@aws-lambda-powertools/logger'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import type { RequestInfo, RequestInit, Response } from 'node-fetch'

const fetch = (...args: [RequestInfo, RequestInit?]): Promise<Response> =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const sesClient = new SESClient({ region: 'us-east-2' })

const logger = new Logger({
  logLevel: 'INFO',
  serviceName: 'email-sender-buyer'
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
  loan_debtor_email: string // Field for debtor email
  loan_debtor_follow_up_emails?: number | null // Field for debtor follow-up count
}

export interface DirectApiEvent {
  type: 'direct'
  onboardingId: string
}

export interface PeriodicEvent {
  type: 'periodic'
}

export type HandlerEvent = DirectApiEvent | PeriodicEvent

/**
 * Processes spintax format strings like "{Hello|Hi|Hey} there" into a randomly selected variant
 * @param text Text containing spintax patterns
 * @returns Processed text with a randomly chosen variant
 */
function processSpintax(text: string): string {
  // Find all instances of {option1|option2|option3} and replace with a random option
  return text.replace(/\{([^{}]+)\}/g, (match, options) => {
    const choices = options.split('|')

    return choices[Math.floor(Math.random() * choices.length)]
  })
}

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
        loan_debtor_email
        loan_debtor_follow_up_emails
      }
    }
  `

  const result = (await queryGraphQL(url, apiKey, query, { id })) as { data?: { getOnboarding?: OnboardingData } }

  logger.info('GetOnboarding result', { result })

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
          loan_debtor_email
          loan_debtor_follow_up_emails
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
      logger.error('GraphQL response is missing data:', { result: JSON.stringify(result) })

      // Check for errors
      if (result.errors) {
        logger.error('GraphQL errors:', { errors: JSON.stringify(result.errors) })
      }

      break // Exit the loop if data is missing
    }

    allItems = [...allItems, ...result.data.listOnboarding.items]
    nextToken = result.data.listOnboarding.nextToken
  } while (nextToken)

  return allItems
}

/**
 * Generates email content with spintax variations based on follow-up count
 * specifically tailored for a non-recourse factoring facility
 * @param onboarding The onboarding data
 * @param followUpCount Current follow-up count
 * @returns Email subject and body text
 */
function generateEmailContent(
  onboarding: OnboardingData,
  followUpCount: number
): { subject: string; bodyText: string } {
  const name = onboarding.legalperson_name || onboarding.legalperson_contact_name || 'Valued Client'
  const amount = onboarding.loan_amount ? `$${onboarding.loan_amount}` : 'your requested amount'

  // Email variations based on follow-up count
  if (followUpCount === 0) {
    // Initial email - non-recourse factoring focused
    const subject = processSpintax(
      `{Action Required: Additional Information|Important: Documentation Needed} for ${name}'s Non-Recourse Factoring Application`
    )

    const bodyText = processSpintax(`
{Dear|Hello|Hi} ${name},

Your client ${name} has submitted an application for a working capital line of credit through our non-recourse factoring facility. To proceed with the underwriting process, we need additional documentation and information.

This non-recourse factoring facility will allow your client to {access immediate working capital|improve cash flow|optimize their receivables} without the risk of customer non-payment. The current requested facility amount is ${amount}.

{Please use the secure link below|Click the secure link below|Access our secure portal via the link below} to provide the required documentation and complete the application process. 

{The required documentation includes:|We need the following items to proceed:|Please submit these essential documents:}
- Recent accounts receivable aging report
- Sample invoices and purchase orders
- Last 3 months of bank statements
- Customer concentration information
- {Historical factoring experience, if applicable|Past factoring experience, if any|Any previous factoring arrangements}

{If we do not receive this information within 7 days, the application may be delayed.|Your prompt response within 7 days will ensure timely processing.|We recommend submitting these documents within 7 days to avoid delays.}

{If you have any questions about this non-recourse facility, please contact us.|If you need clarification on any requirements, our team is ready to assist.|For any questions regarding the non-recourse structure, please reach out.}
    `)

    return { subject, bodyText }
  } else if (followUpCount < 3) {
    // Early follow-ups - emphasizing non-recourse benefits
    const subject = processSpintax(
      `{Reminder: Documentation Needed|Follow-up: Additional Information Required} for ${name}'s Non-Recourse Factoring Facility`
    )

    const bodyText = processSpintax(`
{Dear|Hello|Hi} ${name},

{This is a friendly reminder|We wanted to follow up|We're reaching out again} regarding the non-recourse factoring facility application for ${name}.

To proceed with underwriting for this ${amount} non-recourse facility, we still need {additional documentation|the requested information|important documents} from you. {The non-recourse structure offers significant protection against customer non-payment risk.|This facility will transfer the credit risk to us, protecting your client from non-payment.|Our non-recourse solution will safeguard your client against customer default.}

{Please use the secure link below to upload the required documentation.|Click the secure link below to provide the necessary information.|Access our secure portal to submit the outstanding documents.}

{If you're experiencing any difficulties gathering the required documentation, please let us know.|Need assistance collecting the required information? Our team can help.|Having trouble with any of the documentation requirements? Contact us for support.}
    `)

    return { subject, bodyText }
  } else if (followUpCount < 7) {
    // Middle follow-ups - more urgent, emphasizing benefits lost
    const subject = processSpintax(
      `{Urgent: Action Required|Important Follow-up Needed} for ${name}'s Non-Recourse Factoring Application`
    )

    const bodyText = processSpintax(`
{Dear|Hello|Hi} ${name},

{We have not yet received|We are still waiting for|We still need} the required documentation for ${name}'s non-recourse factoring facility application for ${amount}.

{Delaying this process may impact your client's ability to secure this valuable financing solution.|Without the required documentation, we cannot proceed with underwriting this non-recourse facility.|The benefits of non-recourse factoring – including credit risk protection – are on hold pending your submission.}

{The non-recourse feature provides significant value by protecting your client from customer non-payment risks.|This facility would transfer the customer credit risk to Originate Capital, a benefit that's currently on hold.|Your client stands to gain substantial protection against bad debt through this non-recourse arrangement.}

{Please use the secure link below to provide the outstanding information immediately.|Click the secure link below to upload the required documentation without delay.|Access our secure portal now to submit the necessary documents.}

{If there are specific challenges preventing you from submitting these documents, please contact us immediately.|Facing obstacles with document collection? Let us know how we can help.|If you need assistance with any aspect of the application, our team is standing by.}
    `)

    return { subject, bodyText }
  } else {
    // Later follow-ups - final notice, last chance
    const subject = processSpintax(
      `{Final Notice|Last Opportunity|Critical Update}: ${name}'s Non-Recourse Factoring Application`
    )

    const bodyText = processSpintax(`
{Dear|Hello|Hi} ${name},

{This is our final outreach|This is our last attempt to contact you|We're making a final effort to reach you} regarding ${name}'s incomplete non-recourse factoring facility application for ${amount}.

{Without the required documentation, we will need to close this application within 48 hours.|Your client's opportunity to secure this non-recourse facility will expire in the next 48 hours without action.|We must conclude this application process within 48 hours if we don't receive the required information.}

{The non-recourse protection – which shields your client from customer default risk – is a significant benefit that will be forfeited.|Your client will miss the opportunity to transfer credit risk to us through this non-recourse arrangement.|The valuable bad debt protection offered by our non-recourse structure remains unavailable without completed documentation.}

{Please use the secure link below immediately to complete this process.|Click the secure link now to provide the required information.|Access our secure portal right away to submit the outstanding documentation.}

{If your client's financing needs have changed, please let us know.|If you wish to withdraw this application or discuss alternatives, please contact us.|Should you need to discuss the status of this application, our team is available to assist.}
    `)

    return { subject, bodyText }
  }
}

async function sendEmail(recipient: string, subject: string, bodyText: string, onboarding: OnboardingData) {
  // Process spintax in the subject and body
  const processedSubject = processSpintax(subject)
  const processedBodyText = processSpintax(bodyText)

  // Create HTML version of the email with proper formatting
  const htmlBody = `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Non-Recourse Factoring Application</title>
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
    <h1 style="font-weight: 300; color: #333; font-size: 24px; margin-bottom: 25px;">Non-Recourse Factoring Application</h1>
    
    <p style="margin-bottom: 20px; color: #555;">${processedBodyText.split('\n\n').join('</p><p style="margin-bottom: 20px; color: #555;">')}</p>
    
    <!-- Modern button with hover effect -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="https://app.originatecapital.co/register?onboardingId=${onboarding.id}" 
         style="display: inline-block; background-color: #2e9787; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: 500; transition: all 0.2s ease; border: none;">
         Provide Required Information
      </a>
    </div>
    
    <!-- Non-recourse benefits callout -->
    <div style="background-color: #f5f9f8; border-left: 4px solid #2e9787; padding: 15px; margin: 30px 0;">
      <h3 style="margin-top: 0; color: #2e9787;">Benefits of Non-Recourse Factoring</h3>
      <ul style="padding-left: 20px;">
        <li>Transfer credit risk to the factor</li>
        <li>Protection against customer bankruptcy or default</li>
        <li>Improve cash flow without increasing debt</li>
        <li>Secure working capital backed by accounts receivable</li>
        <li>Outsource collections and credit management</li>
      </ul>
    </div>
    
    <!-- Application progress -->
    <div style="margin: 40px 0 30px; border-left: 2px solid #e0e0e0; padding-left: 20px;">
      <div style="margin-bottom: 15px; position: relative;">
        <div style="width: 10px; height: 10px; border-radius: 50%; background: #2e9787; position: absolute; left: -25px; top: 6px;"></div>
        <p style="margin: 0; font-weight: 500;">Application Initiated</p>
        <p style="margin: 5px 0 0; color: #888; font-size: 14px;">Initial submission complete</p>
      </div>
      <div style="margin-bottom: 15px; position: relative;">
        <div style="width: 10px; height: 10px; border-radius: 50%; background: #e0e0e0; position: absolute; left: -25px; top: 6px;"></div>
        <p style="margin: 0; font-weight: 500; color: #888;">Documentation Required</p>
        <p style="margin: 5px 0 0; color: #888; font-size: 14px;">Waiting for completion</p>
      </div>
      <div style="margin-bottom: 15px; position: relative;">
        <div style="width: 10px; height: 10px; border-radius: 50%; background: #e0e0e0; position: absolute; left: -25px; top: 6px;"></div>
        <p style="margin: 0; font-weight: 500; color: #888;">Underwriting</p>
        <p style="margin: 5px 0 0; color: #888; font-size: 14px;">Pending documentation</p>
      </div>
    </div>
  </div>
  
  <!-- Modern footer -->
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; color: #888; font-size: 14px;">
    <p>Originate Capital Inc, 8 The Green, Dover DE 19901</p>
    <div style="margin: 15px 0;">
      <a href="https://originatecapital.co/privacy-policy/" style="color: #2e9787; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
      <a href="https://originatecapital.co/contact/" style="color: #2e9787; text-decoration: none; margin: 0 10px;">Contact Us</a>
    </div>
    <p style="font-size: 12px; color: #aaa;">This message contains confidential information and is intended only for the recipient. If you received this in error, please contact us immediately.</p>
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
          Data: processedBodyText // Plain text version as fallback
        }
      },
      Subject: { Data: processedSubject }
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

async function updateFollowUpCount(url: string, apiKey: string, id: string, currentCount: number | null) {
  // Handle the case where currentCount is null
  const newCount = (currentCount === null ? 0 : currentCount) + 1

  const mutation = `
    mutation updateOnboarding($input: UpdateOnboardingInput!) {
      updateOnboarding(input: $input) {
        id
        loan_debtor_follow_up_emails
      }
    }
  `

  await queryGraphQL(url, apiKey, mutation, {
    input: {
      id,
      loan_debtor_follow_up_emails: newCount
    }
  })

  return newCount
}

export const handler = async (event: HandlerEvent) => {
  const apiKey = 'da2-4o76updeb5bkbfgdik63uj7qjy'

  const url = 'https://q54x3izgzneh5oq22py5d7batq.appsync-api.us-east-2.amazonaws.com/graphql'

  try {
    if (event.type === 'direct') {
      // Handle direct API call with specific onboardingId
      const onboarding = await getOnboardingById(url, apiKey, event.onboardingId)

      if (!onboarding) {
        throw new Error(`Onboarding not found for ID: ${event.onboardingId}`)
      }

      // Check if debtor email exists
      if (!onboarding.loan_debtor_email) {
        logger.warn(`No debtor email found for onboarding ID: ${event.onboardingId}`)

        return {
          statusCode: 400,
          body: 'No debtor email found for this application'
        }
      }

      // Initialize follow-up count if null
      const followUpCount = onboarding.loan_debtor_follow_up_emails ?? 0

      // Generate appropriate email content based on follow-up count
      const { subject, bodyText } = generateEmailContent(onboarding, followUpCount)

      // Send email to the debtor email address
      await sendEmail(onboarding.loan_debtor_email, subject, bodyText, onboarding)

      // Update the follow-up count
      await updateFollowUpCount(url, apiKey, onboarding.id, followUpCount)
    } else {
      // Handle periodic check
      const onboardings = await listAllOnboarding(url, apiKey)

      for (const onboarding of onboardings) {
        // Skip if no debtor email is provided
        if (!onboarding.loan_debtor_email) {
          logger.warn(`Skipping onboarding ID: ${onboarding.id} - No debtor email found`)
          continue
        }

        // Handle null follow-up count
        const followUpCount = onboarding.loan_debtor_follow_up_emails ?? 0

        // Skip if max follow-ups reached or in last step
        if (followUpCount >= 40 || onboarding.loan_progress_step === 'laststep') {
          continue
        }

        // Generate appropriate email content based on follow-up count
        const { subject, bodyText } = generateEmailContent(onboarding, followUpCount)

        // Send follow-up email to the debtor email
        await sendEmail(onboarding.loan_debtor_email, subject, bodyText, onboarding)

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
