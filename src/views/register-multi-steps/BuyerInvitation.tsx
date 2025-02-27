import React, { useState } from 'react'

import { TextField, Button, Alert } from '@mui/material'

import { generateClient } from 'aws-amplify/api'

import type { Schema } from '../../../amplify/data/resource'

// Create a client for API interactions
const client = generateClient<Schema>()

interface BuyerInvitationProps {
  onboardingId: string
  sharableLink: string
  defaultBuyerEmail: string
}

const BuyerInvitation: React.FC<BuyerInvitationProps> = ({ onboardingId, sharableLink, defaultBuyerEmail }) => {
  // State for tracking UI actions
  const [linkCopied, setLinkCopied] = useState(false)
  const [invitationSent, setInvitationSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [buyerEmail, setBuyerEmail] = useState(defaultBuyerEmail || '')

  // Copy the sharing link to clipboard
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(sharableLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 3000)
  }

  // Send invitation email to buyer and update database
  const sendInvitation = async () => {
    if (!buyerEmail.trim()) {
      setErrorMessage("Please enter the buyer's email address")

      return
    }

    try {
      setIsLoading(true)
      setErrorMessage(null)

      // Update the onboarding record with buyer's email
      const updateResult = await client.mutations.updateOnboarding(
        {
          id: onboardingId,
          loan_debtor_email: buyerEmail.trim(),
          loan_debtor_follow_up_emails: String(0) // Initialize the counter
        },
        {
          authMode: 'apiKey'
        }
      )

      // Call the email sender function
      await client.queries.myEmailSenderBuyer(
        {
          onboardingId: onboardingId,
          type: 'direct'
        },
        {
          authMode: 'apiKey'
        }
      )

      console.log('Invitation sent successfully:', { updateResult })
      setInvitationSent(true)
      setTimeout(() => setInvitationSent(false), 5000)
    } catch (error) {
      console.error('Error sending invitation:', error)
      setErrorMessage(
        error instanceof Error
          ? `Failed to send invitation: ${error.message}`
          : 'Failed to send invitation. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='border border-blue-100 rounded-lg p-4 bg-blue-50'>
      <h3 className='text-lg font-semibold text-blue-800 mb-2'>One more step needed</h3>
      <p className='mb-4'>To complete your application, we need financial information from your buyer.</p>

      {errorMessage && (
        <Alert severity='error' className='mb-4' onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      {invitationSent && (
        <Alert severity='success' className='mb-4'>
          Invitation sent successfully to {buyerEmail}
        </Alert>
      )}

      <div className='mb-4'>
        <p className='mb-2 font-medium'>Share this secure link with your buyer:</p>
        <div className='flex items-center gap-2'>
          <TextField
            fullWidth
            size='small'
            value={sharableLink}
            InputProps={{
              readOnly: true
            }}
          />
          <Button variant='contained' color={linkCopied ? 'success' : 'primary'} onClick={copyLinkToClipboard}>
            {linkCopied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      <div className='mb-2'>
        <p className='mb-2 font-medium'>Or let us send an invitation:</p>
        <div className='flex items-center gap-2'>
          <TextField
            fullWidth
            size='small'
            placeholder="Buyer's email address"
            value={buyerEmail}
            onChange={e => setBuyerEmail(e.target.value)}
            error={Boolean(errorMessage)}
          />
          <Button
            variant='outlined'
            color={invitationSent ? 'success' : 'primary'}
            onClick={sendInvitation}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : invitationSent ? 'Sent!' : 'Send Invitation'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BuyerInvitation
