/*
 * We recommend using the merged theme if you want to override our core theme.
 * This means you can use our core theme and override it with your own customizations.
 * Write your overrides in the userTheme object in this file.
 * The userTheme object is merged with the coreTheme object within this file.
 * Export this file and import it in the `@components/theme/index.tsx` file to use the merged theme.
 */

// MUI Imports
import { deepmerge } from '@mui/utils'
import type { Theme } from '@mui/material/styles'

// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
import type { SystemMode } from '@core/types'

// Core Theme Imports
import coreTheme from '@core/theme'

const mergedTheme = (settings: Settings, mode: SystemMode, direction: Theme['direction']) => {
  // Vars
  const userTheme = {
      colorSchemes: {
        light: {
          palette: {
            primary: {
              main: "#071A52", // Deep Blue for main primary color
              light: "#086972", // Secondary blue shade
              dark: "#071A52", // Ensure contrast
            },
            secondary: {
              main: "#17B978", // Vibrant green for secondary color
              light: "#A7FF83", // Lighter green for highlights
              dark: "#086972", // Complementary dark shade
            },
            background: {
              default: "#FFFFFF", // White background
              paper: "#F5F5F5", // Slightly muted white for cards
            },
            text: {
              primary: "#071A52", // High contrast text
              secondary: "#086972", // Muted text for secondary elements
            },
          },
        },
      }
    } as Theme

  return deepmerge(coreTheme(settings, mode, direction), userTheme)
}

export default mergedTheme
