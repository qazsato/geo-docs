<template>
  <el-container>
    <el-header>
      <Header title="住所コード解析" active="/analytics/addresses/contains" />
    </el-header>
    <el-main>
      <div>TODO</div>
    </el-main>
  </el-container>
</template>

<script>
import Header from '@/components/Header'

export default {
  components: {
    Header
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 500px;
  background-color: #ebeef5;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
