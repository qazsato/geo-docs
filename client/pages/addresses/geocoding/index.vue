<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/addresses/geocoding" />
    </template>
    <GoogleMap @load="onLoad" @click="onClick" />
    <el-table
      :data="tableData"
      :default-sort="{ prop: 'index', order: 'descending' }"
      style="width: 100%;"
    >
      <el-table-column
        prop="index"
        label="#"
        width="100"
        sortable
      ></el-table-column>
      <el-table-column
        prop="location"
        label="LatLng"
        sortable
      ></el-table-column>
      <el-table-column prop="name" label="Name" sortable></el-table-column>
      <el-table-column prop="code" label="Code" sortable></el-table-column>
      <el-table-column prop="level" label="Level" sortable></el-table-column>
    </el-table>
  </Page>
</template>

<script>
import GeoApi from '@/requests/geo_api'

export default {
  data() {
    return {
      title: '逆ジオコーディング',
      google: null,
      map: null,
      latLng: null,
      marker: null,
      tableData: [],
    }
  },

  watch: {
    async latLng(val) {
      if (this.marker) {
        this.marker.setMap(null)
      }
      this.marker = new this.google.maps.Marker({
        position: val,
        map: this.map,
      })

      const api = new GeoApi('/addresses/geocoding', {
        locations: `${val.lat()},${val.lng()}`,
      })
      const res = await api.get()
      const address = res.data[0]

      this.tableData.unshift({
        index: this.tableData.length + 1,
        location: `${val.lat()},${val.lng()}`,
        name: address.name,
        code: address.code,
        level: address.level,
      })
    },
  },

  methods: {
    onLoad(google, map) {
      this.google = google
      this.map = map
    },

    onClick(e) {
      this.latLng = e.latLng
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
.map {
  width: 100%;
  height: 500px;
}
</style>
