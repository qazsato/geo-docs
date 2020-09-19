<template>
  <Page>
    <template v-slot:header>
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
        @clickData="onClickData"
        @mouseoutData="onMouseoutData"
        @mouseoverData="onMouseoverData"
      />
    </el-row>
  </Page>
</template>

<script>
import { mapActions } from 'vuex'
import japanmesh from 'japanmesh'
import _ from 'lodash'
import { MESH } from '@/constants/mesh'

export default {
  asyncData({ query }) {
    const code = query.code || null
    const mesh = code ? { code, level: japanmesh.getLevel(code) } : null
    const codes = japanmesh.getCodes(code)
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
      title = MESH[`LEVEL${this.mesh.level}`].TYPE
      return `(${title})`
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

      if (this.code.length >= MESH.LEVEL1.DIGIT) {
        breadcrumbs.push({
          path: `/meshes?code=${this.code.slice(0, MESH.LEVEL1.DIGIT)}`,
          name: '1次メッシュ(80km)',
        })
      }
      if (this.code.length >= MESH.LEVEL2.DIGIT) {
        breadcrumbs.push({
          path: `/meshes?code=${this.code.slice(0, MESH.LEVEL2.DIGIT)}`,
          name: '2次メッシュ(10km)',
        })
      }

      if (this.code.length >= MESH.LEVEL3.DIGIT) {
        breadcrumbs.push({
          path: `/meshes?code=${this.code.slice(0, MESH.LEVEL3.DIGIT)}`,
          name: '3次メッシュ(1km)',
        })
      }

      if (this.code.length >= MESH.LEVEL4.DIGIT) {
        breadcrumbs.push({
          path: `/meshes?code=${this.code.slice(0, MESH.LEVEL4.DIGIT)}`,
          name: '4次メッシュ(500m)',
        })
      }

      if (this.code.length >= MESH.LEVEL5.DIGIT) {
        breadcrumbs.push({
          path: `/meshes?code=${this.code.slice(0, MESH.LEVEL5.DIGIT)}`,
          name: '5次メッシュ(250m)',
        })
      }

      if (this.code.length >= MESH.LEVEL6.DIGIT) {
        breadcrumbs.push({
          path: `/meshes?code=${this.code.slice(0, MESH.LEVEL6.DIGIT)}`,
          name: '6次メッシュ(125m)',
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
          if (japanmesh.getLevel(code) !== 6) {
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
      const shape = this.meshShapes.filter((m) => m.properties.code === code)[0]
      const coords = _.flatten(shape.geometry.coordinates)
      const northernmost = _.maxBy(coords, (c) => c[1])
      const westernmost = _.minBy(coords, (c) => c[0])
      const easternmost = _.maxBy(coords, (c) => c[0])

      return new this.google.maps.LatLng(northernmost[1], (westernmost[0] + easternmost[0]) / 2)
    },

    searchMeshCode() {
      this.$router.push({ path: '/meshes', query: { code: this.query } })
    },
  },

  head() {
    return {
      title: this.title,
    }
  },

  watchQuery: ['code'],
}
</script>

<style lang="scss" scoped>
.title-container {
  display: flex;
  align-items: center;
  padding-bottom: 5px;
  @include sp() {
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
    @include sp() {
      margin: 10px 0 5px;
      width: 100%;
    }
  }
}
</style>
