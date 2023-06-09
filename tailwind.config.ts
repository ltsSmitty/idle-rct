import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        anuphan: ["Anuphan", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
