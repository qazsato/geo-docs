<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/analytics/meshes/contains" />
    </template>
    <div id="map"></div>

    <section class="search-area">
      <el-row>
        <el-radio v-model="level" label="1">1次メッシュ(80km)</el-radio>
        <el-radio v-model="level" label="2">2次メッシュ(10km)</el-radio>
        <el-radio v-model="level" label="3">3次メッシュ(1km)</el-radio>
        <el-radio v-model="level" label="4">4次メッシュ(500m)</el-radio>
        <el-radio v-model="level" label="5">5次メッシュ(250m)</el-radio>
      </el-row>
      <el-row>
        <el-button
          type="primary"
          :disabled="latLngs.length === 0"
          @click="onClickAnalyticsButton"
          >地域メッシュコード毎に区分する</el-button
        >

        <el-button
          type="danger"
          :disabled="latLngs.length === 0"
          @click="onClickResetButton"
          >マーカーをリセットする</el-button
        >
      </el-row>
    </section>
    <el-table
      :data="tableData"
      :default-sort="{ prop: 'count', order: 'descending' }"
      style="width: 100%;"
    >
      <el-table-column prop="code" label="Code" sortable></el-table-column>
      <el-table-column prop="count" label="count" sortable></el-table-column>
    </el-table>
  </Page>
</template>

<script>
import config from '@/config'
import axios from 'axios'
import Page from '@/components/Page'
import Header from '@/components/Header'
import GoogleMapsApiLoader from 'google-maps-api-loader'

export default {
  components: {
    Page,
    Header,
  },

  data() {
    return {
      title: '地域メッシュ解析',
      google: null,
      map: null,
      latLngs: [],
      markers: [],
      tableData: [],
      level: '3',
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
        map: this.map,
      })
      this.markers.push(marker)
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
        styles: config.google_maps.theme.silver,
        clickableIcons: false,
        disableDefaultUI: true,
        zoomControl: true,
      })
      this.map.addListener('click', (e) => this.latLngs.push(e.latLng))
    },

    async onClickAnalyticsButton() {
      const api = `${config.geo.api_url}/analytics/meshes/contains`
      const res = await axios.post(api, {
        locations: this.locations,
        level: this.level,
        access_token: config.geo.access_token,
      })
      this.tableData = []
      res.data.forEach((d) => {
        this.tableData.push({
          code: d.mesh.code,
          count: d.count,
        })
      })
    },

    onClickResetButton() {
      this.markers.forEach((marker) => marker.setMap(null))
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
#map {
  width: 100%;
  height: 350px;
  background-color: #ebeef5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-area {
  padding: 10px 0;

  .el-row {
    padding: 10px;
  }
}
</style>
