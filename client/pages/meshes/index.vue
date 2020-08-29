<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/meshes" />
    </template>
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="index"
          :to="{ path: breadcrumb.path }"
        >
          <span>{{ breadcrumb.name }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div id="map"></div>
    </el-row>
    <template v-if="meshes.length > 0">
      <el-row>
        <el-table :data="meshes" class="mesh-table" @row-click="clickMesh">
          <el-table-column prop="code" label="Code"></el-table-column>
          <el-table-column prop="level" label="Level"></el-table-column>
        </el-table>
      </el-row>
    </template>
  </Page>
</template>

<script>
import japanmesh from 'japanmesh'
import config from '@/config'
import _ from 'lodash'
import Page from '@/components/Page'
import Header from '@/components/Header'
import GoogleMapsApiLoader from 'google-maps-api-loader'
const MESH_CODE_LENGTH = {
  LEVEL1: 4,
  LEVEL2: 6,
  LEVEL3: 8,
  LEVEL4: 9,
  LEVEL5: 10,
}

export default {
  components: {
    Page,
    Header,
  },

  asyncData({ query }) {
    const code = query.code || null
    const level = code ? japanmesh.getLevel(code) + 1 : 1
    const codes = japanmesh.getCodes(code)
    const meshes = codes.map((c) => {
      return { code: c, level }
    })
    const meshShapes = codes.map((c) => {
      return japanmesh.toGeoJSON(c, { code: c })
    })

    let mesh = null
    if (query.code) {
      mesh = { code, level }
    }

    return {
      code,
      mesh,
      meshShapes,
      meshes,
    }
  },

  data() {
    return {
      title: '地域メッシュ検索',
      google: null,
      map: null,
      marker: null,
      infowindow: null,
    }
  },

  computed: {
    breadcrumbs() {
      const breadcrumbs = []
      breadcrumbs.push({
        path: '/meshes',
        name: '1次メッシュ(80km)',
      })

      if (this.code === null) {
        return breadcrumbs
      }

      if (this.code.length >= MESH_CODE_LENGTH.LEVEL1) {
        breadcrumbs.push({
          path: `/meshes?code=${this.code.slice(0, MESH_CODE_LENGTH.LEVEL1)}`,
          name: '2次メッシュ(10km)',
        })
      }
      if (this.code.length >= MESH_CODE_LENGTH.LEVEL2) {
        breadcrumbs.push({
          path: `/meshes?code=${this.code.slice(0, MESH_CODE_LENGTH.LEVEL2)}`,
          name: '3次メッシュ(1km)',
        })
      }

      if (this.code.length >= MESH_CODE_LENGTH.LEVEL3) {
        breadcrumbs.push({
          path: `/meshes?code=${this.code.slice(0, MESH_CODE_LENGTH.LEVEL3)}`,
          name: '4次メッシュ(500m)',
        })
      }

      if (this.code.length >= MESH_CODE_LENGTH.LEVEL4) {
        breadcrumbs.push({
          path: `/meshes?code=${this.code.slice(0, MESH_CODE_LENGTH.LEVEL4)}`,
          name: '5次メッシュ(250m)',
        })
      }

      return breadcrumbs
    },
  },

  watch: {
    meshes() {
      this.$nextTick(() => this.createMap())
    },
  },

  mounted() {
    this.createMap()
  },

  methods: {
    clickMesh(mesh) {
      if (mesh.code.length === MESH_CODE_LENGTH.LEVEL5) {
        return
      }
      const code = mesh.code
      this.$router.push({ path: '/meshes', query: { code } })
      window.scrollTo(0, 0)
    },

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
      this.map.data.setStyle({
        strokeWeight: 1,
        strokeColor: '#409eff',
        fillColor: '#409eff',
        fillOpacity: 0.2,
      })
      this.map.data.addListener('click', (event) => {
        const code = event.feature.getProperty('code')
        if (code.length === MESH_CODE_LENGTH.LEVEL5) {
          return
        }
        this.$router.push({ path: '/meshes', query: { code } })
      })

      this.map.data.addListener('mouseout', (event) => {
        this.infowindow.setMap(null)
        this.infowindow = null
      })

      this.map.data.addListener('mouseover', (event) => {
        const code = event.feature.getProperty('code')
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
#map {
  margin: 20px 0 0;
  width: 100%;
  height: 450px;
  background-color: #ebeef5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mesh-table {
  margin: 20px 0;
}

.mesh-table >>> .el-table__row {
  cursor: pointer;
}
</style>
