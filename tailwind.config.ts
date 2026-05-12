import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B1221",        // Navy Deep — primary bg, dark UI
          "navy-mid": "#0F1A2E", // Navy Mid — cards on dark surfaces
          "navy-light": "#1A2B4A", // Navy Light — hover on dark, borders
          orange: "#D5652B",     // Primary accent / CTA
          "orange-hover": "#B54E20",
          warm: "#F4EDE8",       // Hero warm tint
        },
        grey: {
          50: "#F8F9FA",
          100: "#F1F3F5",
          200: "#E9ECEF",
          400: "#ADB5BD",
          600: "#6C757D",
          800: "#343A40",
          900: "#212529",
        },
        success: "#00C853",
        warning: "#FF9800",
        error: "#F44336",
        danger: "#F44336",
        info: "#2196F3",
        wa: {
          green: "#25D366",
          dark: "#128C7E",
          light: "#DCF8C6",
          received: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.08)",
        md: "0 4px 12px rgba(0,0,0,0.10)",
        lg: "0 8px 24px rgba(0,0,0,0.12)",
        xl: "0 16px 48px rgba(0,0,0,0.16)",
        green: "0 4px 20px rgba(0,200,83,0.25)",
        navy: "0 8px 32px rgba(11,18,33,0.40)",
        orange: "0 4px 20px rgba(213,101,43,0.30)",
      },
    },
  },
  plugins: [],
};

export default config;
