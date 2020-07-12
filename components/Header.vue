<template>
  <div class="header">
    <h1>{{ title }}</h1>
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
      required: true,
      type: String,
    },
  },
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}

h1 {
  text-decoration: none;
  font-size: 18px;
  color: #303133;
}

.menu {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  border-bottom: none;
}
</style>
