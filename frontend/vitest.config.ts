import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "happy-dom",
    setupFiles: ["./test/setup.ts"],
    globals: true,
    coverage: {
      include: [
        "app/**/*.{ts,tsx}",
        "components/products/**/*.{ts,tsx}",
        "components/raw-materials/**/*.{ts,tsx}",
        "components/production/**/*.{ts,tsx}",
        "lib/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/__tests__/**",
        "components/ui/**",
        "app/layout.tsx",
        "app/providers.tsx",
        "lib/utils.ts",
        "lib/api-client.ts",
      ],
    },
  },
});
