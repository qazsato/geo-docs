<template>
  <div id="swagger-ui"></div>
</template>

<script>
import config from '@/config'
import SwaggerUI from 'swagger-ui-dist'
import 'swagger-ui-dist/swagger-ui.css'

export default {
  mounted() {
    const SwaggerUIBundle = SwaggerUI.SwaggerUIBundle
    const SwaggerUIStandalonePreset = SwaggerUI.SwaggerUIStandalonePreset
    SwaggerUIBundle({
      url: config.geo.api_docs_url,
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: 'StandaloneLayout'
    })
  }
}
</script>
