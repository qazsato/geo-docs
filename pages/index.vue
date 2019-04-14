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
            prop="coordinate.latitude"
            label="Latitude"
            width="130"
          ></el-table-column>
          <el-table-column
            prop="coordinate.longitude"
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
import axios from 'axios'
import _ from 'lodash'

// TODO: 設定ファイルに移行
const GEO_API = 'http://localhost:4000/v1'
const GOOGLE_MAP_API =
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyBCXUZlw5JVLxyRiNTA9rFZxRiOJj9FXN0'

// TODO: ローディング追加
// TODO: 画面遷移後最上部に移動
// TODO: 最下層までいったときの表示制御
// TODO: ヘッダーの検索ボックス有効化
// TODO: パンくずリスト追加

export default {
  head() {
    return { script: [{ src: GOOGLE_MAP_API }] }
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
    const addressSearchRes = await axios.get(`${GEO_API}/addresses/search`, {
      params: {
        code: query.code,
        limit,
        offset
      }
    })
    const addresses = addressSearchRes.data.items
    const count = addressSearchRes.data.count

    let address = null
    let addressShape = null
    if (query.code) {
      const addressRes = await axios.get(`${GEO_API}/addresses/${query.code}`)
      address = addressRes.data

      // TODO: レベル3のポリゴンデータが未作成のため一旦コメントアウト
      if (query.code.length <= 5) {
        const geoAddressRes = await axios.get(
          `${GEO_API}/geo_addresses/${query.code}`
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
      this.$router.push({ path: '/', query: { code } })
    },

    changePage(page) {
      const code = this.address ? this.address.code : undefined
      this.$router.push({ path: '/', query: { code, page } })
    },

    createMap() {
      // TODO: 地図コンポーネント化
      if (this.address === null) {
        return
      }
      const position = new window.google.maps.LatLng(
        this.address.coordinate.latitude,
        this.address.coordinate.longitude
      )
      this.map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: position,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: this.getMapStyles(),
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
    },

    getMapStyles() {
      return [
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [
            {
              color: '#e9e9e9'
            },
            {
              lightness: 17
            }
          ]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [
            {
              color: '#f5f5f5'
            },
            {
              lightness: 20
            }
          ]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#ffffff'
            },
            {
              lightness: 17
            }
          ]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#ffffff'
            },
            {
              lightness: 29
            },
            {
              weight: 0.2
            }
          ]
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry',
          stylers: [
            {
              color: '#ffffff'
            },
            {
              lightness: 18
            }
          ]
        },
        {
          featureType: 'road.local',
          elementType: 'geometry',
          stylers: [
            {
              color: '#ffffff'
            },
            {
              lightness: 16
            }
          ]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [
            {
              color: '#f5f5f5'
            },
            {
              lightness: 21
            }
          ]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [
            {
              color: '#dedede'
            },
            {
              lightness: 21
            }
          ]
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [
            {
              visibility: 'on'
            },
            {
              color: '#ffffff'
            },
            {
              lightness: 16
            }
          ]
        },
        {
          elementType: 'labels.text.fill',
          stylers: [
            {
              saturation: 36
            },
            {
              color: '#333333'
            },
            {
              lightness: 40
            }
          ]
        },
        {
          elementType: 'labels.icon',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [
            {
              color: '#f2f2f2'
            },
            {
              lightness: 19
            }
          ]
        },
        {
          featureType: 'administrative',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#fefefe'
            },
            {
              lightness: 20
            }
          ]
        },
        {
          featureType: 'administrative',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#fefefe'
            },
            {
              lightness: 17
            },
            {
              weight: 1.2
            }
          ]
        }
      ]
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
