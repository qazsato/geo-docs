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
      <el-row>
        <el-pagination
          v-if="count"
          layout="prev, pager, next"
          :page-size="count.limit"
          :total="count.total"
          :current-page="page"
          class="mesh-pager"
          @current-change="changePage"
        ></el-pagination>
      </el-row>
    </template>
  </Page>
</template>

<script>
import config from '@/config'
import axios from 'axios'
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

  async asyncData({ query }) {
    const code = query.code || null
    const limit = 100
    const page = query.page ? Number(query.page) : 1
    const offset = (page - 1) * limit
    const meshSearchRes = await axios.get(
      `${config.geo.api_url}/meshes/search`,
      {
        params: {
          code,
          limit,
          offset,
          access_token: config.geo.access_token,
        },
      }
    )
    const meshes = meshSearchRes.data
    const count = {
      limit,
      offset,
      total: Number(meshSearchRes.headers['x-total-count']),
    }
    let meshShapes = null
    const codes = meshes.map((mesh) => mesh.code)
    const meshShapeRes = await axios.get(
      `${config.geo.api_url}/meshes/shapes`,
      {
        params: {
          codes: codes.toString(),
          access_token: config.geo.access_token,
        },
      }
    )
    meshShapes = meshShapeRes.data

    let mesh = null
    if (query.code) {
      const meshRes = await axios.get(`${config.geo.api_url}/meshes`, {
        params: {
          codes: query.code,
          access_token: config.geo.access_token,
        },
      })
      mesh = meshRes.data[0]
    }

    return {
      mesh,
      meshShapes,
      meshes,
      count,
      page,
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

      if (this.mesh === null) {
        return breadcrumbs
      }

      this.mesh.details.forEach((d) => {
        const path = `/meshes?code=${d.code}`
        if (d.level === 1) {
          breadcrumbs.push({ path, name: '2次メッシュ(10km)' })
        } else if (d.level === 2) {
          breadcrumbs.push({ path, name: '3次メッシュ(1km)' })
        } else if (d.level === 3) {
          breadcrumbs.push({ path, name: '4次メッシュ(500m)' })
        } else if (d.level === 4) {
          breadcrumbs.push({ path, name: '5次メッシュ(250m)' })
        }
      })
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

    changePage(page) {
      const code = this.mesh.code
      this.$router.push({ path: '/meshes', query: { code, page } })
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
        const features = meshShape.features
        for (const feature of features) {
          const coordinates = feature.geometry.coordinates
          if (feature.geometry.type === 'MultiPolygon') {
            for (const c of coordinates) {
              coords = coords.concat(_.flatten(c))
            }
          } else if (feature.geometry.type === 'Polygon') {
            coords = coords.concat(_.flatten(coordinates))
          }
        }
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
      const shape = this.meshShapes.filter(
        (m) => m.features[0].properties.code === code
      )[0]
      const coords = _.flatten(shape.features[0].geometry.coordinates)
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

  watchQuery: ['code', 'page'],
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

.mesh-pager {
  display: flex;
  justify-content: center;
}
</style>
