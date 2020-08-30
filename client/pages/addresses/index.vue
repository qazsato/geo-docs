<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/addresses" />
    </template>
    <el-row>
      <el-breadcrumb v-if="address" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/addresses' }">
          <span>全国</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          v-for="(detail, index) in address.details"
          :key="index"
          :to="{ path: '/addresses?code=' + detail.code }"
          class="breadcrumb-item"
        >
          <span>{{ detail.name }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <h2 v-if="address" class="address-title">{{ address.name }}</h2>
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
  </Page>
</template>

<script>
import config from '@/config'
import axios from 'axios'
import _ from 'lodash'
import Page from '@/components/Page'
import Header from '@/components/Header'
import GoogleMapsApiLoader from 'google-maps-api-loader'
const ADDRESS_CODE_LENGTH = {
  LEVEL1: 2,
  LEVEL2: 5,
  LEVEL3: 11,
}
export default {
  components: {
    Page,
    Header,
  },

  async asyncData({ query }) {
    const limit = 100
    const page = query.page ? Number(query.page) : 1
    const offset = (page - 1) * limit
    const addressSearchRes = await axios.get(
      `${config.geo.api_url}/addresses/search`,
      {
        params: {
          code: query.code,
          limit,
          offset,
          access_token: config.geo.access_token,
        },
      }
    )
    const addresses = addressSearchRes.data
    const count = {
      limit,
      offset,
      total: Number(addressSearchRes.headers['x-total-count']),
    }

    let address = null
    if (query.code) {
      const addressRes = await axios.get(`${config.geo.api_url}/addresses`, {
        params: {
          codes: query.code,
          access_token: config.geo.access_token,
        },
      })
      address = addressRes.data[0]
    }

    return {
      address,
      addresses,
      count,
      page,
    }
  },

  data() {
    return {
      title: '住所検索',
      google: null,
      map: null,
      addressShapes: [],
    }
  },

  watch: {
    address() {
      this.$nextTick(() => this.init())
    },
  },

  mounted() {
    this.init()
  },

  methods: {
    async init() {
      await this.fetch()
      this.createMap()
    },

    async fetch() {
      const codes = this.addresses.map((address) => address.code)
      const geoAddressRes = await axios.get(
        `${config.geo.api_url}/addresses/shapes`,
        {
          params: {
            codes: codes.toString(),
            access_token: config.geo.access_token,
          },
        }
      )
      this.addressShapes = geoAddressRes.data
    },

    clickAddress(address) {
      if (address.code.length === ADDRESS_CODE_LENGTH.LEVEL3) {
        return
      }
      const code = address.code
      this.$router.push({ path: '/addresses', query: { code } })
      window.scrollTo(0, 0)
    },

    changePage(page) {
      const code = this.address ? this.address.code : undefined
      this.$router.push({ path: '/addresses', query: { code, page } })
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

      this.addressShapes.forEach((addressShape) => {
        this.map.data.addGeoJson(addressShape)
      })
      this.map.data.setStyle({
        strokeWeight: 1,
        strokeColor: '#409eff',
        fillColor: '#409eff',
        fillOpacity: 0.2,
      })
      this.map.data.addListener('click', (event) => {
        const code = event.feature.getProperty('code')
        if (code.length === ADDRESS_CODE_LENGTH.LEVEL3) {
          return
        }
        this.$router.push({ path: '/addresses', query: { code } })
      })

      let coords = []
      for (const addressShape of this.addressShapes) {
        const features = addressShape.features
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
.address-search {
  width: 250px;
  margin-left: auto;
}

.breadcrumb-item {
  margin-bottom: 10px;
}

.address-title {
  font-size: 18px;
  color: #303133;
  padding-top: 5px;
}

#map {
  margin: 20px 0 0;
  width: 100%;
  height: 450px;
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
