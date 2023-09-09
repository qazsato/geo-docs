<template>
  <Page id="top">
    <template #header>
      <Header :title="title" active="/">
        <el-radio-group v-model="ui" size="mini">
          <el-radio-button label="stoplight"></el-radio-button>
          <el-radio-button label="redoc"></el-radio-button>
          <el-radio-button label="swagger"></el-radio-button>
        </el-radio-group>
      </Header>
    </template>
    <template v-if="ui === 'stoplight'">
      <StoplightUi :spec-url="specUrl" />
    </template>
    <template v-else-if="ui === 'redoc'">
      <RedocUi :spec-url="specUrl" />
    </template>
    <template v-else>
      <SwaggerUi :spec-url="specUrl" />
    </template>
  </Page>
</template>

<script>
import config from '@/config'

export default {
  data() {
    return {
      title: 'API 仕様書',
      ui: null,
    }
  },

  head() {
    return {
      title: this.title,
      script: [{ src: 'https://unpkg.com/@stoplight/elements/web-components.min.js' }],
      link: [{ rel: 'stylesheet', href: 'https://unpkg.com/@stoplight/elements/styles.min.css' }],
    }
  },

  computed: {
    specUrl() {
      return config.geo.api_docs_url
    },
  },

  mounted() {
    const params = new URLSearchParams(window.location.search)
    this.ui = params.get('ui') || 'stoplight'
  },
}
</script>

<style lang="scss">
#top {
  main {
    padding: 0 !important;
  }
}

.swagger-ui {
  .topbar {
    display: none;
  }
}
</style>
