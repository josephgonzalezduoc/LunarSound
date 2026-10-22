import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setup.js",
    coverage: {
      provider: "v8",
      include: [
        "src/App.jsx",
        "src/utils/*.js",
        "src/components/*.jsx",
        "src/pages/*.jsx",
      ],
      reporter: ["text", "html", "json-summary"],
    },
  },
});
