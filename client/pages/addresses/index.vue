<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/addresses" />
    </template>
    <el-row>
      <Breadcrumb v-if="address" :breadcrumbs="breadcrumbs" />
      <div class="title-container">
        <h2 class="address-title">{{ addressTitle }}</h2>
        <el-input v-model="query" placeholder="住所コード" prefix-icon="el-icon-search" @change="searchAddressCode">
        </el-input>
      </div>
      <GoogleMap
        v-loading="loading"
        height="500px"
        :geojsons="geojsons"
        :infowindows="infowindows"
        @clickData="onClickData"
        @mouseoutData="onMouseoutData"
        @mousemoveData="onMousemoveData"
      />
    </el-row>
    <template v-if="addresses.length > 0">
      <el-row>
        <el-table :data="addresses" class="address-table" @row-click="clickAddress">
          <el-table-column prop="code" label="Code" width="130"></el-table-column>
          <el-table-column prop="level" label="Level" width="80"></el-table-column>
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
import { mapActions } from 'vuex'
import GeoApi from '@/requests/geo-api'

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
      query: null,
      parentAddressShape: null,
      childAddressShapes: [],
      geojsons: [],
      infowindows: [],
      loading: false,
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
    async address() {
      await this.fetch()
      await this.loadMap()
      this.google = this.$store.state.map.google
      this.drawAddress()
    },
  },

  async mounted() {
    await this.fetch()
    await this.loadMap()
    this.google = this.$store.state.map.google
    this.drawAddress()
  },

  methods: {
    ...mapActions('map', { loadMap: 'load' }),

    async fetch() {
      this.loading = true
      if (this.address) {
        const shapeApi = new GeoApi('/addresses/shapes', {
          codes: this.address.code,
        })
        const shapeRes = await shapeApi.get()
        this.parentAddressShape = shapeRes.data[0]
      }

      if (this.addresses.length > 0) {
        const codes = this.addresses.map((address) => address.code)
        const shapeApi = new GeoApi('/addresses/shapes', {
          codes: codes.toString(),
        })
        const shapeRes = await shapeApi.get()
        this.childAddressShapes = shapeRes.data
      }
      this.loading = false
    },

    onClickData(event) {
      const code = event.feature.getProperty('code')
      this.$router.push({ path: '/addresses', query: { code } })
    },

    onMouseoutData(event) {
      this.infowindows = []
    },

    onMousemoveData(event) {
      this.infowindows = []
      const addressName = event.feature.getProperty('addressName')
      const infowindow = new this.google.maps.InfoWindow({
        content: addressName,
        position: event.latLng,
        pixelOffset: new this.google.maps.Size(0, -5),
        disableAutoPan: true,
      })
      this.infowindows = [infowindow]
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

    drawAddress() {
      if (this.parentAddressShape) {
        this.geojsons.push(this.parentAddressShape)
      }
      if (this.childAddressShapes) {
        this.childAddressShapes.forEach((geojson) => this.geojsons.push(geojson))
      }
      this.geojsons.forEach((geojson) => {
        let strokeWeight = 1
        let fillOpacity = 0.2
        let zIndex = 2

        const code = geojson.properties.code
        let address
        // 親の住所は外形を強調するため枠を太くする
        if (this.address && this.address.code === code) {
          strokeWeight = 2
          zIndex = 1
          // 最下層(レベル3)以外は中身を塗らない
          if (this.address.level !== 3) {
            fillOpacity = 0
          }
          address = this.address
        } else {
          address = this.addresses.filter((a) => a.code === code)[0]
        }

        geojson.properties.strokeWeight = strokeWeight
        geojson.properties.fillOpacity = fillOpacity
        geojson.properties.zIndex = zIndex
        geojson.properties.addressName = address.details[address.details.length - 1].name
      })
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
.breadcrumb-item {
  margin-bottom: 5px;
}

.title-container {
  display: flex;
  align-items: center;
  padding-bottom: 5px;
  @include xs() {
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
    @include xs() {
      margin: 10px 0 5px;
      width: 100%;
    }
  }
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
