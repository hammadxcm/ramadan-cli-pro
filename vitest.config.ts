import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["src/**/*.test.ts"],
		coverage: {
			provider: "v8",
			include: ["src/**/*.ts"],
			exclude: [
				"src/**/*.test.ts",
				"src/__tests__/**",
				"src/tui/**",
				"src/cli.ts",
				"src/main.ts",
				"src/types/**",
				"src/**/index.ts",
				"src/**/*.interface.ts",
				"src/**/*.d.ts",
				"src/errors/error-codes.ts",
			],
		},
	},
});
