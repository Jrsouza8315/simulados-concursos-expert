
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
				'2xl': '1400px'
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
					DEFAULT: '#0f2f46',
					foreground: '#ffffff',
					50: '#f0f4f7',
					100: '#dae6ed',
					200: '#b8d0de',
					300: '#89b1c7',
					400: '#548ca8',
					500: '#3e708c',
					600: '#2e5a78',
					700: '#274a62',
					800: '#253f53',
					900: '#0f2f46',
				},
				secondary: {
					DEFAULT: '#d85126',
					foreground: '#ffffff',
					50: '#fef5f1',
					100: '#fce8dd',
					200: '#f8d0bb',
					300: '#f2ae8e',
					400: '#ea815f',
					500: '#e45f39',
					600: '#d85126',
					700: '#b13b1f',
					800: '#8e321f',
					900: '#742c1e',
				},
				accent: {
					DEFAULT: '#619bb0',
					foreground: '#ffffff',
					50: '#f0f8fb',
					100: '#ddefF5',
					200: '#bee0eb',
					300: '#91cadb',
					400: '#619bb0',
					500: '#4a829a',
					600: '#406a82',
					700: '#39566a',
					800: '#344758',
					900: '#2e3d4b',
				},
				neutral: {
					DEFAULT: '#f4f4f4',
					foreground: '#000000',
					50: '#ffffff',
					100: '#f4f4f4',
					200: '#e5e5e5',
					300: '#d4d4d4',
					400: '#a3a3a3',
					500: '#737373',
					600: '#525252',
					700: '#404040',
					800: '#262626',
					900: '#000000',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
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
				}
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, #0f2f46 0%, #2e5a78 100%)',
				'gradient-secondary': 'linear-gradient(135deg, #d85126 0%, #619bb0 100%)',
				'gradient-success': 'linear-gradient(135deg, #619bb0 0%, #0f2f46 100%)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
					from: { opacity: '0', transform: 'translateY(20px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in': {
					from: { transform: 'translateX(-100%)' },
					to: { transform: 'translateX(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-in': 'slide-in 0.5s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
