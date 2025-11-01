import node from '@astrojs/node'
import react from '@astrojs/react'
import { defineConfig } from 'astro/config'

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react({
    babel: {
      plugins: [
        ['babel-plugin-react-compiler']
      ]
    }
  })],
  vite: {
    ssr: {
      noExternal: [
        'modern-normalize',
        '@webtui/css',
        '@webtui/theme-vitesse',
        '@webtui/theme-catppuccin',
        'ccount'
      ]
    }
  }
})
