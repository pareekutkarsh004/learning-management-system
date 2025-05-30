/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize:{
        'course-details-heading-small':['26px','36px']
        'course-details-heading-large':['26px','36px']
      }
    },
  },
  plugins: [],
}