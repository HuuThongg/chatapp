const defaultTheme = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        tweetHoverCl: "var(--tweetHoverCl)",
        level1: "var(--tweetHoverCl)",
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
        iconColor: "var(--iconColor)",
        bgicon: "var(--bgicon)",
        hoverIconBgCl: "var(--hoverIconBgCl)",
        borderWarn: "var(--borderWarn)",
        bgClWarning: "var(--bgClWarning)",
        textWarn: "var(--textWarn)",
        interHoverIcon: "var(--interHoverIcon)",
        interHoverIconActive: "var(--interHoverIconActive)",
        iconFIll: "var(--iconFIll)",
        iconFIllActive: "var(--iconFIllActive)",
        tweetButonHover: "var(--tweetButonHover)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-roboto-mono)", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};
