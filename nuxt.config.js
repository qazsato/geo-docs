// eslint-disable-next-line nuxt/no-cjs-in-config
module.exports = {
  srcDir: 'client/',

  ssr: true,

  target: 'server',

  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    GEO_API_KEY: process.env.GEO_API_KEY,
  },

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

  loading: { color: '#00CED1' },

  css: ['element-ui/lib/theme-chalk/index.css', 'github-markdown-css/github-markdown.css'],

  styleResources: {
    scss: ['@/assets/styles/core.scss'],
  },

  plugins: ['@/plugins/element-ui'],

  components: true,

  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/stylelint-module', '@nuxtjs/style-resources'],

  modules: ['@nuxtjs/axios', '@nuxtjs/google-gtag'],

  axios: {},

  'google-gtag': {
    id: 'UA-51346952-5', // GA
    debug: false,
    config: {
      send_page_view: false, // PVの重複送信防止
    },
    additionalAccounts: [
      {
        id: 'G-W9P6XK7L1H', // GA4
      },
    ],
  },

  build: {
    transpile: [/^element-ui/],
    // $ npm run dev で 下記の Warn が発生するので設定
    // WARN  Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-private-methods.
    babel: {
      presets({ isServer }, [preset, options]) {
        options.loose = true
      },
    },
  },
}
