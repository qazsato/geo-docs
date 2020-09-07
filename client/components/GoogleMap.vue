<template>
  <div class="map-container">
    <div ref="map" class="map"></div>
    <el-select v-model="theme" class="theme-select" size="small">
      <el-option
        v-for="(t, i) in themes"
        :key="i"
        :label="t"
        :value="t"
        class="theme-option"
      >
        <img :src="require(`~/assets/images/map/themes/${t}.png`)" />
        <span class="name">{{ t }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import GoogleMapsApiLoader from 'google-maps-api-loader'
import config from '@/config'

export default {
  data() {
    return {
      google: null,
      map: null,
      theme: 'silver',
      themes: ['standard', 'silver', 'retro', 'night', 'dark', 'aubergine'],
    }
  },

  watch: {
    theme(val) {
      this.map.setMapTypeId(val)
    },
  },

  async mounted() {
    const apiKey = config.google_maps.api_key
    this.google = await GoogleMapsApiLoader({ apiKey })
    this.initMap()
    this.bindMap()
    this.$emit('load', this.google, this.map)
  },

  methods: {
    initMap() {
      const lat = config.default_location.lat
      const lng = config.default_location.lng
      const position = new this.google.maps.LatLng(lat, lng)
      this.map = new this.google.maps.Map(this.$refs.map, {
        zoom: 18,
        center: position,
        mapTypeId: this.theme,
        clickableIcons: false,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControlOptions: {
          mapTypeIds: this.themes,
        },
      })
      this.themes.forEach((t) => {
        const s = new this.google.maps.StyledMapType(config.map_theme[t])
        this.map.mapTypes.set(t, s)
      })
    },

    bindMap() {
      this.map.addListener('click', (e) =>
        this.$emit('click', e, this.google, this.map)
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
}

.map {
  width: 100%;
  height: 550px;
}

.theme-select {
  position: absolute;
  left: 5px;
  bottom: 30px;
  width: 110px;
}

.theme-option {
  position: relative;
  width: 200px;
  height: 38px;
  margin: 4px 8px;
  padding: 0;

  .name {
    position: absolute;
    top: 0;
    left: 15px;
    color: #fff;
    font-size: 15px;
    font-weight: bold;
    text-shadow: 1px 1px 1px #999;
  }

  &:hover {
    opacity: 0.9;
  }
}
</style>
