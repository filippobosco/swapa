/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Palette ufficiale brand SWAPA (vedi §3 del brief)
        accent: {
          DEFAULT: '#4ECBA8', // verde acqua / teal — colore-firma CTA & hover
          alt: '#34D4A8',     // variante presente nel sorgente del sito
        },
        'accent-ink': '#0A3D2E', // verde scuro — testo su accent
        ink: '#0A0A0A',          // nero profondo — sfondo principale
        cloud: '#F0F0F0',        // grigio chiaro
        muted: '#888888',        // testo secondario
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      // Pesi numerici Poppins usati nel design system (font-300 … font-900)
      fontWeight: {
        300: '300',
        400: '400',
        500: '500',
        700: '700',
        800: '800',
        900: '900',
      },
      letterSpacing: {
        widest2: '0.2em',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};
