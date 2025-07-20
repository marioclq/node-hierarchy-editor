/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores corporativos principales
        'corp-navy': {
          DEFAULT: '#003264',
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CCFF',
          300: '#66B2FF',
          400: '#3399FF',
          500: '#0080FF',
          600: '#003264',
          700: '#002A54',
          800: '#002143',
          900: '#001933'
        },
        'corp-gold': {
          DEFAULT: '#F8A900',
          50: '#FEF8E6',
          100: '#FDF1CC',
          200: '#FCE399',
          300: '#FAD566',
          400: '#F9C733',
          500: '#F8B900',
          600: '#F8A900',
          700: '#C68700',
          800: '#946500',
          900: '#624300'
        },
        'corp-light-blue': {
          DEFAULT: '#D1EBFF',
          50: '#F8FCFF',
          100: '#F0F9FF',
          200: '#D1EBFF',
          300: '#B3DDFF',
          400: '#94CFFF',
          500: '#75C1FF',
          600: '#56B3FF',
          700: '#38A5FF',
          800: '#1997FF',
          900: '#0088FA'
        },
        'corp-medium-blue': {
          DEFAULT: '#86B7FE',
          50: '#F2F7FF',
          100: '#E5EFFF',
          200: '#CCE0FF',
          300: '#B3D0FF',
          400: '#99C1FF',
          500: '#86B7FE',
          600: '#6DA2FE',
          700: '#548DFE',
          800: '#3B78FE',
          900: '#2263FE'
        },
        'corp-light-gray': {
          DEFAULT: '#F1F4F7',
          50: '#FAFBFC',
          100: '#F8FAFB',
          200: '#F1F4F7',
          300: '#E9EDF2',
          400: '#E2E7ED',
          500: '#DAE0E8',
          600: '#D3DAE3',
          700: '#CBD3DE',
          800: '#C4CDD9',
          900: '#BCC6D4'
        },
        // Colores existentes mejorados
        primary: {
          50: "#E6F2FF",
          100: "#CCE5FF",
          200: "#99CCFF",
          300: "#66B2FF",
          400: "#3399FF",
          500: "#003264",
          600: "#002A54",
          700: "#002143",
          800: "#001933",
          900: "#001122"
        },
        secondary: {
          50: "#FEF8E6",
          100: "#FDF1CC",
          200: "#FCE399",
          300: "#FAD566",
          400: "#F9C733",
          500: "#F8A900",
          600: "#C68700",
          700: "#946500",
          800: "#624300",
          900: "#312200"
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'bounce-soft': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out'
      },
      keyframes: {
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(248, 169, 0, 0.4)'
          },
          '50%': {
            boxShadow: '0 0 0 8px rgba(248, 169, 0, 0)'
          }
        },
        fadeIn: {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        slideUp: {
          '0%': {
            transform: 'translateY(10px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        scaleIn: {
          '0%': {
            transform: 'scale(0.9)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      boxShadow: {
        'elegant': '0 10px 25px rgba(0, 50, 100, 0.1), 0 4px 10px rgba(0, 50, 100, 0.05)',
        'elegant-lg': '0 20px 40px rgba(0, 50, 100, 0.15), 0 8px 16px rgba(0, 50, 100, 0.1)',
        'gold': '0 8px 20px rgba(248, 169, 0, 0.3), 0 2px 6px rgba(248, 169, 0, 0.2)',
        'navy': '0 12px 24px rgba(0, 50, 100, 0.2), 0 4px 8px rgba(0, 50, 100, 0.1)'
      }
    }
  },
  plugins: [],
}