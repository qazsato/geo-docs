<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/" />
    </template>
    <div id="swagger-ui"></div>
  </Page>
</template>

<script>
import config from '@/config'
import SwaggerUI from 'swagger-ui-dist'
import 'swagger-ui-dist/swagger-ui.css'
import 'swagger-ui-themes/themes/3.x/theme-flattop.css'

export default {
  data() {
    return {
      title: 'API 仕様書',
    }
  },

  mounted() {
    const SwaggerUIBundle = SwaggerUI.SwaggerUIBundle
    const SwaggerUIStandalonePreset = SwaggerUI.SwaggerUIStandalonePreset
    SwaggerUIBundle({
      url: config.geo.api_docs_url,
      validatorUrl: null,
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: 'StandaloneLayout',
      deepLinking: true,
    })
  },

  head() {
    return {
      title: this.title,
    }
  },
}
</script>

<style lang="scss" scoped>
.el-main {
  padding: 0;
}
</style>

<style lang="scss">
#swagger-ui {
  .swagger-ui .info .title small {
    top: 5px;
    left: 5px;
  }

  .swagger-ui .topbar {
    display: none;
  }

  .swagger-ui .info {
    margin: 10px 0;
  }

  .swagger-ui .download-contents {
    width: 85px;
  }

  .swagger-ui .parameter__name.required::after {
    top: -3px;
  }

  .swagger-ui .parameter__name.required span {
    position: relative;
    top: 4px;
  }

  .parameters-col_name,
  .response-col_status {
    width: 180px;
  }

  .swagger-ui table.headers tbody tr td {
    padding: 0;
  }

  .swagger-ui .auth-btn-wrapper .btn {
    margin: 5px 10px;
  }
}
</style>
