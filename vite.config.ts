import { defineConfig, loadEnv } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    assetsInclude: ["**/*.epub"],
    define: {
      "process.env": env,
    },
    plugins: [react(), basicSsl()],
  };
});
