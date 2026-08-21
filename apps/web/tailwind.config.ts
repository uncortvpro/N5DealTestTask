import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4f9",
          100: "#d9e3ef",
          200: "#b3c7df",
          300: "#8ca6c9",
          400: "#5f7fa8",
          500: "#3f5f85",
          600: "#2d4867",
          700: "#213650",
          800: "#182741",
          900: "#0f1a2e",
          950: "#0a1220",
        },
        gold: {
          50: "#fbf7ee",
          100: "#f5ebd2",
          200: "#ead4a3",
          300: "#deb96f",
          400: "#d3a24a",
          500: "#c58f37",
          600: "#a5722c",
          700: "#815627",
          800: "#6b4726",
          900: "#5b3d24",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
