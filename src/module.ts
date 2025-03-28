import {
	defineNuxtModule,
	createResolver,
	addPlugin,
	addServerHandler,
	addImportsDir,
	addComponent,
	addLayout,
} from "@nuxt/kit";

import { fileURLToPath } from 'url'

// You can define module options interface
export interface ModuleOptions {
	apiEndpoint?: string;
	storageName?: string;
}

export default defineNuxtModule<ModuleOptions>({
	// Module metadata
	meta: {
		name: "purchase-list",
		configKey: "purchaseList",
		compatibility: {
			nuxt: "^3.0.0",
		},
	},

	// Default configuration options of the Nuxt module
	defaults: {
		apiEndpoint: "/api/purchase-list",
		storageName: "purchase-list",
	},

	setup(options, nuxt) {
		const resolver = createResolver(import.meta.url);

		// Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
		addPlugin(resolver.resolve("./runtime/plugin"));
		// // Add components for auto-registration
		addComponent({
			name: "PurchaseList",
			filePath: resolver.resolve("./runtime/components/PurchaseList.vue"),
		});

		addComponent({
			name: "PurchaseItem",
			filePath: resolver.resolve("./runtime/components/PurchaseItem.vue"),
		});

		addComponent({
			name: "PurchaseItems",
			filePath: resolver.resolve(
				"./runtime/components/PurchaseItems.vue"
			),
		});

		addComponent({
			name: "PurchaseItemsMenu",
			filePath: resolver.resolve(
				"./runtime/components/PurchaseItemsMenu.vue"
			),
		});

		addComponent({
			name: "PurchaseHeader",
			filePath: resolver.resolve(
				"./runtime/components/PurchaseHeader.vue"
			),
		});

		addComponent({
			name: "UndoNotifications",
			filePath: resolver.resolve(
				"./runtime/components/UndoNotifications.vue"
			),
		});

		// // Add a layout
		addLayout({
			src: resolver.resolve("./runtime/layouts/default.vue"),
		});

		// // Add server routes (API endpoints)
		addServerHandler({
			route: options.apiEndpoint,
			handler: resolver.resolve("./runtime/server/api/PurchaseListAPI"),
		});

		// // Make options available to runtime
		nuxt.options.runtimeConfig.public.purchaseList = {
			apiEndpoint: options.apiEndpoint!,
			storageName: options.storageName!,
		};
	},
});
