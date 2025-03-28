import {
    defineNuxtModule,
    createResolver,
    addPlugin,
    addServerHandler,
    addImportsDir,
    addComponent,
    addLayout
} from "@nuxt/kit";
import type { NuxtModule } from '@nuxt/schema';

// You can define module options interface
export interface ModuleOptions {
    // Define your module options here
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
        apiEndpoint: '/api/purchase-list',
        storageName: 'purchase-list'
    },

    setup(options, nuxt) {
      const resolver = createResolver(import.meta.url)
  
      // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
      addPlugin(resolver.resolve('./runtime/plugin'))
      
      // Uncomment the following if you need these features
      // // Add composables to be auto-imported
      // addImportsDir(resolver.resolve('./runtime/composables'));
      
      // // Add components for auto-registration
      // addComponent({
      //     name: 'PurchaseList',
      //     filePath: resolver.resolve('./runtime/components/PurchaseList.vue')
      // });
      
      // // Add a layout
      // addLayout({
      //     src: resolver.resolve('./runtime/layouts/default.vue'),
      // }, 'purchase-list');
      
      // // Add server routes (API endpoints)
      // addServerHandler({
      //     route: options.apiEndpoint,
      //     handler: resolver.resolve('./runtime/server/api/purchase-list')
      // });
      
      // // Make options available to runtime
      // nuxt.options.runtimeConfig.public.purchaseList = {
      //     ...options
      // };
    }
});