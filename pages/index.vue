<template>
  <el-container>
    <el-header>
      <Header title="API 仕様書" active="/" />
    </el-header>
    <el-main>
      <div id="swagger-ui"></div>
    </el-main>
  </el-container>
</template>

<script>
import config from '@/config'
import SwaggerUI from 'swagger-ui-dist'
import 'swagger-ui-dist/swagger-ui.css'
import 'swagger-ui-themes/themes/3.x/theme-flattop.css'
import Header from '@/components/Header'

export default {
  components: {
    Header,
  },

  mounted() {
    const SwaggerUIBundle = SwaggerUI.SwaggerUIBundle
    const SwaggerUIStandalonePreset = SwaggerUI.SwaggerUIStandalonePreset
    SwaggerUIBundle({
      url: config.geo.api_docs_url,
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: 'StandaloneLayout',
      deepLinking: true,
    })
  },
}
</script>

<style scoped>
.el-main {
  padding: 0;
}
</style>

<style>
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
</style>
