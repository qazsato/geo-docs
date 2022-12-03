// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'client/',

  // TODO:
  // env: {
  //   GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  //   GEO_API_KEY: process.env.GEO_API_KEY,
  // },

  css: ['@/assets/styles/element-plus.scss', 'github-markdown-css/github-markdown.css'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/core.scss" as *;'
        }
      }
    }
  },

  app: {
    head: {
      titleTemplate: '%s - Geo Docs',
      htmlAttrs: { lang: 'ja' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Geo API (地理空間情報) の仕様書です',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
      ],
    },
  }

  // TODO:
  // buildModules: [
  //   '@nuxtjs/eslint-module',
  //   '@nuxtjs/stylelint-module',
  //   '@nuxtjs/style-resources',
  //   [
  //     '@nuxtjs/google-analytics',
  //     {
  //       id: 'UA-51346952-5',
  //     },
  //   ],
  // ],
})
