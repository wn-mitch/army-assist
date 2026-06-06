import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  build:{
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Define manual chunks
          react: ['react', 'react-dom'],
          vendor: ['zustand', 'clsx'],
        },
      },
    },
  }
});
