<template>
  <div id="swagger-ui"></div>
</template>

<script>
import SwaggerUI from 'swagger-ui-dist'
import 'swagger-ui-dist/swagger-ui.css'

export default {
  props: {
    specUrl: {
      required: true,
      type: String,
    },
  },

  mounted() {
    const SwaggerUIBundle = SwaggerUI.SwaggerUIBundle
    const SwaggerUIStandalonePreset = SwaggerUI.SwaggerUIStandalonePreset
    SwaggerUIBundle({
      url: this.specUrl,
      validatorUrl: null,
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: 'StandaloneLayout',
      deepLinking: false,
    })
  },
}
</script>
