<template>
  <el-container>
    <el-header>
      <Header title="住所コード解析" active="/analytics/addresses/contains" />
    </el-header>
    <el-main>
      <div id="map"></div>

      <section class="search-area">
        <el-row>
          <el-radio v-model="level" label="1">Lv.1 都道府県</el-radio>
          <el-radio v-model="level" label="2">Lv.2 市区町村</el-radio>
          <el-radio v-model="level" label="3">Lv.3 町丁・字等</el-radio>
          <el-button
            type="primary"
            :disabled="latLngs.length === 0"
            @click="onClickAnalyticsButton"
            >住所コード毎に区分する</el-button
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
        <el-table-column prop="name" label="Name" sortable></el-table-column>
        <el-table-column prop="count" label="count" sortable></el-table-column>
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
        styles: config.google_maps.theme.dark,
        clickableIcons: false,
        disableDefaultUI: true,
        zoomControl: true,
      })
      this.map.addListener('click', (e) => this.latLngs.push(e.latLng))
    },

    async onClickAnalyticsButton() {
      const api = `${config.geo.api_url}/analytics/addresses/contains`
      const res = await axios.post(api, {
        locations: this.locations,
        level: this.level,
      })
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
      this.markers.forEach((marker) => marker.setMap(null))
      this.markers = []
      this.latLngs = []
      this.tableData = []
    },
  },
}
</script>

<style scoped>
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
}

.search-area .el-row {
  padding: 10px;
}
</style>
