<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item
      v-for="(b, index) in breadcrumbs"
      :key="index"
      :to="{ path: b.path }"
      class="breadcrumb-item"
    >
      <span>{{ b.name }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: {
    breadcrumbs: {
      required: true,
      type: Array,
    },
  },
}
</script>

<style lang="scss" scoped>
.breadcrumb-item {
  margin-bottom: 5px;
}
</style>
