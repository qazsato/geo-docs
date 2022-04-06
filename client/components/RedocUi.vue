<template>
  <div>
    <!-- cf. https://github.com/Redocly/redoc#tldr-final-code-example -->
    <redoc :spec-url="specUrl"></redoc>
    <script src="https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"></script>
  </div>
</template>

<script>
export default {
  props: {
    specUrl: {
      required: true,
      type: String,
    },
  },
}
</script>
