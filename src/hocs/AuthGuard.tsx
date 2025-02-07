import { cookies } from 'next/headers'

import { redirect } from 'next/navigation'

import { fetchAuthSession } from 'aws-amplify/auth/server'

import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

//import AuthRedirect from '../components/AuthRedirect'
import { runWithAmplifyServerContext } from '../utils/amplifyServerUtils'

export const dynamic = 'force-dynamic'

export default async function AuthGuard({ children }: ChildrenType) {
  let success = false

  try {
    const currentSession = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: contextSpec => fetchAuthSession(contextSpec)
    })

    console.log(currentSession)
    success = true

    return <>{currentSession ? children : <AuthRedirect />}</>
  } catch (error) {
    console.error('Error checking authentication:', error)

    return redirect('/login')
  } finally {
    if (success) {
      return <>{children}</>
    }
  }
}
