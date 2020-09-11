<template>
  <div class="map-container" :style="{ width: width, height: height }">
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
import _ from 'lodash'
import ls from 'local-storage'
import config from '@/config'
import { adjustViewPort } from '@/utils/map'
import { toLocations } from '@/utils/geojson'
const LS_THEME_KEY = 'google-map-theme'
export default {
  props: {
    width: {
      required: false,
      type: String,
      default: '100%',
    },

    height: {
      required: false,
      type: String,
      default: '100%',
    },

    markers: {
      required: false,
      type: Array,
      default() {
        return []
      },
    },

    infowindows: {
      required: false,
      type: Array,
      default() {
        return []
      },
    },

    geojsons: {
      required: false,
      type: Array,
      default() {
        return []
      },
    },
  },

  data() {
    return {
      google: null,
      map: null,
      theme: this.getDefaultTheme(),
      themes: ['standard', 'silver', 'retro', 'night', 'dark', 'aubergine'],
      localMarkers: [],
      localInfowindows: [],
    }
  },

  watch: {
    theme(val) {
      this.map.setMapTypeId(val)
      ls(LS_THEME_KEY, this.theme)
    },

    markers(val) {
      const diffMarkers = _.difference(this.localMarkers, this.markers)
      diffMarkers.forEach((marker) => marker.setMap(null))

      this.markers.forEach((marker) => {
        marker.setMap(this.map)
      })
      this.localMarkers = this.markers
    },

    infowindows(val) {
      const diffInfowindows = _.difference(
        this.localInfowindows,
        this.infowindows
      )
      diffInfowindows.forEach((infowindow) => infowindow.setMap(null))

      this.infowindows.forEach((infowindow) => {
        infowindow.setMap(this.map)
      })
      this.localInfowindows = this.infowindows
    },

    geojsons(val) {
      // GeoJSON一括クリア
      this.map.data.forEach((feature) => {
        this.map.data.remove(feature)
      })

      this.geojsons.forEach((geojson) => {
        this.map.data.addGeoJson(geojson)
      })

      this.map.data.setStyle((feature) => {
        const strokeWeight = feature.getProperty('strokeWeight')
        const strokeColor = feature.getProperty('strokeColor')
        const fillColor = feature.getProperty('fillColor')
        const fillOpacity = feature.getProperty('fillOpacity')
        const zIndex = feature.getProperty('zIndex')
        return {
          strokeWeight,
          strokeColor,
          fillColor,
          fillOpacity,
          zIndex,
        }
      })

      if (this.geojsons.length > 0) {
        let locations = []
        this.geojsons.forEach((geojson) => {
          locations = locations.concat(toLocations(geojson))
        })
        adjustViewPort(this.google, this.map, locations)
      }
    },
  },

  mounted() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'map/load') {
        this.google = state.map.google
        this.initMap()
        this.bindMap()
      }
    })
  },

  methods: {
    getDefaultTheme() {
      const theme = ls(LS_THEME_KEY)
      return theme || 'silver'
    },

    initMap() {
      if (!this.$refs.map) return
      const lat = config.default_location.lat
      const lng = config.default_location.lng
      const position = new this.google.maps.LatLng(lat, lng)
      this.map = new this.google.maps.Map(this.$refs.map, {
        zoom: 12,
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
      this.map.addListener('click', (e) => this.$emit('click', e))
      this.map.data.addListener('click', (e) => this.$emit('clickData', e))
      this.map.data.addListener('mouseout', (e) =>
        this.$emit('mouseoutData', e)
      )
      this.map.data.addListener('mouseover', (e) =>
        this.$emit('mouseoverData', e)
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
  height: 100%;
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
