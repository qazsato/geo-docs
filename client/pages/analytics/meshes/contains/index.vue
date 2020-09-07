<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/analytics/meshes/contains" />
    </template>
    <div ref="map" class="map"></div>

    <section class="search-area">
      <el-row>
        <el-radio v-model="level" label="1">1次メッシュ(80km)</el-radio>
        <el-radio v-model="level" label="2">2次メッシュ(10km)</el-radio>
        <el-radio v-model="level" label="3">3次メッシュ(1km)</el-radio>
        <el-radio v-model="level" label="4">4次メッシュ(500m)</el-radio>
        <el-radio v-model="level" label="5">5次メッシュ(250m)</el-radio>
        <el-radio v-model="level" label="6">6次メッシュ(125m)</el-radio>
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
import japanmesh from 'japanmesh'
import config from '@/config'
import GoogleMapsApiLoader from 'google-maps-api-loader'

export default {
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
      return this.latLngs.map((latLng) => {
        return {
          lat: latLng.lat(),
          lng: latLng.lng(),
        }
      })
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
      this.map = new this.google.maps.Map(this.$refs.map, {
        zoom: 14,
        center: position,
        mapTypeId: this.google.maps.MapTypeId.ROADMAP,
        styles: config.map_theme.silver,
        clickableIcons: false,
        disableDefaultUI: true,
        zoomControl: true,
      })
      this.map.addListener('click', (e) => this.latLngs.push(e.latLng))
    },

    onClickAnalyticsButton() {
      const level = Number(this.level)
      this.tableData = this.calcCountGroupByCode(this.locations, level)
    },

    onClickResetButton() {
      this.markers.forEach((marker) => marker.setMap(null))
      this.markers = []
      this.latLngs = []
      this.tableData = []
    },

    calcCountGroupByCode(locations, level) {
      const count = {}
      locations.forEach((location) => {
        const code = japanmesh.toCode(location.lat, location.lng, level)
        if (count[code]) {
          count[code]++
        } else {
          count[code] = 1
        }
      })
      return Object.entries(count).map(([code, count]) => {
        return { code, count }
      })
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
  height: 350px;
}

.search-area {
  padding: 10px 0;

  .el-row {
    padding: 10px;
  }
}
</style>
