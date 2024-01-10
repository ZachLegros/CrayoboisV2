import { nextui } from "@nextui-org/react";
import colors from "tailwindcss/colors";

const scaleLight = {
  ...colors.slate,
  foreground: colors.slate[900],
  DEFAULT: colors.slate[200],
};

const scaleDark = {
  ...colors.slate,
  foreground: colors.slate[100],
  DEFAULT: colors.slate[800],
};

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "cart-item": "150px auto 125px 150px",
        "component-card-lg": "150px auto",
        "component-card-md": "125px auto",
        "component-card-sm": "100px auto",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      prefix: "nextui",
      themes: {
        light: {
          extend: "light",
          colors: {
            primary: "#cc5500",
            secondary: "#2E86AB",
            background: "#ffffff",
            foreground: "#000C14",
            default: scaleLight,
            content1: scaleLight,
            content2: scaleLight,
            content3: scaleLight,
            content4: scaleLight,
          }, // light theme colors
        },
        dark: {
          extend: "dark",
          colors: {
            primary: "#cc5500",
            secondary: "#2E86AB",
            background: "#000C14",
            foreground: "#ffffff",
            default: scaleDark,
            content1: scaleDark,
            content2: scaleDark,
            content3: scaleDark,
            content4: scaleDark,
          }, // dark theme colors
        },
      },
    }),
  ],
};

export default config;
