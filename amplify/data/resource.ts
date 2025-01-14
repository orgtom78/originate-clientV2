import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  User: a
    .model({
      firstname: a.string(),
      lastname: a.string(),
      email: a.string(),
      phone: a.string(),
      accounttype: a.string(),
      legalname: a.string(),
      address: a.string(),
      city: a.string(),
      zipcode: a.string(),
      state: a.string(),
      country: a.string(),
      dob: a.string(),
      tin: a.string()
    })
    .authorization(allow => [allow.publicApiKey()])
})

<<<<<<< HEAD
  Supplier: a.customType({
      supplier_name: a.string()
    }),
      
  getSupplier: a
  .query()
  .arguments({ id: a.id().required() })
  .returns(a.ref("Supplier"))
  .authorization(allow => [allow.authenticated()])
  .handler(
    a.handler.custom({
      dataSource: "SupplierTable",
      entry: "./getSupplier.js",
    })
  )
});

export type Schema = ClientSchema<typeof schema>;
=======
export type Schema = ClientSchema<typeof schema>
>>>>>>> c4c6b3445977ba3a7e79a282f394ab28e20cbf0a

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
})

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
