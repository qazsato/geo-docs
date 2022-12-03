<template>
  <div class="header">
    <div class="flex">
      <Logo href="/" />
      <h1 class="title">{{ title }}</h1>
      <div class="spacer"></div>
      <slot></slot>
    </div>
    <el-menu :default-active="active" mode="horizontal" class="menu" :router="true">
      <el-menu-item index="/">API 仕様書</el-menu-item>
      <el-sub-menu index="/addresses">
        <template #title>Address</template>
        <el-menu-item index="/addresses/about">住所について</el-menu-item>
        <el-menu-item index="/addresses">住所検索</el-menu-item>
        <el-menu-item index="/addresses/geocoding">逆ジオコーディング</el-menu-item>
      </el-sub-menu>
      <!-- <el-sub-menu index="/meshes">
        <template #title>Mesh</template>
        <el-menu-item index="/meshes/about">地域メッシュについて</el-menu-item>
        <el-menu-item index="/meshes">地域メッシュ検索</el-menu-item>
      </el-sub-menu> -->
      <!-- <el-sub-menu index="/analytics">
        <template #title>Analytics</template>
        <el-menu-item index="/analytics/addresses/contains">住所コード解析</el-menu-item>
        <el-menu-item index="/analytics/meshes/contains">地域メッシュ解析</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="/statistics">
        <template #title>Statistics</template>
        <el-menu-item index="/statistics/addresses/population">住所毎の人口統計</el-menu-item>
      </el-sub-menu> -->
    </el-menu>
  </div>
</template>

<script>
import Logo from '@/components/Logo'

export default {
  components: {
    Logo,
  },

  props: {
    title: {
      required: true,
      type: String,
    },
    active: {
      required: false,
      type: String,
      default: null,
    },
  },
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}

.spacer {
  flex: 1;
}

.title {
  margin-left: 10px;
  display: inline-block;
  text-decoration: none;
  font-size: 18px;
  font-weight: normal;
  color: #303133;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu {
  display: flex;
  flex: 1;
  width: 100%;
  overflow-x: auto;
}
</style>

<style lang="scss">
.header .el-menu--horizontal > .el-menu-item,
.header .el-menu--horizontal > .el-sub-menu .el-sub-menu__title {
  height: 40px;
  line-height: 40px;
}
</style>
