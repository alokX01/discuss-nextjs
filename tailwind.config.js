/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          claudeBg: "#0f172a",
          claudeCard: "#020617",
          claudeBorder: "#1e293b",
          claudeText: "#e5e7eb",
        },
      },
    },
    plugins: [],
  };
  