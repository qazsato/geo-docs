<template>
  <a class="logo" :href="href" :target="target">
    <span>Geo Docs</span>
    <img src="~/assets/images/earth.svg" />
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
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 120px;
  margin: 10px 0;
  padding: 5px 0;
  border-radius: 3px;
  background: #3b4151;
  color: #fff;
  line-height: 19px;
  text-decoration: none;
  font-weight: bold;

  @include xs() {
    min-width: 36px;
    padding: 8px 0;
  }

  > span {
    margin-right: 6px;

    @include xs() {
      display: none;
    }
  }

  > img {
    width: 20px;
  }
}
</style>
