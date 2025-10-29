import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
        dedupe: ["lexical", "@lexical/react", "@lexical/list", "@lexical/rich-text", "@lexical/code", "@lexical/link", "@lexical/markdown", "@lexical/utils", "@lexical/selection", "@lexical/table", "@lexical/plain-text"],
    },
    optimizeDeps: {
        // Exclude Lexical root packages from pre-bundling; we import specific subpaths.
        exclude: ["lexical", "@lexical/react", "@lexical/list", "@lexical/rich-text", "@lexical/code", "@lexical/link", "@lexical/markdown", "@lexical/utils", "@lexical/selection", "@lexical/table", "@lexical/plain-text"],
    },
});

// Removed duplicate trailing block
