import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        screens: {
          bg: "#0a0a0b",
          card: "#111113",
          border: "#1e1e22",
          muted: "#8b8b95",
          accent: "#7dd3fc",
          "accent-dim": "#38bdf8",
        },
        tier: {
          basic: "#34d399",
          advanced: "#7dd3fc",
          private: "#c084fc",
        },
      },
    },
  },
  plugins: [],
};

export default config;
