import type { Config as TailwindConfig } from "tailwindcss";
import daisyui from "daisyui";

// 1. Explicitly extend Tailwind's config to include daisyui definitions
interface CustomConfig extends TailwindConfig {
  daisyui?: {
    themes?: boolean | string[];
    darkTheme?: string;
    base?: boolean;
    styled?: boolean;
    utils?: boolean;
    prefix?: string;
    logs?: boolean;
    themeRoot?: string;
  };
}

// 2. Apply our custom type instead of the default Config type
const config: CustomConfig = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark"],
  },
};

export default config;
