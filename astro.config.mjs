import { defineConfig, squooshImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import node from "@astrojs/node";


// https://astro.build/config
export default defineConfig({
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  image: {
    service: squooshImageService()
  },
  integrations: [tailwind(), react()],
  vite: {
    ssr: {
      noExternal: ['three']
    },
    build: {
      rollupOptions: {
        external: ['three']
      }
    },
    optimizeDeps: {
      include: ['three', 'three/examples/jsm/loaders/GLTFLoader.js']
    }
  },
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});