import React from 'react'

import { Alert, AlertTitle } from '@mui/material'

import BuyerInvitation from './BuyerInvitation'

interface SuccessMessageProps {
  onboardingId: string
  onContinue: () => void
  allFormData: Record<string, Record<string, string>>
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ onboardingId, onContinue, allFormData }) => {
  const loanAmount = allFormData.loanDetails?.loan_amount || 'N/A'
  const loanType = allFormData.loanType?.loan_type || 'N/A'
  const applicantName = allFormData.loanApplicant?.legalperson_name || 'N/A'
  const applicantEmail = allFormData.loanApplicant?.legalperson_contact_email || ''

  // Generate a sharable link for the buyer
  const sharableLink = `${window.location.origin}/register?type=buyer&partnerId=${onboardingId}`

  // Determine if buyer collaboration is needed based on loan type
  // Display collaboration UI only if loan type is NOT supply chain finance or import finance
  const loanTypeStr = typeof loanType === 'string' ? loanType : JSON.stringify(loanType)
  const needsBuyerCollaboration = !loanTypeStr.includes('scf') || !loanTypeStr.includes('importfinance')

  return (
    <div className='space-y-6 p-6'>
      {/* Success Alert */}
      <Alert severity='success'>
        <AlertTitle>Application Submitted Successfully!</AlertTitle>
        Your application has been received. You will receive an email with further instructions.
      </Alert>

      {/* Application Details */}
      <div className='space-y-2 bg-gray-50 p-4 rounded-lg'>
        <p className='text-gray-600'>
          Application ID: <span className='font-mono'>{onboardingId}</span>
        </p>
        <p className='text-sm text-gray-600'>
          Loan Amount: <span className='font-semibold'>${loanAmount}</span>
        </p>
        <p className='text-sm text-gray-600'>
          Loan Type: <span className='font-semibold'>{loanType}</span>
        </p>
        <p className='text-sm text-gray-600'>
          Applicant: <span className='font-semibold'>{applicantName}</span>
        </p>
        <p className='text-sm text-gray-500 mt-4'>
          Please save this ID for your reference. A confirmation email will be sent shortly.
        </p>
      </div>

      {/* Collaboration UI for Supplier - Only show if loan type requires buyer collaboration */}
      {needsBuyerCollaboration && (
        <BuyerInvitation onboardingId={onboardingId} sharableLink={sharableLink} defaultBuyerEmail={applicantEmail} />
      )}

      {/* Navigation Buttons */}
      <div className='flex justify-between items-center pt-4'>
        <button
          onClick={() => (window.location.href = '/')}
          className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2'
        >
          <span className='text-sm'>←</span>
          Return Home
        </button>

        <button
          onClick={onContinue}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2'
        >
          Continue with Additional Info
          <span className='text-sm'>→</span>
        </button>
      </div>
    </div>
  )
}

export default SuccessMessage
