import { generateClient } from 'aws-amplify/data'

import { type Schema } from '../../../amplify/data/resource'

const client = generateClient<Schema>()

async function createuser(input: string) {
  try {
    const { errors, data } = await client.models.User.create({
      firstname: input,
      lastname: input,
      email: input,
      phone: input
    })

    if (errors) {
      console.error('Database errors:', errors)

      return
    }

    console.log('User created successfully:', data)
  } catch (error) {
    console.error('Failed to create user in database:', error)
  }
}

export default createuser
