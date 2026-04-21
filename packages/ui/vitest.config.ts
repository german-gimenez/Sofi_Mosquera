import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    // Legacy tsx script-style test using process.exit(). Run with `tsx` instead.
    exclude: ["**/node_modules/**", "src/lib/cloudinary.test.ts"],
  },
});
