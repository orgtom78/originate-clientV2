import { generateClient } from 'aws-amplify/data'

import { type Schema } from '../../../amplify/data/resource'

const client = generateClient<Schema>()

async function getSupplier(input: string) {
  try {
    const { data, errors } = await client.queries.getSupplier({
      id: input
    });

    if (errors) {
      console.error('Database errors:', errors)

      return
    }

    console.log('Supplier retrieved successfully:', data)
  } catch (error) {
    console.error('Failed to fetch Supplier in database:', error)
  }
}

export default getSupplier
