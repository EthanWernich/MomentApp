/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        card: '#151515',
        cardHover: '#1a1a1a',
        text: '#ffffff',
        textMuted: '#888888',
        accent: '#6366f1',
        accentGlow: '#818cf8',
        separator: '#2a2a2a'
      }
    }
  },
  plugins: []
};
