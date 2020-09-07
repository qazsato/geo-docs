<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/addresses" />
    </template>
    <el-row>
      <Breadcrumb v-if="address" :breadcrumbs="breadcrumbs" />
      <div class="title-container">
        <h2 class="address-title">{{ addressTitle }}</h2>
        <el-input
          v-model="query"
          placeholder="住所コード"
          prefix-icon="el-icon-search"
          @change="searchAddressCode"
        >
        </el-input>
      </div>
      <div ref="map" class="map"></div>
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
import GoogleMapsApiLoader from 'google-maps-api-loader'
import { adjustViewPort } from '@/utils/map'
import { toLocations } from '@/utils/geojson'
import GeoApi from '@/requests/geo_api'

export default {
  async asyncData({ query }) {
    const limit = 100
    const page = query.page ? Number(query.page) : 1
    const offset = (page - 1) * limit

    const searchApi = new GeoApi('/addresses/search', {
      code: query.code,
      limit,
      offset,
    })
    const searchRes = await searchApi.get()
    const addresses = searchRes.data
    const count = {
      limit,
      offset,
      total: Number(searchRes.headers['x-total-count']),
    }

    let address = null
    if (query.code) {
      const addressApi = new GeoApi('/addresses', { codes: query.code })
      const addressRes = await addressApi.get()
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
      query: null,
      parentAddressShape: null,
      childAddressShape: null,
    }
  },

  computed: {
    addressTitle() {
      if (!this.address) {
        return '全国'
      }
      return this.address.name
    },

    breadcrumbs() {
      const breadcrumbs = []
      breadcrumbs.push({
        path: '/addresses',
        name: '全国',
      })
      if (this.address === null) {
        return breadcrumbs
      }
      this.address.details.forEach((d) => {
        breadcrumbs.push({
          path: `/addresses?code=${d.code}`,
          name: d.name,
        })
      })
      return breadcrumbs
    },
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
      if (this.address) {
        const shapeApi = new GeoApi('/addresses/shape', {
          codes: this.address.code,
        })
        const shapeRes = await shapeApi.get()
        this.parentAddressShape = shapeRes.data
      }

      if (this.addresses.length > 0) {
        const codes = this.addresses.map((address) => address.code)
        const shapeApi = new GeoApi('/addresses/shape', {
          codes: codes.toString(),
        })
        const shapeRes = await shapeApi.get()
        this.childAddressShape = shapeRes.data
      }
    },

    clickAddress(address) {
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
      this.map = new this.google.maps.Map(this.$refs.map, {
        zoom: 18,
        center: position,
        mapTypeId: this.google.maps.MapTypeId.ROADMAP,
        styles: config.map_theme.silver,
        clickableIcons: false,
        disableDefaultUI: true,
        zoomControl: true,
      })

      this.map.data.addGeoJson(this.parentAddressShape)
      this.map.data.addGeoJson(this.childAddressShape)
      this.map.data.setStyle((feature) => {
        const color = '#409eff'
        const code = feature.getProperty('code')
        if (this.address && this.address.code === code) {
          // 最下層の場合は、枠を太くして中身を塗る
          if (this.addresses.length === 0) {
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
        this.$router.push({ path: '/addresses', query: { code } })
      })
      const locations = toLocations(
        this.parentAddressShape || this.childAddressShape
      )
      adjustViewPort(this.google, this.map, locations)
    },

    searchAddressCode() {
      this.$router.push({ path: '/addresses', query: { code: this.query } })
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

  .address-title {
    flex: 1;
    font-size: 18px;
    color: #303133;
    padding-top: 5px;
  }

  .el-input {
    width: 200px;
    @include bp_sp() {
      margin: 10px 0 5px;
      width: 100%;
    }
  }
}

.map {
  margin: 10px 0 0;
  width: 100%;
  height: 450px;
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
