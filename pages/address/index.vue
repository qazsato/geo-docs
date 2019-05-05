<template>
  <el-container>
    <el-header class="header">
      <h1>
        <router-link :to="{ path: '/' }">Address Search</router-link>
      </h1>
      <el-input
        v-model="word"
        class="address-search"
        placeholder="Type address name"
        prefix-icon="el-icon-search"
      >
      </el-input>
    </el-header>
    <el-main>
      <el-row v-if="address">
        <h2 class="address-name">{{ address.name }}</h2>
        <div id="map"></div>
      </el-row>
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
    </el-main>
  </el-container>
</template>

<script>
import config from '@/config'
import axios from 'axios'
import _ from 'lodash'

// TODO: ローディング追加
// TODO: 画面遷移後最上部に移動
// TODO: 最下層までいったときの表示制御
// TODO: ヘッダーの検索ボックス有効化
// TODO: パンくずリスト追加

export default {
  head() {
    return { script: [{ src: config.google_maps.api_url }] }
  },

  data() {
    return {
      word: '',
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
        `${config.geo.api_url}/addresses/${query.code}`
      )
      address = addressRes.data

      // TODO: レベル3のポリゴンデータが未作成のため一旦コメントアウト
      if (query.code.length <= 5) {
        const geoAddressRes = await axios.get(
          `${config.geo.api_url}/addresses/shapes/${query.code}`
        )
        addressShape = geoAddressRes.data
      }
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
    },

    changePage(page) {
      const code = this.address ? this.address.code : undefined
      this.$router.push({ path: '/address', query: { code, page } })
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
        styles: config.google_maps.styles,
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
.header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}

.header .nuxt-link-active {
  text-decoration: none;
  color: #333;
}

.address-search {
  width: 250px;
  margin-left: auto;
}

.address-name {
  color: #333;
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
