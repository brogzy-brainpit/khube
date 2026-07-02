/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
 theme: {
    
    extend: {
      keyframes: {
    'color-fade': {
      '0%': { color: '#000' },
      '50%': { color: '#ff6600' },
      '100%': { color: '#000' },
    },
  },
  animation: {
    'color-fade': 'color-fade 3s ease-in-out infinite',
  },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
         fontSize:{
       'button': 'clamp(14px, 3.5vw, 18px)',
        'para': 'clamp(1.2em, 1vw + 0.2em, 1.3em)',
        'heading1': 'clamp(3em, 5vw + 0.5em, 5.5em)',
        'heading2': 'clamp(2.4em, 4.5vw + 0.5em, 4.5em)',
        'heading3': 'clamp(2em, 3vw + 0.2em, 2.8em)',
        'heading4': 'clamp(1.5em, 2vw + 0.2em, 2em)',
        'display': 'clamp(6em, 8vw + 1vw, 12em)',
        'footer': 'clamp(40px, 9vw, 80px)',
      },
        zIndex:{
        'preloader-top': '999999',
         'preloader': '9999',
        'header': '999',
        
      },
           colors:{
        'text-brand-black':"#1c2218",
        'brand-black':"#0B0B0A",
        'brand-white':"#F3EFE7",
        'brand-text-dark':"#f7f0bc",
        'brand-accent':"#FDD101", //accent for links, hover state 
        'brand-secondary':"#171717", //blue best
       
      },
      fontFamily:{
        'custom': ["var(--font-custom)", "serif"],
        'custom2': ["var(--font-custom2)", "serif"],
        'body': ["var(--font-body)", "sans-serif"],
      }
    },
  },
  plugins: [],
};
