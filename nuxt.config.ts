// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Shopping List'
    }
  },

  devtools: { enabled: true },
  modules: ['@nuxt/icon'],
  css: ['~/assets/scss/global.scss'],
  compatibilityDate: '2025-03-09',
})