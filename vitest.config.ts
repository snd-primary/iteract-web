import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "node", // 基本は node 環境
		browser: {
			enabled: true, // ブラウザモードを有効化
			name: "chrome", // 使用するブラウザ
			provider: "webdriver", // または 'playwright'
		},
		setupFiles: ["./src/test/setup.ts"],
		globals: true,
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
