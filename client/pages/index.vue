<template>
  <Page id="top">
    <template #header>
      <Header :title="title" active="/">
        <!-- <el-radio-group v-model="radio" size="mini">
          <el-radio-button label="Redoc"></el-radio-button>
          <el-radio-button label="Swagger"></el-radio-button>
        </el-radio-group> -->
      </Header>
    </template>
    <!-- <template v-if="radio === 'Redoc'">
      <RedocUi :spec-url="specUrl" />
    </template>
    <template v-else>
      <SwaggerUi :spec-url="specUrl" />
    </template> -->
  </Page>
</template>

<script>
import config from '@/config'

export default {
  data() {
    return {
      title: 'API 仕様書',
      radio: 'Redoc',
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
