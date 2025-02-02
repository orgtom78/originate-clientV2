// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

import { cookies } from 'next/headers'

// Utility Imports

// AWS Amplify Imports
//import { Amplify } from 'aws-amplify'

import { fetchAuthSession } from 'aws-amplify/auth/server'

//import { generateClient } from 'aws-amplify/data'

import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'

import { runWithAmplifyServerContext } from '../../../../utils/amplifyServerUtils'

// AWS Amplify Data Client

// Component Imports
import UserProfile from '@views/pages/user-profile'

// Type Imports
import type { Data } from '@/types/pages/profileTypes'

// Data Imports
import { getProfileData } from '@/app/server/actions'

// AWS Amplify Data Client Configuration
import { type Schema } from '../../../../../amplify/data/resource'

import outputs from '../../../../../amplify_outputs.json'

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies
})

/** 
const existingConfig = Amplify.getConfig()

if (!existingConfig.API) {
  Amplify.configure({
    ...existingConfig,
    API: {
      GraphQL: {
        endpoint: outputs.data.url,
        defaultAuthMode: 'apiKey'
      }
    }
  })
} else {
  // Merge the existing API configuration with the new one
  Amplify.configure({
    ...existingConfig,
    API: {
      ...existingConfig.API,
      GraphQL: {
        ...existingConfig.API.REST,
        endpoint: outputs.data.url,
        defaultAuthMode: 'apiKey'
      }
    }
  })
}

const client = generateClient<Schema>()
*/

// Dynamic imports for different tabs
const ProfileTab = dynamic(() => import('@views/pages/user-profile/profile'))
const TeamsTab = dynamic(() => import('@views/pages/user-profile/teams'))
const ProjectsTab = dynamic(() => import('@views/pages/user-profile/projects'))
const ConnectionsTab = dynamic(() => import('@views/pages/user-profile/connections'))

// Function to get user profile data
const getUserProfileData = async () => {
  try {
    const user = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: contextSpec => fetchAuthSession(contextSpec)
    })

    return user
  } catch (error) {
    console.error('Error fetching user data:', error)

    return null
  }
}

// Function to check if the supplier exists (assuming it's used somewhere else)
const supplier = async (input: string): Promise<any> => {
  try {
    const { errors, data } = await cookieBasedClient.queries.getSupplier({ id: input }, { authMode: 'userPool' })

    console.log(errors, data)

    return data
  } catch (error) {
    console.error('Error checking if user exists:', error)

    return null
  }
}

console.log(supplier('f7b3b690-8bf6-4c52-b4ae-77ef2e97f663'))

// Tab content setup
const tabContentList = (data?: Data): { [key: string]: ReactElement } => ({
  profile: <ProfileTab data={data?.users.profile} />,
  teams: <TeamsTab data={data?.users.teams} />,
  projects: <ProjectsTab data={data?.users.projects} />,
  connections: <ConnectionsTab data={data?.users.connections} />
})

const ProfilePage = async () => {
  // Check for user authentication and fetch profile data
  const user = await getUserProfileData()

  if (!user) {
    return <div>Redirecting...</div> // Show loading or redirecting state
  }

  const data = await getProfileData()

  // If data is not available, return error or loading state
  if (!data) {
    return <div>Error loading profile data</div>
  }

  // Return the user profile with the tabs dynamically populated
  return <UserProfile data={data} tabContentList={tabContentList(data)} />
}

export default ProfilePage
