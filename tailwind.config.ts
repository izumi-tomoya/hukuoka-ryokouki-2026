import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["18px", "28px"],
        xl: ["20px", "28px"],
        "2xl": ["24px", "32px"],
        "3xl": ["30px", "36px"],
      },
      fontFamily: {
        sans: [
          "var(--font-noto-sans-jp)",
          "Hiragino Maru Gothic ProN",
          "Meiryo",
          "sans-serif",
        ],
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
      },
      colors: {
        border: "oklch(0.85 0.01 240)",
        input: "oklch(0.9 0.01 240)",
        ring: "oklch(0.2 0.05 240)",
        background: "oklch(0.99 0.005 240)",  /* ほぼ白。わずかな青みで清潔感を出す */
        foreground: "oklch(0.1 0.02 240)",    /* ほぼ黒。深いネイビーで最高の視認性 */
        primary: {
          DEFAULT: "oklch(0.25 0.05 240)",    /* かなり暗めのネイビーブルー */
          foreground: "oklch(1 0 0)",
        },
        secondary: {
          DEFAULT: "oklch(0.94 0.02 240)",    /* 薄いグレーブルー */
          foreground: "oklch(0.1 0.02 240)",
        },
        muted: {
          DEFAULT: "oklch(0.92 0.01 240)",
          foreground: "oklch(0.3 0.02 240)",
        },
        accent: {
          DEFAULT: "oklch(0.9 0.04 240)",
          foreground: "oklch(0.1 0.05 240)",
        },
        card: {
          DEFAULT: "oklch(1 0 0)",            /* カードは完全な白 */
          foreground: "oklch(0.1 0.02 240)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
