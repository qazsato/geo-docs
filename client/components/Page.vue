<template>
  <div>
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <div class="github">
        <Logo href="https://github.com/qazsato/geo-docs" target="_blank" />
        <img src="~/assets/images/github.png" />
      </div>
    </footer>
  </div>
</template>

<script>
import Logo from '@/components/Logo'

export default {
  components: {
    Logo,
  },
}
</script>

<style lang="scss" scoped>
header {
  padding: 0 20px;
}

main {
  min-height: 100vh;
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
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 20px;
    }
  }
}
</style>
