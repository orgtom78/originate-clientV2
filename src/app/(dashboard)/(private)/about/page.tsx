// React Imports
import type { ReactElement } from 'react'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Next Imports
import dynamic from 'next/dynamic'

import { getCurrentUser } from 'aws-amplify/auth/server'

// Type Imports
import type { Data } from '@/types/pages/profileTypes'

import { runWithAmplifyServerContext } from '../../../../utils/amplifyServerUtils'

// Component Imports
import UserProfile from '@views/pages/user-profile'

// Data Imports
//import { getProfileData } from '@/app/server/actions'

// Import AWS Amplify data client
import { generateClient } from "aws-amplify/data";

import { type Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

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

console.log(getUser())

  // Function to check if user exists
  const getSupplier = async (input: string): Promise<boolean> => {
    try {
      const { data: supplier } = await client.models.getSupplier.get({
        filter: { id: { eq: input } },
      });

      return supplier.length > 0; // Return true if user exists
    } catch (error) {
      console.error("Error checking if user exists:", error);
      
      return false;
    }
  };


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


const getProfileData = async () => {
  // Vars
} 

const ProfilePage = async () => {
  // Vars
  const data = await getProfileData()

  return <UserProfile data={data} tabContentList={tabContentList(data)} />
}

export default ProfilePage
