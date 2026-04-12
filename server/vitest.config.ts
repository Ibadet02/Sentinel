import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./src/__tests__/setup.ts"],
    env: {
      DATABASE_URL:
        "postgresql://sentinel:sentinel_dev@localhost:5432/sentinel_test_db",
    },
  },
});
