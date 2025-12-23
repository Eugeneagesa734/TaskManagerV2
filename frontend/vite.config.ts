import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(), 
    reactRouter(), 
    tsconfigPaths(),
    // Custom plugin to handle Chrome DevTools requests
    {
      name: 'ignore-devtools-requests',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.includes('/.well-known/appspecific/')) {
            res.statusCode = 204; // No Content
            res.end();
            return;
          }
          next();
        });
      },
    },
  ],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-router',
      'react-router-dom',
      'react-hook-form',
      'zod',
      '@hookform/resolvers/zod',
      'sonner',
      '@tanstack/react-query',
      'axios',
      '@radix-ui/react-label',
      '@radix-ui/react-slot',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
    host: true,
    strictPort: true,
    port: 5173,
    hmr: {
      overlay: false,
    },
  },
});