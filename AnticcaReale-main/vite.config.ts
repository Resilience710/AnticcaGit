import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin: Convert CSS <link> to non-render-blocking in production
function asyncCssPlugin(): Plugin {
  return {
    name: 'async-css',
    enforce: 'post',
    transformIndexHtml(html) {
      // Match Vite-injected CSS link tags
      return html.replace(
        /<link rel="stylesheet"([^>]*?) href="(\/assets\/[^"]+\.css)"([^>]*?)>/g,
        (_, before, href, after) =>
          `<link rel="preload" as="style"${before} href="${href}"${after} onload="this.onload=null;this.rel='stylesheet'">` +
          `<noscript><link rel="stylesheet" href="${href}"></noscript>`
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), asyncCssPlugin()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/storage'],
          firestore: ['firebase/firestore'],
          icons: ['lucide-react'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: ['.sandbox.novita.ai', 'localhost'],
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    }
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: ['.sandbox.novita.ai', 'localhost'],
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    }
  },
})
