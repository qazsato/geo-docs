<template>
  <div>
    <!-- cf. https://docs.stoplight.io/docs/elements/a71d7fcfefcd6-elements-in-html -->
    <!-- eslint-disable -->
    <elements-api :apiDescriptionUrl="specUrl" />
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
