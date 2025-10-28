import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import react from '@astrojs/react'

const compilerConfig = {
  target: '19', // can be '17' | '18' | '19', default is 19
}

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react({
    babel: {
      plugins: [
        ['babel-plugin-react-compiler', compilerConfig],
      ],
    },
  })],
  vite: {
    ssr: {
      noExternal: [
        'modern-normalize',
        '@webtui/css',
        '@webtui/theme-vitesse',
        '@webtui/theme-catppuccin',
      ],
    },
  },
})
