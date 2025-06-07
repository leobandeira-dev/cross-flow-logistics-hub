import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px',
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#00A868',
					50: '#E6F6EF',
					100: '#CCEDDF',
					200: '#99DBC0',
					300: '#66C9A0',
					400: '#33B781',
					500: '#00A868',
					600: '#008653',
					700: '#00653F',
					800: '#00432A',
					900: '#002215',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#1B3B36',
					50: '#E8EDEC',
					100: '#D1DAD9',
					200: '#A3B5B3',
					300: '#75908D',
					400: '#476B67',
					500: '#1B3B36',
					600: '#162F2B',
					700: '#102320',
					800: '#0B1816',
					900: '#050C0B',
					foreground: '#FFFFFF'
				},
				success: {
					DEFAULT: '#10B981',
					foreground: '#FFFFFF'
				},
				warning: {
					DEFAULT: '#F59E0B',
					foreground: '#FFFFFF'
				},
				error: {
					DEFAULT: '#EF4444',
					foreground: '#FFFFFF'
				},
				info: {
					DEFAULT: '#3B82F6',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F3F4F6',
					foreground: '#6B7280'
				},
				accent: {
					DEFAULT: '#F3F4F6',
					foreground: '#1F2937'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#1F2937'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Cross colors
				cross: {
					blue: '#0098DA',
					gray: '#2D363F',
					blueDark: '#0073A5',
					blueLight: '#33ADDF',
					grayLight: '#505A64',
					grayDark: '#1A2027',
					success: '#10B981',
					warning: '#F59E0B',
					error: '#EF4444',
				}
			},
			borderRadius: {
				'lg': '0.625rem',
				'md': '0.5rem',
				'sm': '0.375rem'
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				heading: ['Inter', 'sans-serif']
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'slide-in': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-100%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.2s ease-out',
				'fade-out': 'fade-out 0.2s ease-out',
				'slide-in': 'slide-in 0.2s ease-out',
				'slide-out': 'slide-out 0.2s ease-out'
			},
			spacing: {
				'sidebar': '16rem',
				'sidebar-collapsed': '5rem',
			},
			zIndex: {
				'sidebar': '40',
				'header': '30',
				'modal': '50',
				'dropdown': '20',
				'tooltip': '60',
			},
			boxShadow: {
				'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
				'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
				'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
				'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
				'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
				'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms")
	],
} satisfies Config;
