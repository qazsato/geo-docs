<template>
  <div>
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer v-if="showFooter">
      <div class="github">
        <a href="https://github.com/qazsato/geo-docs" target="_blank">
          <img src="~/assets/images/github.png" />
        </a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    showFooter: {
      required: true,
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style lang="scss" scoped>
header {
  padding: 0 20px;
}

main {
  padding: 20px;
}

footer {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: #3b4151;

  .github {
    img {
      width: 26px;
    }
  }
}
</style>
