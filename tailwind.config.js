const hslVar = (v) => {
  return `hsl(var(--${v}))`;
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: hslVar("bg-page"),
        "content-primary": hslVar("content-primary"),
        "content-secondary": hslVar("border-primary"),
        "content-accent": hslVar("content-accent"),
        "typer-caret": hslVar("typer-caret"),
        "typer-untyped": hslVar("typer-untyped-text"),
        "typer-typed": hslVar("typer-typed-text"),
        "typer-error": hslVar("typer-error-text"),
        "typer-mistyped": hslVar("typer-mistyped-text"),
      },
      borderColor: {
        primary: hslVar("border-primary"),
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
      },
      zIndex: {
        1: 1,
      },
      animation: {
        "fade-in": "fade-in 400ms ease 1",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
