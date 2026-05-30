import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      // Proxy /riot-kr/* → https://kr.api.riotgames.com/*
      '/riot-kr': {
        target: 'https://kr.api.riotgames.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/riot-kr/, ''),
      },
      // Proxy /riot-asia/* → https://asia.api.riotgames.com/*
      '/riot-asia': {
        target: 'https://asia.api.riotgames.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/riot-asia/, ''),
      },
    },
  },
})

