import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
	app: {
		head: {
			title: "Shopping List Module",
		},
	},

	devtools: { enabled: true },
	modules: ["../src/module", "@nuxt/icon"],
	css: ["./src/runtime/assets/scss/global.scss"],
	compatibilityDate: "2025-03-09",
});
