// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

import { cookies } from 'next/headers'

// Utility Imports

// AWS Amplify Imports
import { getCurrentUser } from 'aws-amplify/auth/server'

import { generateClient } from 'aws-amplify/data'

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

const client = generateClient<Schema>()

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
      operation: contextSpec => getCurrentUser(contextSpec)
    })

    return user
  } catch (error) {
    console.error('Error fetching user data:', error)

    return null
  }
}

// Function to check if the supplier exists (assuming it's used somewhere else)
const getSupplier = async (input: string): Promise<any> => {
  try {
    const { data: supplier } = await client.queries.getSupplier({ id: input }, { authMode: 'userPool' })

    return supplier
  } catch (error) {
    console.error('Error checking if user exists:', error)

    return null
  }
}

console.log(getSupplier('1'))

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

  console.log(user)

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
