<template>
  <Page>
    <template #header>
      <Header :title="title" active="/statistics/addresses/population" />
    </template>
    <el-row>
      <div class="title-container">
        <h2 class="address-title">
          <span>{{ addressTitle }}</span>
          <span>{{ totalPopulation }}</span>
        </h2>
        <el-select v-model="level" placeholder="住所レベル" class="level-input">
          <el-option :value="null" label="指定なし"></el-option>
          <el-option :value="1" label="都道府県"></el-option>
          <el-option :value="2" label="市区町村"></el-option>
          <el-option :value="3" label="大字・町名"></el-option>
          <el-option :value="4" label="字・丁目"></el-option>
        </el-select>
        <el-autocomplete
          v-model="word"
          :fetch-suggestions="querySearch"
          placeholder="住所名"
          prefix-icon="el-icon-search"
          class="address-input"
          @select="handleSelect"
        ></el-autocomplete>
      </div>
    </el-row>
    <el-row>
      <el-col :sm="24" :md="12" class="chart-col">
        <canvas ref="chart"></canvas>
      </el-col>
      <el-col :sm="24" :md="12" class="map-col">
        <GoogleMap height="400px" :default-zoom="4" :geojsons="geojsons" auto-adjust-geojsons />
      </el-col>
    </el-row>
  </Page>
</template>

<script>
import { mapActions } from 'vuex'
import Chart from 'chart.js'
import GeoApi from '@/requests/geo-api'

export default {
  async asyncData({ query }) {
    const code = query.address_code || '01'
    const addressApi = new GeoApi(`/addresses/${code}`)
    const addressRes = await addressApi.get()
    const address = addressRes.data
    const word = address.name
    return {
      address,
      word,
    }
  },

  data() {
    return {
      title: '住所毎の人口統計',
      level: null,
      chart: null,
      geojsons: [],
      population: null,
    }
  },

  head() {
    return {
      title: this.title,
    }
  },

  computed: {
    addressTitle() {
      return this.address.name
    },

    totalPopulation() {
      if (!this.population) {
        return ''
      }
      const values = [...Object.values(this.population.male), ...Object.values(this.population.female)]
      const total = values.reduce((sum, element) => sum + element, 0)
      return `${total.toLocaleString()}人`
    },
  },

  watch: {
    async address() {
      await this.fetch()
      this.drawChart()
    },
  },

  watchQuery: ['address_code'],

  async mounted() {
    await this.loadMap()
    this.google = this.$store.state.map.google
    await this.fetch()
    this.drawChart()
  },

  methods: {
    ...mapActions('map', { loadMap: 'load' }),

    async fetch() {
      const code = this.address ? this.address.code : null
      const populationApi = new GeoApi('/statistics/addresses/populations', {
        address_code: code,
      })
      const populationRes = await populationApi.get()
      this.population = populationRes.data[0]

      if (code) {
        const shapeApi = new GeoApi(`/addresses/${code}/shape`)
        const shapeRes = await shapeApi.get()
        this.geojsons = [shapeRes.data]
      }
    },

    drawChart() {
      const m = this.population.male
      const f = this.population.female
      const max = this.getMaxValue(this.population)
      const barChartData = {
        labels: [
          '75歳以上',
          '70~74歳',
          '65~69歳',
          '60~64歳',
          '55~59歳',
          '50~54歳',
          '45~49歳',
          '40~44歳',
          '35~39歳',
          '30~34歳',
          '25~29歳',
          '20~24歳',
          '15~19歳',
          '10~14歳',
          '5~9歳',
          '0~4歳',
        ],
        datasets: [
          {
            label: 'Male',
            backgroundColor: 'rgb(54, 162, 235)',
            data: [
              -1 * m.age_75,
              -1 * m.age_70_74,
              -1 * m.age_65_69,
              -1 * m.age_60_64,
              -1 * m.age_55_59,
              -1 * m.age_50_54,
              -1 * m.age_45_49,
              -1 * m.age_40_44,
              -1 * m.age_35_39,
              -1 * m.age_30_34,
              -1 * m.age_25_29,
              -1 * m.age_20_24,
              -1 * m.age_15_19,
              -1 * m.age_10_14,
              -1 * m.age_5_9,
              -1 * m.age_0_4,
            ],
          },
          {
            label: 'Female',
            backgroundColor: 'rgb(255, 99, 132)',
            data: [
              f.age_75,
              f.age_70_74,
              f.age_65_69,
              f.age_60_64,
              f.age_55_59,
              f.age_50_54,
              f.age_45_49,
              f.age_40_44,
              f.age_35_39,
              f.age_30_34,
              f.age_25_29,
              f.age_20_24,
              f.age_15_19,
              f.age_10_14,
              f.age_5_9,
              f.age_0_4,
            ],
          },
        ],
      }

      const graph = {
        type: 'horizontalBar',
        data: barChartData,
        options: {
          title: {
            display: true,
            text: '人口ピラミッド',
          },
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label(tooltipItem, data) {
                const label = data.datasets[tooltipItem.datasetIndex].label
                const value = Math.abs(Number(tooltipItem.value)).toLocaleString()
                return `${label} : ${value}`
              },
            },
          },
          responsive: true,
          scales: {
            xAxes: [
              {
                stacked: true,
                ticks: {
                  display: false,
                  min: -1 * max,
                  max,
                },
              },
            ],
            yAxes: [
              {
                stacked: true,
              },
            ],
          },
        },
      }
      this.chart = new Chart(this.$refs.chart, graph)
    },

    getMaxValue(population) {
      const values = [...Object.values(population.male), ...Object.values(population.female)]
      return Math.max(...values) * 1.1
    },

    async querySearch(queryString, cb) {
      const addressApi = new GeoApi('/addresses', { name: queryString, level: this.level })
      const addressRes = await addressApi.get()
      const results = addressRes.data.map((a) => {
        return { value: a.name, code: a.code }
      })
      cb(results)
    },

    handleSelect(item) {
      if (this.chart) {
        this.chart.destroy()
      }
      this.$router.push({ path: '/statistics/addresses/population', query: { address_code: item.code } })
    },
  },
}
</script>

<style lang="scss" scoped>
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

  .level-input {
    width: 120px;
    margin-right: 10px;

    @include xs() {
      margin: 10px 0 5px;
      width: 100%;
    }
  }

  .address-input {
    width: 240px;
    @include xs() {
      margin: 10px 0 5px;
      width: 100%;
    }
  }
}

.chart-col {
  padding: 15px 10px 15px 0;

  @include sm() {
    padding: 15px 0;
  }
}

.map-col {
  padding: 15px 0 15px 10px;

  @include sm() {
    padding: 15px 0;
  }
}
</style>
