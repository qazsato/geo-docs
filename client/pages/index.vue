<template>
  <Page id="top" :show-footer="false">
    <template #header>
      <Header :title="title" active="/">
        <el-select v-model="ui" size="small">
          <el-option key="stoplight" label="stoplight" value="stoplight" />
          <el-option key="redoc" label="redoc" value="redoc" />
          <el-option key="swagger" label="swagger" value="swagger" />
        </el-select>
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
    }
  },

  computed: {
    specUrl() {
      return config.geo.api_docs_url
    },
  },

  watch: {
    ui(val, oldVal) {
      if (oldVal === null) return
      this.$nextTick(() => this.$router.push({ path: '/', query: { ui: val } }))
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
