export type PrimaryColorConfig = {
  name?: string
  light?: string
  main: string
  dark?: string
}

// Primary color config object
const primaryColorConfig: PrimaryColorConfig[] = [
  {
    name: 'primary-1',
    main: "#071A52", // Deep Blue for main primary color
    light: "#086972", // Secondary blue shade
    dark: "#071A52", // Ensure contrast
  },
  {
    name: 'primary-2',
    main: "#17B978", // Vibrant green for secondary color
    light: "#A7FF83", // Lighter green for highlights
    dark: "#086972", // Complementary dark shade
  },
  {
    name: 'primary-3',
    light: '#FFA95A',
    main: '#FF891D',
    dark: '#BA6415'
  },
  {
    name: 'primary-4',
    light: '#F07179',
    main: '#EB3D47',
    dark: '#AC2D34'
  },
  {
    name: 'primary-5',
    light: '#5CC5F1',
    main: '#20AFEC',
    dark: '#1780AC'
  }
]

export default primaryColorConfig
