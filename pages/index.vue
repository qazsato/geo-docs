<template>
  <div id="swagger-ui"></div>
</template>

<script>
import config from '@/config'
import SwaggerUI from 'swagger-ui-dist'
import 'swagger-ui-dist/swagger-ui.css'
import 'swagger-ui-themes/themes/3.x/theme-flattop.css'

export default {
  mounted() {
    const SwaggerUIBundle = SwaggerUI.SwaggerUIBundle
    const SwaggerUIStandalonePreset = SwaggerUI.SwaggerUIStandalonePreset
    SwaggerUIBundle({
      url: config.geo.api_docs_url,
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: 'StandaloneLayout',
      deepLinking: true
    })
  }
}
</script>

<style>
.swagger-ui .info .title small {
  top: 5px;
  left: 5px;
}

.swagger-ui .topbar {
  display: none;
}

.swagger-ui .info {
  margin: 20px 0;
}

.swagger-ui .download-contents {
  width: 85px;
}

.swagger-ui .parameter__name.required:after {
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
