<template>
  <el-container>
    <el-header>
      <Header title="住所検索" active="/addresses" />
    </el-header>
    <el-main>
      <el-row v-if="address">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/address' }">
            <span>全国</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="(detail, index) in address.details"
            :key="index"
            :to="{ path: '/address?code=' + detail.code }"
          >
            <span>{{ detail.name }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <h2 class="address-name">{{ address.name }}</h2>
        <div id="map"></div>
      </el-row>
      <template v-if="addresses.length > 0">
        <el-row>
          <el-table
            :data="addresses"
            class="address-table"
            @row-click="clickAddress"
          >
            <el-table-column
              prop="code"
              label="Code"
              width="130"
            ></el-table-column>
            <el-table-column
              prop="level"
              label="Level"
              width="80"
            ></el-table-column>
            <el-table-column prop="name" label="Name"></el-table-column>
            <el-table-column
              prop="location.lat"
              label="Latitude"
              width="130"
            ></el-table-column>
            <el-table-column
              prop="location.lng"
              label="Longitude"
              width="130"
            ></el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <el-pagination
            v-if="count"
            layout="prev, pager, next"
            :page-size="count.limit"
            :total="count.total"
            :current-page="page"
            class="address-pager"
            @current-change="changePage"
          ></el-pagination>
        </el-row>
      </template>
    </el-main>
  </el-container>
</template>

<script>
import config from '@/config'
import axios from 'axios'
import _ from 'lodash'
import Header from '@/components/Header'

export default {
  components: {
    Header
  },

  head() {
    return { script: [{ src: config.google_maps.api_url }] }
  },

  data() {
    return {
      map: null,
      marker: null
    }
  },

  watch: {
    address() {
      this.$nextTick(() => this.createMap())
    }
  },

  async asyncData({ query }) {
    const limit = 20
    const page = query.page ? Number(query.page) : 1
    const offset = (page - 1) * limit
    const addressSearchRes = await axios.get(
      `${config.geo.api_url}/addresses/search`,
      {
        params: {
          code: query.code,
          limit,
          offset
        }
      }
    )
    const addresses = addressSearchRes.data
    const count = {
      limit,
      offset,
      total: Number(addressSearchRes.headers['x-total-count'])
    }
    let address = null
    let addressShape = null
    if (query.code) {
      const addressRes = await axios.get(
        `${config.geo.api_url}/addresses?codes=${query.code}`
      )
      address = addressRes.data[0]

      const geoAddressRes = await axios.get(
        `${config.geo.api_url}/addresses/shapes?codes=${query.code}`
      )
      addressShape = geoAddressRes.data[0]
    }

    return {
      address,
      addressShape,
      addresses,
      count,
      page
    }
  },

  watchQuery: ['code', 'page'],

  mounted() {
    this.createMap()
  },

  methods: {
    clickAddress(address) {
      const code = address.code
      this.$router.push({ path: '/address', query: { code } })
      window.scrollTo(0, 0)
    },

    changePage(page) {
      const code = this.address ? this.address.code : undefined
      this.$router.push({ path: '/address', query: { code, page } })
      window.scrollTo(0, 0)
    },

    createMap() {
      // TODO: 地図コンポーネント化
      if (this.address === null) {
        return
      }
      const position = new window.google.maps.LatLng(
        this.address.location.lat,
        this.address.location.lng
      )
      this.map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: position,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: config.google_maps.theme.silver,
        clickableIcons: false,
        disableDefaultUI: true,
        zoomControl: true
      })
      this.marker = new window.google.maps.Marker({ position, map: this.map })

      this.map.data.addGeoJson(this.addressShape)
      this.map.data.setStyle({
        strokeWeight: 1,
        strokeColor: '#409eff',
        fillColor: '#409eff',
        fillOpacity: 0.2
      })

      if (this.addressShape) {
        const features = this.addressShape.features
        let coords = []
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
        const northernmost = _.maxBy(coords, c => c[1])
        const southernmost = _.minBy(coords, c => c[1])
        const westernmost = _.minBy(coords, c => c[0])
        const easternmost = _.maxBy(coords, c => c[0])

        // 南西と北西のポイントを指定
        // https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds.constructor
        const shapeBounds = new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(southernmost[1], westernmost[0]),
          new window.google.maps.LatLng(northernmost[1], easternmost[0])
        )
        this.map.fitBounds(shapeBounds)
      }
    }
  }
}
</script>

<style scoped>
.address-search {
  width: 250px;
  margin-left: auto;
}

.address-name {
  font-size: 18px;
  color: #303133;
  padding-top: 15px;
}

#map {
  margin: 20px 0 0;
  width: 100%;
  height: 300px;
  background-color: #ebeef5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.address-table {
  margin: 20px 0;
}

.address-table >>> .el-table__row {
  cursor: pointer;
}

.address-pager {
  display: flex;
  justify-content: center;
}
</style>
