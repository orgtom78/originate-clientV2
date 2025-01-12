// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Register from '@views/register-multi-steps'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Register and Subscribe',
  description: 'Register and Subscribe'
}

const LoginPage = () => {
  // Vars
  const mode = getServerMode()

    // Conditional rendering or usage of `mode` could be added here
    console.log('Current Server Mode:', mode) // Example of ensuring mode is read

  return <Register />
}

export default LoginPage
