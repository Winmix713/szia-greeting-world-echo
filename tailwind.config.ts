
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Egyedi színpaletta
        neon: {
          purple: "#8B5CF6",
          cyan: "#06B6D4",
          pink: "#EC4899",
          green: "#10B981",
          yellow: "#F59E0B",
          blue: "#3B82F6",
        },
        glass: {
          white: "rgba(255, 255, 255, 0.1)",
          black: "rgba(0, 0, 0, 0.1)",
        },
      },
      animation: {
        // Meglévő animációk
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Új egyedi animációk
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out infinite 2s",
        "glow": "glow 2s ease-in-out infinite alternate",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 3s infinite",
        "spin-slow": "spin 8s linear infinite",
        "spin-very-slow": "spin 20s linear infinite",
        "spin-reverse": "spin-reverse 3s linear infinite",
        "gradient-shift": "gradient-shift 8s ease-in-out infinite",
        "particle-drift": "particle-drift 10s linear infinite",
        "scale-pulse": "scale-pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "wave": "wave 2s ease-in-out infinite",
        "morph": "morph 4s ease-in-out infinite",
        "neon-glow": "neon-glow 2s ease-in-out infinite alternate",
        "text-glow": "text-glow 2s ease-in-out infinite alternate",
        "border-dance": "border-dance 3s linear infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "fade-in-down": "fade-in-down 0.8s ease-out forwards",
        "slide-in-left": "slide-in-left 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.6s ease-out forwards",
      },
      keyframes: {
        // Meglévő keyframes
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Új egyedi keyframes
        "float": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(180deg)" },
        },
        "glow": {
          "0%": { boxShadow: "0 0 5px rgba(139, 92, 246, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.8), 0 0 30px rgba(139, 92, 246, 0.4)" },
        },
        "spin-reverse": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "particle-drift": {
          "0%": { transform: "translateX(-100px) translateY(0px) rotate(0deg)" },
          "100%": { transform: "translateX(calc(100vw + 100px)) translateY(-50px) rotate(360deg)" },
        },
        "scale-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "wave": {
          "0%, 100%": { transform: "translateY(0px)" },
          "25%": { transform: "translateY(-10px)" },
          "75%": { transform: "translateY(10px)" },
        },
        "morph": {
          "0%, 100%": { borderRadius: "50% 50% 50% 50%" },
          "25%": { borderRadius: "50% 25% 75% 25%" },
          "50%": { borderRadius: "25% 75% 25% 75%" },
          "75%": { borderRadius: "75% 25% 50% 50%" },
        },
        "neon-glow": {
          "0%": { 
            boxShadow: "0 0 5px #8B5CF6, 0 0 10px #8B5CF6, 0 0 15px #8B5CF6",
            filter: "hue-rotate(0deg)"
          },
          "100%": { 
            boxShadow: "0 0 10px #06B6D4, 0 0 20px #06B6D4, 0 0 30px #06B6D4",
            filter: "hue-rotate(90deg)"
          },
        },
        "text-glow": {
          "0%": { textShadow: "0 0 5px rgba(139, 92, 246, 0.5)" },
          "100%": { textShadow: "0 0 20px rgba(139, 92, 246, 0.8), 0 0 30px rgba(6, 182, 212, 0.6)" },
        },
        "border-dance": {
          "0%, 100%": { borderColor: "#8B5CF6" },
          "25%": { borderColor: "#06B6D4" },
          "50%": { borderColor: "#10B981" },
          "75%": { borderColor: "#EC4899" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
        display: ["Poppins", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
        "144": "36rem",
      },
      backdropBlur: {
        xs: "2px",
        "3xl": "64px",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
      transitionProperty: {
        "spacing": "margin, padding",
        "width": "width",
        "height": "height",
      },
      transitionDuration: {
        "2000": "2000ms",
        "3000": "3000ms",
      },
      gradientColorStops: {
        "0": "0%",
        "5": "5%",
        "95": "95%",
        "100": "100%",
      },
      boxShadow: {
        "glow": "0 0 20px rgba(139, 92, 246, 0.3)",
        "glow-lg": "0 0 40px rgba(139, 92, 246, 0.4)",
        "neon": "0 0 5px theme(colors.neon.purple), 0 0 20px theme(colors.neon.purple), 0 0 35px theme(colors.neon.purple)",
        "neon-cyan": "0 0 5px theme(colors.neon.cyan), 0 0 20px theme(colors.neon.cyan), 0 0 35px theme(colors.neon.cyan)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    // Egyedi plugin az animáció késleltetésekhez
    function({ addUtilities, theme }: any) {
      const delays = theme('transitionDelay');
      const animationDelays = Object.keys(delays).reduce((acc: any, key) => {
        acc[`.animation-delay-${key}`] = {
          'animation-delay': delays[key],
        };
        return acc;
      }, {});
      addUtilities(animationDelays);
    },
  ],
} satisfies Config;
