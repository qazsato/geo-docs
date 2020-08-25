<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/statistics/addresses/population" />
    </template>
    <div>WIP</div>
  </Page>
</template>

<script>
import Page from '@/components/Page'
import Header from '@/components/Header'

export default {
  components: {
    Page,
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
