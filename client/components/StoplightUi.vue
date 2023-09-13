<template>
  <div>
    <!-- cf. https://docs.stoplight.io/docs/elements/a71d7fcfefcd6-elements-in-html -->
    <!-- eslint-disable -->
    <elements-api :apiDescriptionUrl="specUrl" logo="/favicon.svg" router="hash" class="elements-api"/>
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
    document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:hidden;') // スクロール非許可
  },

  destroyed() {
    document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:auto;') // スクロール許可
  },
}
</script>

<style lang="scss">
.elements-api {
  > div {
    height: calc(100vh - #{$header-height}) !important;
  }
}

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
