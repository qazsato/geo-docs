<template>
  <div>
    <!-- cf. https://docs.stoplight.io/docs/elements/a71d7fcfefcd6-elements-in-html -->
    <!-- eslint-disable -->
    <elements-api :apiDescriptionUrl="specUrl" logo="/favicon.svg" router="hash" />
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

  mounted() {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  },
}
</script>

<style lang="scss">
[data-theme='dark'] {
  // ダークモードだとコードハイライトの視認性が低いためオフにする
  .sl-code-highlight {
    .token {
      color: #fff !important;
    }
  }
  // サイドバーの背景
  .sl-elements-api {
    background-color: var(--color-canvas-pure);
  }
}
</style>
