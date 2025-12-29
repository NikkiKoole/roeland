import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig(({ command }) => {
  const base = command === "build" ? "/roeland/" : "/";

  return {
    plugins: [svelte()],
    base,
    publicDir: "public",
  };
});
