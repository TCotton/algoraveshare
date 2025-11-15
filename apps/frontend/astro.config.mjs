import node from '@astrojs/node'
import react from '@astrojs/react'
import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'
 
const { NODE_ENV } = loadEnv(import.meta.env.NODE_ENV, process.cwd(), '')

if (NODE_ENV === undefined) {
    console.error('NODE_ENV is not defined in .env file')
    process.exit(1)
}

console.log(`NODE_ENV: ${NODE_ENV}`)

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
      server: NODE_ENV === 'development' ? {
          https: {
              key: './localhost-key.pem',
              cert: './localhost.pem',
          },
      } : {},
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
