<template>
  <Page>
    <template #header>
      <Header :title="title" active="/analytics/meshes/contains" />
    </template>
    <GoogleMap
      height="500px"
      :geojsons="geojsons"
      :markers="markers"
      :infowindows="infowindows"
      auto-adjust-geojsons
      @click="onClick"
      @mouseoutData="onMouseoutData"
      @mouseoverData="onMouseoverData"
    />
    <section class="search-area">
      <el-row class="condition-row">
        <div class="radio-area">
          <el-radio v-model="level" label="1">1次メッシュ(80km)</el-radio>
          <el-radio v-model="level" label="2">2次メッシュ(10km)</el-radio>
          <el-radio v-model="level" label="3">3次メッシュ(1km)</el-radio>
          <el-radio v-model="level" label="4">4次メッシュ(500m)</el-radio>
          <el-radio v-model="level" label="5">5次メッシュ(250m)</el-radio>
          <el-radio v-model="level" label="6">6次メッシュ(125m)</el-radio>
        </div>
        <div v-if="tableData.length > 0">
          <el-switch v-model="isVisiblePolygon" active-text="ポリゴン"> </el-switch>
          <el-switch v-model="isVisibleMarker" active-text="マーカー"></el-switch>
        </div>
      </el-row>
      <el-row class="button-row">
        <div class="button-container">
          <el-button type="primary" :disabled="latLngs.length === 0" @click="onClickAnalyticsButton"
            >解析する</el-button
          >

          <el-button type="danger" :disabled="latLngs.length === 0" @click="onClickResetButton">削除する</el-button>
        </div>
      </el-row>
    </section>
    <el-table :data="tableData" :default-sort="{ prop: 'count', order: 'descending' }" style="width: 100%">
      <el-table-column prop="code" label="Code" sortable></el-table-column>
      <el-table-column prop="count" label="count" sortable></el-table-column>
    </el-table>
  </Page>
</template>

<script>
import { mapActions } from 'vuex'
import japanmesh from 'japanmesh'
import _ from 'lodash'

export default {
  data() {
    return {
      title: '地域メッシュ解析',
      google: null,
      latLngs: [],
      geojsons: [],
      markers: [],
      infowindows: [],
      tableData: [],
      level: '3',
      isVisiblePolygon: false,
      isVisibleMarker: false,
    }
  },

  head() {
    return {
      title: this.title,
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
      })
      this.markers.push(marker)
      this.isVisibleMarker = true
    },

    isVisiblePolygon() {
      this.togglePolygon()
    },

    isVisibleMarker() {
      this.toggleMarker()
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
      this.isVisiblePolygon = false
      this.isVisibleMarker = true
    },

    onMouseoutData(event) {
      this.infowindows = []
    },

    onMouseoverData(event) {
      const code = event.feature.getProperty('code')
      const count = event.feature.getProperty('count')
      const position = this.getInfowindowPosition(code)
      const infowindow = new this.google.maps.InfoWindow({
        content: `${code} : ${count}件`,
        position,
        disableAutoPan: true,
      })
      this.infowindows = [infowindow]
    },

    onClickAnalyticsButton() {
      const level = Number(this.level)
      const counts = this.calcCountGroupByCode(this.locations, level)
      this.tableData = counts
      const max = Math.max(...counts.map((c) => c.count))
      this.geojsons = []
      counts.forEach((c) => {
        const opacity = (c.count / max) * 0.9
        const geojson = japanmesh.toGeoJSON(c.code, {
          code: c.code,
          count: c.count,
          strokeWeight: 1,
          fillOpacity: opacity,
        })
        this.geojsons.push(geojson)
      })
      this.isVisiblePolygon = true
      this.isVisibleMarker = false
    },

    onClickResetButton() {
      this.geojsons = []
      this.markers = []
      this.latLngs = []
      this.tableData = []
      this.isVisiblePolygon = false
      this.isVisibleMarker = false
    },

    getInfowindowPosition(code) {
      const shape = this.geojsons.filter((g) => g.properties.code === code)[0]
      const coords = _.flatten(shape.geometry.coordinates)
      const northernmost = _.maxBy(coords, (c) => c[1])
      const westernmost = _.minBy(coords, (c) => c[0])
      const easternmost = _.maxBy(coords, (c) => c[0])

      return new this.google.maps.LatLng(northernmost[1], (westernmost[0] + easternmost[0]) / 2)
    },

    calcCountGroupByCode(locations, level) {
      const count = {}
      locations.forEach((location) => {
        try {
          const code = japanmesh.toCode(location.lat, location.lng, level)
          if (count[code]) {
            count[code]++
          } else {
            count[code] = 1
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(e)
        }
      })
      return Object.entries(count).map(([code, count]) => {
        return { code, count }
      })
    },

    togglePolygon() {
      const geojsons = this.geojsons
      this.geojsons = []
      geojsons.forEach((geojson) => {
        geojson.properties.visible = this.isVisiblePolygon
        this.geojsons.push(geojson)
      })
    },

    toggleMarker() {
      this.markers.forEach((marker) => {
        marker.setVisible(this.isVisibleMarker)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.search-area {
  padding: 10px 0;

  .el-row {
    padding: 10px;
  }

  .condition-row {
    display: flex;
    align-items: center;
    @include xs() {
      flex-direction: column;
      align-items: self-end;
    }

    .radio-area {
      flex: 1;
      @include xs() {
        margin-bottom: 10px;
      }
    }
  }

  .button-row {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
