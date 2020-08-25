<template>
  <div class="header">
    <div>
      <a class="logo" href="/">Geo Docs 🌏</a>
      <h1 class="title">{{ title }}</h1>
    </div>
    <el-menu
      :default-active="active"
      mode="horizontal"
      class="menu"
      :router="true"
    >
      <el-menu-item index="/">API 仕様書</el-menu-item>
      <el-submenu index="/addresses">
        <template slot="title">Address</template>
        <el-menu-item index="/addresses">住所検索</el-menu-item>
        <el-menu-item index="/addresses/geocoding"
          >逆ジオコーディング</el-menu-item
        >
      </el-submenu>
      <el-submenu index="/meshes">
        <template slot="title">Mesh</template>
        <el-menu-item index="/meshes">地域メッシュ検索</el-menu-item>
      </el-submenu>
      <el-submenu index="/analytics">
        <template slot="title">Analytics</template>
        <el-menu-item index="/analytics/addresses/contains"
          >住所コード解析</el-menu-item
        >
        <el-menu-item index="/analytics/meshes/contains"
          >地域メッシュ解析</el-menu-item
        >
      </el-submenu>
      <el-submenu index="/statistics">
        <template slot="title">Statistics</template>
        <el-menu-item index="/statistics/addresses/population"
          >住所毎の人口統計</el-menu-item
        >
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
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

<style scoped>
.logo {
  margin: 10px 0;
  padding: 5px 12px;
  display: inline-block;
  border-radius: 3px;
  background: #3b4151;
  color: #fff;
  line-height: 19px;
  text-decoration: none;
  font-weight: bold;
}

.title {
  margin-left: 10px;
  display: inline-block;
  text-decoration: none;
  font-size: 18px;
  font-weight: normal;
  color: #303133;
}

.menu {
  display: flex;
  flex: 1;
  width: 100%;
  overflow-x: auto;
}
</style>

<style>
.header .el-menu--horizontal > .el-menu-item,
.header .el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 40px;
  line-height: 40px;
}
</style>
