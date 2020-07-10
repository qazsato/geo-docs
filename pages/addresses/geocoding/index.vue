<template>
  <el-container>
    <el-header>
      <Header title="逆ジオコーディング" active="/addresses/geocoding" />
    </el-header>
    <el-main>
      <div id="map"></div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="index" label="#" width="50"></el-table-column>
        <el-table-column prop="location" label="LatLng"></el-table-column>
        <el-table-column prop="name" label="Name"></el-table-column>
        <el-table-column prop="code" label="Code"></el-table-column>
        <el-table-column prop="level" label="Level"></el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import config from '@/config'
import axios from 'axios'
import Header from '@/components/Header'

export default {
  components: {
    Header
  },

  head() {
    return { script: [{ src: config.google_maps.api_url }] }
  },

  data() {
    return {
      map: null,
      latLng: null,
      marker: null,
      tableData: []
    }
  },

  watch: {
    async latLng(val) {
      if (this.marker) {
        this.marker.setMap(null)
      }
      this.marker = new window.google.maps.Marker({
        position: val,
        map: this.map
      })

      const api = `${config.geo.api_url}/addresses/geocoding`
      const res = await axios.get(`${api}?locations=${val.lat()},${val.lng()}`)
      const address = res.data[0]

      this.tableData.unshift({
        index: this.tableData.length + 1,
        location: `${val.lat()},${val.lng()}`,
        name: address.name,
        code: address.code,
        level: address.level
      })
    }
  },

  mounted() {
    this.createMap()
  },

  methods: {
    createMap() {
      const position = new window.google.maps.LatLng(35.689568, 139.691717)
      this.map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: position,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: config.google_maps.theme.dark,
        clickableIcons: false,
        disableDefaultUI: true,
        zoomControl: true
      })
      this.map.addListener('click', e => (this.latLng = e.latLng))
    }
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
