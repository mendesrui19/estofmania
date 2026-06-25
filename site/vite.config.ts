import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: [
        'chrome >= 64',
        'firefox >= 67',
        'safari >= 12',
        'ios >= 12',
        'edge >= 79',
        'android >= 64',
      ],
      modernPolyfills: true,
      renderLegacyChunks: true,
    }),
  ],
  appType: 'spa',
})
