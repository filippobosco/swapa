import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// SSR via Vercel adapter — needed for the server-side form endpoint (src/pages/api/lead.ts).
// To deploy on Netlify instead, swap to @astrojs/netlify with the same `output: 'server'`.
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind()],
  site: 'https://swapa.it',
});
