// React Imports
import type { ReactElement } from 'react'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Next Imports
import dynamic from 'next/dynamic'

import { getCurrentUser } from 'aws-amplify/auth/server'

// Import AWS Amplify data client
import { generateClient } from 'aws-amplify/data'

// Component Imports
import UserProfile from '@views/pages/user-profile'

import type { Data } from '@/types/pages/profileTypes'

import { runWithAmplifyServerContext } from '../../../../utils/amplifyServerUtils'

// Data Imports
import { getProfileData } from '@/app/server/actions'

// Import AWS Amplify data client

import { type Schema } from '../../../../../amplify/data/resource'

const client = generateClient<Schema>()

async function getUser() {
  try {
    const user = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: contextSpec => getCurrentUser(contextSpec)
    })

    const userdata = NextResponse.json({ user })

    return userdata
  } catch (error) {
    console.error(error)
  }
}

const authuser = await getUser()
const userjson = authuser?.json()

console.log(userjson)

// Function to check if user exists
const getSupplier = async (input: string): Promise<any> => {
  try {
    const { data: supplier } = await client.queries.getSupplier(
      {
        id: input
      },

      {
        authMode: 'userPool'
      }
    )

    return supplier // Return true if user exists
  } catch (error) {
    console.error('Error checking if user exists:', error)

    return false
  }
}

console.log(getSupplier('id'))

const ProfileTab = dynamic(() => import('@views/pages/user-profile/profile'))
const TeamsTab = dynamic(() => import('@views/pages/user-profile/teams'))
const ProjectsTab = dynamic(() => import('@views/pages/user-profile/projects'))
const ConnectionsTab = dynamic(() => import('@views/pages/user-profile/connections'))

// Vars
const tabContentList = (data?: Data): { [key: string]: ReactElement } => ({
  profile: <ProfileTab data={data?.users.profile} />,
  teams: <TeamsTab data={data?.users.teams} />,
  projects: <ProjectsTab data={data?.users.projects} />,
  connections: <ConnectionsTab data={data?.users.connections} />
})

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/pages/profile` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */
/* const getProfileData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/pages/profile`)

  if (!res.ok) {
    throw new Error('Failed to fetch profileData')
  }

  return res.json()
} */

const ProfilePage = async () => {
  // Vars
  const data = await getProfileData()

  return <UserProfile data={data} tabContentList={tabContentList(data)} />
}

export default ProfilePage
