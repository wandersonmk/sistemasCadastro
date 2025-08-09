import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './pages/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Paletas base (preto/roxo + neutros)
        brand: colors.violet,
        ink: colors.neutral,

        // Cores semânticas (utilize como bg-primary, text-secondary, etc.)
        primary: {
          DEFAULT: colors.violet[600],
          foreground: colors.white
        },
        secondary: {
          DEFAULT: colors.neutral[900],
          foreground: colors.white
        },
        accent: {
          DEFAULT: colors.violet[400],
          foreground: colors.white
        },
        muted: {
          DEFAULT: colors.neutral[200],
          foreground: colors.neutral[700]
        },
        background: colors.white,
        surface: colors.neutral[50],
        border: colors.neutral[200],
        ring: colors.violet[500],
        foreground: colors.neutral[900],

        success: {
          DEFAULT: colors.emerald[600],
          foreground: colors.white
        },
        warning: {
          DEFAULT: colors.amber[500],
          foreground: colors.black
        },
        destructive: {
          DEFAULT: colors.rose[600],
          foreground: colors.white
        },
        info: {
          DEFAULT: colors.blue[600],
          foreground: colors.white
        }
      }
    }
  },
  plugins: []
}

