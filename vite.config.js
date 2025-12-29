import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// Vite config for GitHub Pages deployment
export default defineConfig(({ command }) => {
  const base = command === "build" ? "/roeland/" : "/";

  return {
    plugins: [svelte()],
    base,
    publicDir: "public", // Explicitly set public directory
  };
});
