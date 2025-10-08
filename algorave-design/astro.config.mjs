// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  vite: {
      ssr: {
          noExternal: ['modern-normalize', '@webtui/css', '@webtui/theme-vitesse']
      }
  },

  integrations: [preact()]
});