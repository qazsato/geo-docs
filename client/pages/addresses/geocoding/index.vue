<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/addresses/geocoding" />
    </template>
    <GoogleMap height="500px" :markers="markers" @click="onClick" />
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
import { mapActions } from 'vuex'
import GeoApi from '@/requests/geo-api'

export default {
  data() {
    return {
      title: '逆ジオコーディング',
      latLng: null,
      tableData: [],
      google: null,
      markers: [],
    }
  },

  watch: {
    async latLng(val) {
      const marker = new this.google.maps.Marker({ position: val })
      this.markers = [marker]

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

  async mounted() {
    await this.loadMap()
    this.google = this.$store.state.map.google
  },

  methods: {
    ...mapActions('map', { loadMap: 'load' }),

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
