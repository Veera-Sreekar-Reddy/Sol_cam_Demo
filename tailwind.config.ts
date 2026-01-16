import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        niftek: {
          dark: "var(--niftek-dark)",
          light: "var(--niftek-light)",
          medium: "var(--niftek-medium)",
          offwhite: "var(--niftek-offwhite)",
          white: "var(--niftek-white)",
        }
      }
    }
  },
  plugins: []
};

export default config;

