/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        level1: "var(--level1)",
        level2: "var(--level2)",
        level3: "var(--level3)",
        level4: "var(--level4)",
        level1Hover: "var(--level1Hover)",
        level2Hover: "var(--level2Hover)",
        primaryText: "var(--primaryText)",
        secondaryText: "var(--secondaryText)",
        tertiaryText: "var(--tertiaryText)",
        quaternaryText: "var(--quaternaryText)",
        invertedPrimaryText: "var(--invertedPrimaryText)",
        invertedTertiaryText: "var(--invertedTertiaryText)",
        lighttext: "var(--lighttext)",
        normaltext: "var(--normaltext)",
        bordercl: "var(--bordercl)",
        hoverColor: "var(--hoverColor)",
        bgCl: "var(--bgCl)",
        primary_bg: "var(--primary_bg)",
        elevated_border: "var(--elevated_border)",
        secondary_text: "var(--secondary_text)",
        bordercl: "var(--bordercl)",
        homeCl: "var(--homecl)",
        iconColor:"var(--iconColor)"
      },
    },
  },
  plugins: [],
};
