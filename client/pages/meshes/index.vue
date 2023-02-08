<template>
  <Page>
    <template #header>
      <Header :title="title" active="/meshes" />
    </template>
    <el-row>
      <breadcrumb v-if="mesh" :breadcrumbs="breadcrumbs" />
      <div class="title-container">
        <h2 class="mesh-title">
          <span class="main-title">{{ meshMainTitle }}</span>
          <span class="sub-title">{{ meshSubTitle }}</span>
        </h2>
        <el-input
          v-model="query"
          placeholder="地域メッシュコード"
          prefix-icon="el-icon-search"
          @change="searchMeshCode"
        >
        </el-input>
      </div>
      <GoogleMap
        height="500px"
        :geojsons="geojsons"
        :infowindows="infowindows"
        auto-adjust-geojsons
        @clickData="onClickData"
        @mouseoutData="onMouseoutData"
        @mouseoverData="onMouseoverData"
      />
    </el-row>
  </Page>
</template>

<script>
import { mapActions } from 'vuex'
import { japanmesh } from 'japanmesh'
import { MESH } from '@/constants/mesh'

export default {
  asyncData({ query }) {
    const code = query.code || null
    const level = code ? japanmesh.getLevel(code) : null
    const mesh = code ? { code, level } : null
    const levels = Object.values(MESH).map((m) => m.LEVEL)
    let nextLevel = null
    levels.forEach((l, i) => {
      if (l === level && i < levels.length) {
        nextLevel = levels[i + 1]
      }
    })
    let codes = []
    if (level !== MESH.LEVEL_125.LEVEL) {
      codes = japanmesh.getCodes(code, nextLevel)
    }
    const meshShapes = []
    if (code) {
      meshShapes.push(japanmesh.toGeoJSON(code, { code }))
    }
    codes.forEach((c) => meshShapes.push(japanmesh.toGeoJSON(c, { code: c })))

    return {
      code,
      mesh,
      meshShapes,
    }
  },

  data() {
    return {
      title: '地域メッシュ検索',
      google: null,
      query: null,
      geojsons: [],
      infowindows: [],
    }
  },

  head() {
    return {
      title: this.title,
    }
  },

  computed: {
    meshMainTitle() {
      if (!this.mesh) {
        return '全国'
      }
      return this.mesh.code
    },

    meshSubTitle() {
      let title = ''
      if (!this.mesh) {
        return title
      }
      title = MESH[`LEVEL_${this.mesh.level}`].TYPE
      return title
    },

    breadcrumbs() {
      const breadcrumbs = []
      breadcrumbs.push({
        path: '/meshes',
        name: '全国',
      })

      if (this.code === null) {
        return breadcrumbs
      }

      const bounds = japanmesh.toLatLngBounds(this.code)
      const center = bounds.getCenter()
      const centerLat = center.lat
      const centerLng = center.lng

      const level = japanmesh.getLevel(this.code)
      if (level <= MESH.LEVEL_80000.LEVEL) {
        const code = japanmesh.toCode(centerLat, centerLng, MESH.LEVEL_80000.LEVEL)
        breadcrumbs.push({
          path: `/meshes?code=${code}`,
          name: '80kmメッシュ',
        })
      }

      if (level <= MESH.LEVEL_10000.LEVEL) {
        const code = japanmesh.toCode(centerLat, centerLng, MESH.LEVEL_10000.LEVEL)
        breadcrumbs.push({
          path: `/meshes?code=${code}`,
          name: '10kmメッシュ',
        })
      }

      if (level <= MESH.LEVEL_5000.LEVEL) {
        const code = japanmesh.toCode(centerLat, centerLng, MESH.LEVEL_5000.LEVEL)
        breadcrumbs.push({
          path: `/meshes?code=${code}`,
          name: '5kmメッシュ',
        })
      }

      if (level <= MESH.LEVEL_2000.LEVEL) {
        const code = japanmesh.toCode(centerLat, centerLng, MESH.LEVEL_2000.LEVEL)
        breadcrumbs.push({
          path: `/meshes?code=${code}`,
          name: '2kmメッシュ',
        })
      }

      if (level <= MESH.LEVEL_1000.LEVEL) {
        const code = japanmesh.toCode(centerLat, centerLng, MESH.LEVEL_1000.LEVEL)
        breadcrumbs.push({
          path: `/meshes?code=${code}`,
          name: '1kmメッシュ',
        })
      }

      if (level <= MESH.LEVEL_500.LEVEL) {
        const code = japanmesh.toCode(centerLat, centerLng, MESH.LEVEL_500.LEVEL)
        breadcrumbs.push({
          path: `/meshes?code=${code}`,
          name: '500mメッシュ',
        })
      }

      if (level <= MESH.LEVEL_250.LEVEL) {
        const code = japanmesh.toCode(centerLat, centerLng, MESH.LEVEL_250.LEVEL)
        breadcrumbs.push({
          path: `/meshes?code=${code}`,
          name: '250mメッシュ',
        })
      }

      if (level <= MESH.LEVEL_125.LEVEL) {
        const code = japanmesh.toCode(centerLat, centerLng, MESH.LEVEL_125.LEVEL)
        breadcrumbs.push({
          path: `/meshes?code=${code}`,
          name: '125mメッシュ',
        })
      }

      return breadcrumbs
    },
  },

  watch: {
    async $route() {
      await this.loadMap()
      this.google = this.$store.state.map.google
    },

    mesh() {
      this.$nextTick(() => this.drawMesh())
    },
  },

  watchQuery: ['code'],

  async mounted() {
    await this.loadMap()
    this.google = this.$store.state.map.google
    this.drawMesh()
  },

  methods: {
    ...mapActions('map', { loadMap: 'load' }),

    drawMesh() {
      this.geojsons = this.meshShapes
      this.geojsons.forEach((geojson) => {
        let strokeWeight = 1
        let fillOpacity = 0.2
        let zIndex = 2
        const code = geojson.properties.code
        // 親のメッシュは外形を強調するため枠を太くする
        if (this.mesh && this.mesh.code === code) {
          strokeWeight = 2
          zIndex = 1
          // 最下層(6次メッシュ)以外は中身を塗らない
          if (japanmesh.getLevel(code) !== 125) {
            fillOpacity = 0
          }
        }
        geojson.properties.strokeWeight = strokeWeight
        geojson.properties.fillOpacity = fillOpacity
        geojson.properties.zIndex = zIndex
      })
    },

    onClickData(event) {
      const code = event.feature.getProperty('code')
      if (this.mesh && this.mesh.level === japanmesh.getLevel(code)) {
        return
      }
      this.$router.push({ path: '/meshes', query: { code } })
    },

    onMouseoutData(event) {
      this.infowindows = []
    },

    onMouseoverData(event) {
      const code = event.feature.getProperty('code')
      const position = this.getInfowindowPosition(code)
      const infowindow = new this.google.maps.InfoWindow({
        content: code,
        position,
        disableAutoPan: true,
      })
      this.infowindows = [infowindow]
    },

    getInfowindowPosition(code) {
      const bounds = japanmesh.toLatLngBounds(code)
      return new this.google.maps.LatLng(bounds.getNorthEast().lat, bounds.getCenter().lng)
    },

    searchMeshCode() {
      this.$router.push({ path: '/meshes', query: { code: this.query } })
    },
  },
}
</script>

<style lang="scss" scoped>
.title-container {
  display: flex;
  align-items: center;
  padding-bottom: 5px;
  @include xs() {
    flex-direction: column;
    align-items: start;
  }

  .mesh-title {
    flex: 1;

    .main-title {
      font-size: 18px;
      color: #303133;
    }

    .sub-title {
      font-size: 14px;
      font-weight: normal;
      color: #606266;
    }
  }

  .el-input {
    width: 200px;
    @include xs() {
      margin: 10px 0 5px;
      width: 100%;
    }
  }
}
</style>
