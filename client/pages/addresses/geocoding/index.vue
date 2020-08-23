<template>
  <el-container>
    <el-header>
      <Header title="逆ジオコーディング" active="/addresses/geocoding" />
    </el-header>
    <el-main>
      <div id="map"></div>
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
    </el-main>
  </el-container>
</template>

<script>
import config from '@/config'
import axios from 'axios'
import Header from '@/components/Header'
import GoogleMapsApiLoader from 'google-maps-api-loader'

export default {
  components: {
    Header,
  },

  data() {
    return {
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

      const api = `${config.geo.api_url}/addresses/geocoding`
      const res = await axios.get(api, {
        params: {
          location: `${val.lat()},${val.lng()}`,
          access_token: config.geo.access_token,
        },
      })
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
    this.google = await GoogleMapsApiLoader({
      apiKey: config.google_maps.api_key,
    })
    this.createMap()
  },

  methods: {
    createMap() {
      const position = new this.google.maps.LatLng(35.689568, 139.691717)
      this.map = new this.google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: position,
        mapTypeId: this.google.maps.MapTypeId.ROADMAP,
        styles: config.google_maps.theme.retro,
        clickableIcons: false,
        disableDefaultUI: true,
        zoomControl: true,
      })
      this.map.addListener('click', (e) => (this.latLng = e.latLng))
    },
  },
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
