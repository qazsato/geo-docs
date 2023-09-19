<template>
  <div class="header">
    <div class="flex">
      <Logo href="/" />
      <h1 class="title">{{ title }}</h1>
      <div class="spacer"></div>
      <slot></slot>
      <el-switch v-model="darkTheme" size="small" active-text="☾" inactive-text="☀️" class="theme-switch" />
    </div>
    <el-menu
      :default-active="active"
      mode="horizontal"
      class="menu"
      :router="true"
      :background-color="backgroundColor"
      :text-color="textColor"
      active-text-color="#00ced1"
    >
      <el-menu-item index="/">API 仕様書</el-menu-item>
      <el-submenu index="/addresses">
        <template slot="title">Address</template>
        <el-menu-item index="/addresses/about">住所について</el-menu-item>
        <el-menu-item index="/addresses">住所検索</el-menu-item>
        <el-menu-item index="/addresses/geocoding">逆ジオコーディング</el-menu-item>
      </el-submenu>
      <el-submenu index="/meshes">
        <template slot="title">Mesh</template>
        <el-menu-item index="/meshes/about">地域メッシュについて</el-menu-item>
        <el-menu-item index="/meshes">地域メッシュ検索</el-menu-item>
      </el-submenu>
      <el-submenu index="/analytics">
        <template slot="title">Analytics</template>
        <el-menu-item index="/analytics/addresses/contains">住所コード解析</el-menu-item>
        <el-menu-item index="/analytics/meshes/contains">地域メッシュ解析</el-menu-item>
      </el-submenu>
      <el-submenu index="/statistics">
        <template slot="title">Statistics</template>
        <el-menu-item index="/statistics/addresses/population">住所毎の人口統計</el-menu-item>
      </el-submenu>
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

  data() {
    return {
      darkTheme: false,
    }
  },

  computed: {
    backgroundColor() {
      return this.darkTheme ? '#1a212d' : '#fff'
    },

    textColor() {
      return this.darkTheme ? '#fff' : '#303133'
    },
  },

  watch: {
    darkTheme(val) {
      const theme = val ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    },
  },

  mounted() {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark') {
      this.darkTheme = true
    }
  },
}
</script>

<style lang="scss" scoped>
.header {
  height: $header-height;

  .flex {
    display: flex;
    align-items: center;
    padding-top: 8px;
  }

  .spacer {
    flex: 1;
  }

  .title {
    margin: 0;
    padding-left: 10px;
    display: inline-block;
    text-decoration: none;
    font-size: 18px;
    line-height: 1;
    font-weight: normal;
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

  .theme-switch {
    margin-left: 16px;
  }
}
</style>

<style lang="scss">
.header .el-menu.el-menu--horizontal {
  border-bottom: none;
}

.header .el-menu--horizontal > .el-menu-item,
.header .el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 39px;
  line-height: 39px;
}
</style>
