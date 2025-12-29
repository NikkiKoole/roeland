import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { copyFileSync, mkdirSync } from "fs";
import { resolve } from "path";

export default defineConfig(({ command }) => {
  const base = command === "build" ? "/roeland/" : "/";

  return {
    plugins: [
      svelte(),
      {
        name: "copy-data",
        closeBundle() {
          // Copy data folder to dist after build
          const dataFiles = [
            "achievements.json",
            "courses.json",
            "quizzes.json",
            "user-progress.json",
          ];

          mkdirSync("dist/data", { recursive: true });

          dataFiles.forEach((file) => {
            copyFileSync(resolve("data", file), resolve("dist/data", file));
          });
        },
      },
    ],
    base,
  };
});
