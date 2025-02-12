// /app/api/register.ts
import { generateClient } from 'aws-amplify/api'

import { type Schema } from '../../../amplify/data/resource'

const client = generateClient<Schema>()

export const saveProgress = async (id: string, userId: string, step: string, data: Record<string, string>) => {
  console.log(data)

  return await client.mutations.createUsergroup({ id: id, legalpersonId: userId, user_email: step })
}

export const submitRegistration = async (
  id: string,
  flowId: string,
  formData: Record<string, Record<string, string>>
) => {
  console.log(formData)

  return await client.mutations.updateUsergroup({
    id: id,
    onboardingId: flowId
  })
}
