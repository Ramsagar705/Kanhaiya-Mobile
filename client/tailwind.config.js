export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        premium: {
          900: '#0f172a', // Deep Slate
          800: '#1e293b',
          accent: '#6366f1' // Indigo
        }
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}