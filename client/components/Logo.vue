<template>
  <a class="logo" :href="href" :target="target">
    <img src="~/assets/images/logo.svg" />
  </a>
</template>

<script>
export default {
  props: {
    href: {
      required: true,
      type: String,
    },
    target: {
      required: false,
      type: String,
      default: null,
    },
  },
}
</script>

<style lang="scss" scoped>
.logo {
  height: 30px;
  width: 110px;

  > img {
    height: 100%;
    width: 100%;
  }
}
</style>
