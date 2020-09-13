<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/analytics/addresses/contains" />
    </template>
    <GoogleMap height="500px" :markers="markers" @click="onClick" />

    <section class="search-area">
      <el-row>
        <el-radio v-model="level" label="1">Lv.1 都道府県</el-radio>
        <el-radio v-model="level" label="2">Lv.2 市区町村</el-radio>
        <el-radio v-model="level" label="3">Lv.3 町丁・字等</el-radio>
        <el-button
          type="primary"
          :disabled="latLngs.length === 0"
          @click="onClickAnalyticsButton"
          >住所コードで分ける</el-button
        >

        <el-button
          type="danger"
          :disabled="latLngs.length === 0"
          @click="onClickResetButton"
          >リセットする</el-button
        >
      </el-row>
    </section>
    <el-table
      :data="tableData"
      :default-sort="{ prop: 'count', order: 'descending' }"
      style="width: 100%;"
    >
      <el-table-column prop="code" label="Code" sortable></el-table-column>
      <el-table-column prop="name" label="Name" sortable></el-table-column>
      <el-table-column prop="count" label="count" sortable></el-table-column>
    </el-table>
  </Page>
</template>

<script>
import { mapActions } from 'vuex'
import GeoApi from '@/requests/geo_api'

export default {
  data() {
    return {
      title: '住所コード解析',
      google: null,
      latLngs: [],
      markers: [],
      tableData: [],
      level: '1',
    }
  },

  computed: {
    locations() {
      const locations = []
      this.latLngs.forEach((latLngs) => {
        locations.push(`${latLngs.lat()},${latLngs.lng()}`)
      })
      return locations
    },
  },

  watch: {
    latLngs(val) {
      const latLng = val[val.length - 1]
      const marker = new this.google.maps.Marker({
        position: latLng,
      })
      this.markers.push(marker)
    },
  },

  async mounted() {
    await this.loadMap()
    this.google = this.$store.state.map.google
  },

  methods: {
    ...mapActions('map', { loadMap: 'load' }),

    onClick(e) {
      this.latLngs.push(e.latLng)
    },

    async onClickAnalyticsButton() {
      const api = new GeoApi('/analytics/addresses/contains', {
        locations: this.locations,
        level: this.level,
      })
      const res = await api.post()
      this.tableData = []
      res.data.forEach((d) => {
        this.tableData.push({
          code: d.address.code,
          name: d.address.name,
          count: d.count,
        })
      })
    },

    onClickResetButton() {
      this.markers = []
      this.latLngs = []
      this.tableData = []
    },
  },

  head() {
    return {
      title: this.title,
    }
  },
}
</script>

<style lang="scss" scoped>
.search-area {
  padding: 10px 0;
}

.search-area .el-row {
  padding: 10px;
}
</style>
