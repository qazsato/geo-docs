<template>
  <el-container>
    <el-header class="header">
      <h1>
        <router-link :to="{ path: '/' }">Address</router-link>
      </h1>
    </el-header>
    <el-main>
      <el-row v-if="address">
        <h2 class="address-name">{{ address.name }}</h2>
        <div id="map">MAP</div>
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
            width="120"
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

export default {
  async asyncData({ query }) {
    // TODO: 設定ファイルに移行
    const GEO_API = 'http://localhost:4000/v1'
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
    if (query.code) {
      const addressRes = await axios.get(`${GEO_API}/addresses/${query.code}`)
      address = addressRes.data
    }

    return {
      address,
      addresses,
      count,
      page
    }
  },

  watchQuery: ['code', 'page'],

  methods: {
    clickAddress(address) {
      const code = address.code
      this.$router.push({ path: '/', query: { code } })
    },

    changePage(page) {
      const code = this.address ? this.address.code : undefined
      this.$router.push({ path: '/', query: { code, page } })
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
