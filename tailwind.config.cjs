/** @type {import('tailwindcss').Config} */
module.exports = {
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
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#f4f4f2",
          100: "#e9e8e5",
          200: "#d4d2cc",
          300: "#bfbcb2",
          400: "#aaa699",
          500: "#959080",
          600: "#777366",
          700: "#59564d",
          800: "#3c3a33",
          900: "#1e1d1a",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Nossa paleta personalizada
        neutral: {
          DEFAULT: "#d4cdc5",
          50: "#f8f7f6",
          100: "#f1efed",
          200: "#e3e0db",
          300: "#d4cdc5",
          400: "#bbb2a7",
          500: "#a29789",
          600: "#8c7f6f",
          700: "#746859",
          800: "#5d5347",
          900: "#463e35",
        },
        "soft-blue": {
          DEFAULT: "#5b88a5",
          50: "#f3f6f8",
          100: "#e7edf1",
          200: "#c4d5e0",
          300: "#9cbdcf",
          400: "#74a5be",
          500: "#5b88a5",
          600: "#496d84",
          700: "#375263",
          800: "#243642",
          900: "#121b21",
        },
        "dark-blue": {
          DEFAULT: "#243a69",
          50: "#f2f4f7",
          100: "#e5e8ef",
          200: "#c0cad8",
          300: "#9bacc2",
          400: "#768eab",
          500: "#5b7094",
          600: "#445777",
          700: "#243a69",
          800: "#1b2c4f",
          900: "#0d1627",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
