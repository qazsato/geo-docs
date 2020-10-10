<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/analytics/addresses/contains" />
    </template>
    <GoogleMap
      v-loading="loading"
      height="500px"
      :geojsons="geojsons"
      :markers="markers"
      :infowindows="infowindows"
      @click="onClick"
      @mouseoutData="onMouseoutData"
      @mousemoveData="onMousemoveData"
    />
    <section class="search-area">
      <el-row class="condition-row">
        <div class="radio-area">
          <el-radio v-model="level" label="1">Lv.1 都道府県</el-radio>
          <el-radio v-model="level" label="2">Lv.2 市区町村</el-radio>
          <el-radio v-model="level" label="3">Lv.3 町丁・字等</el-radio>
        </div>
        <div v-if="tableData.length > 0">
          <el-switch v-model="isVisiblePolygon" active-text="ポリゴン"></el-switch>
          <el-switch v-model="isVisibleMarker" active-text="マーカー"></el-switch>
        </div>
      </el-row>
      <el-row class="button-row">
        <el-button type="primary" :disabled="latLngs.length === 0" @click="onClickAnalyticsButton">解析する</el-button>

        <el-button type="danger" :disabled="latLngs.length === 0" @click="onClickResetButton">削除する</el-button>
      </el-row>
    </section>
    <el-table :data="tableData" :default-sort="{ prop: 'count', order: 'descending' }" style="width: 100%;">
      <el-table-column prop="code" label="Code" sortable></el-table-column>
      <el-table-column prop="name" label="Name" sortable></el-table-column>
      <el-table-column prop="count" label="Count" sortable></el-table-column>
    </el-table>
  </Page>
</template>

<script>
import { mapActions } from 'vuex'
import GeoApi from '@/requests/geo-api'

export default {
  data() {
    return {
      title: '住所コード解析',
      google: null,
      latLngs: [],
      geojsons: [],
      markers: [],
      infowindows: [],
      tableData: [],
      level: '2',
      isVisiblePolygon: false,
      isVisibleMarker: false,
      loading: false,
    }
  },

  computed: {
    locations() {
      const locations = []
      this.latLngs.forEach((latLngs) => {
        const location = {
          lat: latLngs.lat(),
          lng: latLngs.lng(),
        }
        locations.push(location)
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

    onMousemoveData(event) {
      this.infowindows = []
      const count = event.feature.getProperty('count')
      const addressName = event.feature.getProperty('addressName')
      const infowindow = new this.google.maps.InfoWindow({
        content: `${addressName} : ${count}件`,
        position: event.latLng,
        pixelOffset: new this.google.maps.Size(0, -5),
        disableAutoPan: true,
      })
      this.infowindows = [infowindow]
    },

    async onClickAnalyticsButton() {
      this.loading = true
      // テーブル
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

      // 地図ポリゴン
      const max = Math.max(...res.data.map((d) => d.count))
      const codes = res.data.map((d) => d.address.code)
      const shapeApi = new GeoApi('/addresses/shapes', {
        codes: codes.toString(),
      })
      const shapeRes = await shapeApi.get()
      this.geojsons = []
      shapeRes.data.forEach((geojson) => {
        const d = res.data.filter((d) => d.address.code === geojson.properties.code)[0]
        const opacity = (d.count / max) * 0.9
        geojson.properties.count = d.count
        geojson.properties.addressName = d.address.name
        geojson.properties.strokeWeight = 1
        geojson.properties.fillOpacity = opacity
        this.geojsons.push(geojson)
      })

      this.isVisiblePolygon = true
      this.isVisibleMarker = false
      this.loading = false
    },

    onClickResetButton() {
      this.geojsons = []
      this.markers = []
      this.latLngs = []
      this.tableData = []
      this.isVisiblePolygon = false
      this.isVisibleMarker = false
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
