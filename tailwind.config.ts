import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "15px",
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
    },
    fontFamily: {
      primary: "var(--font-montserrat)",
    },
    extend: {
      colors: {
        primary: "#ffffff",
        accent: {
          DEFAULT: "#21E6C1",
          HOVER: "#1AAD9A",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
