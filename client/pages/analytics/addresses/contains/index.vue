<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/analytics/addresses/contains" />
    </template>
    <GoogleMap
      height="500px"
      :geojsons="geojsons"
      :markers="markers"
      :infowindows="infowindows"
      @click="onClick"
      @mouseoutData="onMouseoutData"
      @mousemoveData="onMousemoveData"
    />
    <section class="search-area">
      <el-row>
        <el-radio v-model="level" label="1">Lv.1 都道府県</el-radio>
        <el-radio v-model="level" label="2">Lv.2 市区町村</el-radio>
        <el-radio v-model="level" label="3">Lv.3 町丁・字等</el-radio>
      </el-row>
      <el-row class="button-row">
        <div class="button-container">
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
        </div>

        <div v-if="tableData.length > 0">
          <el-switch
            v-model="isVisiblePolygon"
            active-text="ポリゴン"
          ></el-switch>
          <el-switch
            v-model="isVisibleMarker"
            active-text="マーカー"
          ></el-switch>
        </div>
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
      geojsons: [],
      markers: [],
      infowindows: [],
      tableData: [],
      level: '2',
      isVisiblePolygon: false,
      isVisibleMarker: false,
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
      const shapeApi = new GeoApi('/addresses/shape', {
        codes: codes.toString(),
      })
      const shapeRes = await shapeApi.get()
      this.geojsons = []
      shapeRes.data.features.forEach((feature) => {
        const d = res.data.filter(
          (d) => d.address.code === feature.properties.code
        )[0]
        const opacity = (d.count / max) * 0.9
        feature.properties.count = d.count
        feature.properties.addressName = d.address.name
        feature.properties.strokeWeight = 1
        feature.properties.fillOpacity = opacity
      })
      this.geojsons.push(shapeRes.data)

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

    togglePolygon() {
      const geojsons = this.geojsons
      this.geojsons = []
      geojsons.forEach((geojson) => {
        geojson.features.forEach((f) => {
          f.properties.visible = this.isVisiblePolygon
        })
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
@import '@/assets/styles/core.scss';

.search-area {
  padding: 10px 0;

  .el-row {
    padding: 10px;
  }

  .button-row {
    display: flex;
    align-items: center;
    @include bp_sp() {
      flex-direction: column;
      align-items: self-end;
    }

    .button-container {
      flex: 1;
      @include bp_sp() {
        margin-bottom: 15px;
      }
    }
  }
}
</style>
