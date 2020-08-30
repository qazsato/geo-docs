<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/meshes" />
    </template>
    <el-row>
      <el-breadcrumb v-if="mesh" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="index"
          :to="{ path: breadcrumb.path }"
          class="breadcrumb-item"
        >
          <span>{{ breadcrumb.name }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
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
      <div id="map"></div>
    </el-row>
  </Page>
</template>

<script>
import japanmesh from 'japanmesh'
import config from '@/config'
import _ from 'lodash'
import Page from '@/components/Page'
import Header from '@/components/Header'
import GoogleMapsApiLoader from 'google-maps-api-loader'
import { MESH } from '@/constants/mesh'

export default {
  components: {
    Page,
    Header,
  },

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
      map: null,
      marker: null,
      infowindow: null,
      query: null,
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
    mesh() {
      this.$nextTick(() => this.createMap())
    },
  },

  mounted() {
    this.createMap()
  },

  methods: {
    async createMap() {
      if (this.google === null) {
        this.google = await GoogleMapsApiLoader({
          apiKey: config.google_maps.api_key,
        })
      }

      const lat = config.default_location.lat
      const lng = config.default_location.lng
      const position = new this.google.maps.LatLng(lat, lng)
      this.map = new this.google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: position,
        mapTypeId: this.google.maps.MapTypeId.ROADMAP,
        styles: config.google_maps.theme.silver,
        clickableIcons: false,
        disableDefaultUI: true,
        zoomControl: true,
      })

      this.meshShapes.forEach((meshShape) => {
        this.map.data.addGeoJson(meshShape)
      })
      this.map.data.setStyle((feature) => {
        const color = '#409eff'
        const code = feature.getProperty('code')
        if (this.mesh && this.mesh.code === code) {
          // 最下層の場合は、枠を太くして中身を塗る
          if (this.meshShapes.length === 1) {
            return {
              strokeWeight: 2,
              strokeColor: color,
              fillColor: color,
              fillOpacity: 0.2,
            }
          }
          // 現在のコードを示すために、枠を太くする(中身を塗らない)
          return {
            strokeWeight: 2,
            strokeColor: color,
            fillOpacity: 0,
          }
        }
        // 配下のコードを示すために、枠を補足して中身を塗る
        return {
          strokeWeight: 1,
          strokeColor: color,
          fillColor: color,
          fillOpacity: 0.2,
        }
      })
      this.map.data.addListener('click', (event) => {
        const code = event.feature.getProperty('code')
        if (this.mesh && this.mesh.level === japanmesh.getLevel(code)) {
          return
        }
        this.$router.push({ path: '/meshes', query: { code } })
      })

      this.map.data.addListener('mouseout', (event) => {
        const code = event.feature.getProperty('code')
        if (this.mesh && this.mesh.level === japanmesh.getLevel(code)) {
          return
        }
        this.infowindow.setMap(null)
        this.infowindow = null
      })

      this.map.data.addListener('mouseover', (event) => {
        const code = event.feature.getProperty('code')
        if (this.mesh && this.mesh.level === japanmesh.getLevel(code)) {
          return
        }
        const position = this.getInfowindowPosition(code)
        this.infowindow = new this.google.maps.InfoWindow({
          content: code,
          position,
          disableAutoPan: true,
        })
        this.infowindow.open(this.map)
      })

      let coords = []
      for (const meshShape of this.meshShapes) {
        const coordinates = meshShape.geometry.coordinates
        coords = coords.concat(_.flatten(coordinates))
        const northernmost = _.maxBy(coords, (c) => c[1])
        const southernmost = _.minBy(coords, (c) => c[1])
        const westernmost = _.minBy(coords, (c) => c[0])
        const easternmost = _.maxBy(coords, (c) => c[0])

        // 南西と北西のポイントを指定
        // https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds.constructor
        const shapeBounds = new this.google.maps.LatLngBounds(
          new this.google.maps.LatLng(southernmost[1], westernmost[0]),
          new this.google.maps.LatLng(northernmost[1], easternmost[0])
        )
        this.map.fitBounds(shapeBounds)
      }
    },

    getInfowindowPosition(code) {
      const shape = this.meshShapes.filter((m) => m.properties.code === code)[0]
      const coords = _.flatten(shape.geometry.coordinates)
      const northernmost = _.maxBy(coords, (c) => c[1])
      const westernmost = _.minBy(coords, (c) => c[0])
      const easternmost = _.maxBy(coords, (c) => c[0])

      return new this.google.maps.LatLng(
        northernmost[1],
        (westernmost[0] + easternmost[0]) / 2
      )
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
@import '@/assets/styles/core.scss';

.breadcrumb-item {
  margin-bottom: 5px;
}

.title-container {
  display: flex;
  align-items: center;
  padding-bottom: 5px;
  @include bp_sp() {
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
    @include bp_sp() {
      margin: 10px 0 5px;
      width: 100%;
    }
  }
}

#map {
  margin: 10px 0 0;
  width: 100%;
  height: 550px;
  background-color: #ebeef5;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
