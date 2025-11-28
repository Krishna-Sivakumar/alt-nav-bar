import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { readFile, writeFile } from "node:fs/promises";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {},
    }),
    {
      name: "tsify",
      closeBundle: async () => {
        const html = await readFile("dist/index.html", "utf8");
        const css = await readFile("dist/calorie-table.css", "utf8");
        const js = await readFile("dist/calorie-table.js", "utf8");

        const content = `<style>${css.replaceAll("\n", "")}</style>\n${html}`;

        await writeFile(
          "./dist/calorie-table.html.ts",
          `export default ${JSON.stringify(content)}`,
        );
        await writeFile(
          "./dist/calorie-table.script.ts",
          `export default ${JSON.stringify(js)}`,
        );
      },
    },
  ],
  build: {
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: "calorie-table.js",
        assetFileNames: "calorie-table.[ext]",
      },
    },
  },
});
