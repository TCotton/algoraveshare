import { defineConfig } from 'astro/config';
import node from '@astrojs/node';     // ✅ import the adapter function
import react from '@astrojs/react';

export default defineConfig({
    output: 'server', // enables SSR
    adapter: node({ mode: 'standalone' }), // ✅ call the adapter function
    vite: {
        ssr: {
            noExternal: ['modern-normalize', '@webtui/css', '@webtui/theme-vitesse'],
        },
    },
    integrations: [react()],
});
