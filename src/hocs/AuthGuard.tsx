import { cookies } from 'next/headers'

import { redirect } from 'next/navigation'

import { getCurrentUser } from 'aws-amplify/auth/server'

import type { ChildrenType } from '@core/types'
import AuthRedirect from '../components/AuthRedirect'
import { runWithAmplifyServerContext } from '../utils/amplifyServerUtils'

export const dynamic = 'force-dynamic'

export default async function AuthGuard({ children }: ChildrenType) {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: contextSpec => getCurrentUser(contextSpec)
    })

    if (currentUser) {
      return <>{children}</>
    }

    return <AuthRedirect />
  } catch (error) {
    console.error('Error checking authentication:', error)

    return redirect('/register')
  }
}
