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
      <el-submenu index="/address">
        <template slot="title"
          >Address</template
        >
        <el-menu-item index="/address">住所検索</el-menu-item>
        <el-menu-item index="/geocoding">逆ジオコーディング</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      required: true,
      type: String
    },
    active: {
      required: true,
      type: String
    }
  }
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
