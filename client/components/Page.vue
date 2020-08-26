<template>
  <el-container>
    <el-header height="90px">
      <slot name="header"></slot>
    </el-header>
    <el-main>
      <slot></slot>
    </el-main>
    <el-footer height="70px">
      <div class="github">
        <img src="~/assets/images/github.png" />
        <Logo href="https://github.com/qazsato/geo-docs" target="_blank" />
      </div>
    </el-footer>
  </el-container>
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
.el-main {
  min-height: 100vh;
}

.el-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: #3b4151;
}

.github {
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 20px;
  }
}
</style>
