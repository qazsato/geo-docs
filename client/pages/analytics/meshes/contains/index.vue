<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/analytics/meshes/contains" />
    </template>
    <GoogleMap height="500px" :markers="markers" @click="onClick" />
    <section class="search-area">
      <el-row>
        <el-radio v-model="level" label="1">1次メッシュ(80km)</el-radio>
        <el-radio v-model="level" label="2">2次メッシュ(10km)</el-radio>
        <el-radio v-model="level" label="3">3次メッシュ(1km)</el-radio>
        <el-radio v-model="level" label="4">4次メッシュ(500m)</el-radio>
        <el-radio v-model="level" label="5">5次メッシュ(250m)</el-radio>
        <el-radio v-model="level" label="6">6次メッシュ(125m)</el-radio>
      </el-row>
      <el-row class="button-row">
        <div class="button-container">
          <el-button
            type="primary"
            :disabled="latLngs.length === 0"
            @click="onClickAnalyticsButton"
            >解析する</el-button
          >

          <el-button
            type="danger"
            :disabled="latLngs.length === 0"
            @click="onClickResetButton"
            >リセットする</el-button
          >
        </div>

        <div v-if="tableData.length > 0">
          <el-switch v-model="isVisibleMesh" active-text="メッシュ">
          </el-switch>
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
      <el-table-column prop="count" label="count" sortable></el-table-column>
    </el-table>
  </Page>
</template>

<script>
import { mapActions } from 'vuex'
import japanmesh from 'japanmesh'

export default {
  data() {
    return {
      title: '地域メッシュ解析',
      google: null,
      latLngs: [],
      markers: [],
      tableData: [],
      level: '3',
      isVisibleMesh: true,
      isVisibleMarker: true,
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

    isVisibleMesh() {
      this.toggleMesh()
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
    },

    onClickAnalyticsButton() {
      const level = Number(this.level)
      const counts = this.calcCountGroupByCode(this.locations, level)
      this.tableData = counts
      const max = Math.max(...counts.map((c) => c.count))
      this.map.data.forEach((feature) => this.map.data.remove(feature))
      counts.forEach((c) => {
        const geojson = japanmesh.toGeoJSON(c.code, { count: c.count })
        this.map.data.addGeoJson(geojson)
      })
      this.map.data.setStyle((feature) => {
        const count = feature.getProperty('count')
        const opcity = (count / max) * 0.9
        return {
          strokeWeight: 1,
          strokeColor: '#409eff',
          fillColor: '#409eff',
          fillOpacity: opcity,
        }
      })
    },

    onClickResetButton() {
      this.map.data.forEach((feature) => this.map.data.remove(feature))
      this.markers.forEach((marker) => marker.setMap(null))
      this.markers = []
      this.latLngs = []
      this.tableData = []
      this.isVisibleMesh = true
      this.isVisibleMarker = true
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

    toggleMesh() {
      this.map.data.forEach((feature) => {
        this.map.data.overrideStyle(feature, { visible: this.isVisibleMesh })
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
