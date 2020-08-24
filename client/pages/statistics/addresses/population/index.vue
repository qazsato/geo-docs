<template>
  <el-container>
    <el-header>
      <Header :title="title" active="/statistics/addresses/population" />
    </el-header>
    <el-main>
      <div>WIP</div>
    </el-main>
  </el-container>
</template>

<script>
import Header from '@/components/Header'

export default {
  components: {
    Header,
  },

  data() {
    return {
      title: '住所毎の人口統計',
    }
  },

  head() {
    return {
      title: this.title,
    }
  },
}
</script>
