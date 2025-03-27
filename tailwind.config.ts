import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "100devs": "rgba(78,101,241,255)",
      },
    },
  },
  plugins: [],
} satisfies Config;
