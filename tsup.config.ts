import { defineConfig } from "tsup";

export default defineConfig([
	{
		entry: { cli: "src/cli.ts" },
		format: ["esm"],
		target: "node20",
		platform: "node",
		banner: { js: "#!/usr/bin/env node" },
		clean: true,
		sourcemap: true,
	},
	{
		entry: { index: "src/main.ts" },
		format: ["esm"],
		target: "node20",
		platform: "node",
		dts: true,
		clean: false,
		sourcemap: true,
	},
]);
