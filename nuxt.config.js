// eslint-disable-next-line nuxt/no-cjs-in-config
module.exports = {
  srcDir: 'client/',

  mode: 'universal',

  target: 'server',

  head: {
    titleTemplate: '%s - Geo Docs',
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

  loading: { color: '#409fff' },

  css: ['element-ui/lib/theme-chalk/index.css', 'github-markdown-css/github-markdown.css'],

  styleResources: {
    scss: ['@/assets/styles/core.scss'],
  },

  plugins: ['@/plugins/element-ui'],

  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/style-resources',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-51346952-5',
      },
    ],
  ],

  modules: [
    '@nuxtjs/axios',
    [
      '@nuxtjs/google-adsense',
      {
        id: 'ca-pub-3757647132963072',
      },
    ],
  ],

  axios: {},

  build: {
    transpile: [/^element-ui/],
  },
}
