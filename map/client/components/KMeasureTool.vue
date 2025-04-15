<template>
  <div class="row items-center no-padding">
    <span class="q-pl-md q-pr-md" @click="changeUnit">
      <span v-html="measureValue" />
      <q-tooltip>
        {{ $t('KMeasureTool.CLICK_TO_CHANGE_UNIT') }}
      </q-tooltip>
    </span>
    <KPanel
      id="toolbar-buttons"
      :content="buttons"
      action-renderer="button"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import L from 'leaflet'
import distance from '@turf/distance'
import bearing from '@turf/bearing'
import length from '@turf/length'
import area from '@turf/area'
import { polygon, lineString, featureCollection } from '@turf/helpers'
import { getCoords, getType } from '@turf/invariant'
import { Units } from '../../../core/client/units'
import { KPanel } from '../../../core/client/components'
import { formatUserCoordinates } from '../utils'

export default {
  name: 'k-measure-tool',
  inject: ['kActivity'],
  components: {
    KPanel
  },
  data () {
    return {
      measureMode: 'measure-distance',
      measureValue: ''
    }
  },
  computed: {
    buttons () {
      const allModes = [
        { id: 'measure-distance', icon: 'las la-project-diagram', toggled: this.measureMode === 'measure-distance', tooltip: 'KMeasureTool.MEASURE_DISTANCE', handler: () => { this.beginMode('measure-distance') } },
        { id: 'measure-area', icon: 'las la-draw-polygon', toggled: this.measureMode === 'measure-area', tooltip: 'KMeasureTool.MEASURE_AREA', handler: () => { this.beginMode('measure-area') } },
        { id: 'measure-feature', icon: 'las la-drafting-compass', toggled: this.measureMode === 'measure-feature', tooltip: 'KMeasureTool.MEASURE_FEATURE', handler: () => { this.beginMode('measure-feature') } },
        { id: 'measure-circle', icon: 'las la-circle-notch', toggled: this.measureMode === 'measure-circle', tooltip: 'KMeasureTool.MEASURE_CIRCLE', handler: () => { this.beginMode('measure-circle') } },
        { component: 'QSeparator', vertical: true, color: 'lightgrey' },
        { id: 'clear-measurements', icon: 'las la-trash', tooltip: 'KMeasureTool.CLEAR', handler: () => { this.onClear() } }
      ]

      return allModes
    }
  },
  methods: {
    beginMode (mode) {
      this.endMode(this.measureMode)
      this.measureMode = mode

      if (this.measureMode === 'measure-distance') this.beginMeasureDistance()
      else if (this.measureMode === 'measure-area') this.beginMeasureArea()
      else if (this.measureMode === 'measure-circle') this.beginMeasureCircle()
      else if (this.measureMode === 'measure-feature') this.beginMeasureFeature()
    },
    endMode (mode) {
      this.hideCursorTooltip()

      if (mode === 'measure-distance') this.endMeasureDistance()
      else if (mode === 'measure-area') this.endMeasureArea()
      else if (mode === 'measure-circle') this.endMeasureCircle()
      else if (mode === 'measure-feature') this.endMeasureFeature()
    },
    onClear () {
      this.clear()
      this.beginMode(this.measureMode)
    },
    clear () {
      this.hideCursorTooltip()

      // Clears stuff created by tools
      for (const layer of this.layers) this.kActivity.map.removeLayer(layer)
      this.layers = []

      this.measureValue = '--'
      this.geojsons = []
    },
    changeUnit () {
      if (this.measureMode === 'measure-distance') {
        const state = this.measureDistance

        const units = Units.getUnits('length')
        // Get current unit and jump to next one
        const index = _.findIndex(units, { name: this.distanceUnit })
        this.distanceUnit = units[(index + 1) % units.length].name
        const geojson = state.workingLayer ? state.workingLayer.toGeoJSON() : this.geojsons[this.geojsons.length - 1]
        const d = length(geojson, { units: 'kilometers' })
        this.measureValue = this.formatDistance(d, 'km')
      } else if (this.measureMode === 'measure-area') {
        const state = this.measureDistance

        const units = Units.getUnits('area')
        // Get current unit and jump to next one
        const index = _.findIndex(units, { name: this.areaUnit })
        this.areaUnit = units[(index + 1) % units.length].name
        const geojson = state.workingLayer ? state.workingLayer.toGeoJSON() : this.geojsons[this.geojsons.length - 1]
        const a = area(geojson)
        this.measureValue = this.formatArea(a, 'm^2')
      } else if (this.measureMode === 'measure-circle') {
        const state = this.measureCircle

        const units = Units.getUnits('length')
        // Get current unit and jump to next one
        const index = _.findIndex(units, { name: this.distanceUnit })
        this.distanceUnit = units[(index + 1) % units.length].name
        this.measureValue = this.formatDistance(state.distToCenter, 'm')
      }

      // we only need to recompute tooltips on Polygon / LineString.
      // tooltips on vertex are dynamic
      for (const layer of this.layers) {
        if (layer.measureMode === 'measure-distance') {
          const geojson = layer.toGeoJSON()
          const d = length(geojson, { units: 'kilometers' })
          layer.bindTooltip(this.formatDistance(d, 'km'), { sticky: true })
        } else if (layer.measureMode === 'measure-area') {
          const geojson = layer.toGeoJSON()
          const a = area(geojson)
          layer.bindTooltip(this.formatArea(a, 'm^2'), { sticky: true })
        } else if (layer.measureMode === 'measure-circle') {
          layer.bindTooltip(this.formatDistance(layer.distToCenter, 'm'), { sticky: true })
        }
      }
    },
    geometryVertexTooltip (marker) {
      const geojson = this.geojsons[marker.geojsonIndex]
      const type = getType(geojson)
      const coords = type === 'Polygon' ? getCoords(geojson)[0] : getCoords(geojson)
      let nextVertex = -1
      let prevVertex = -1

      if (type === 'LineString') {
        nextVertex = marker.coordIndex < coords.length - 1 ? marker.coordIndex + 1 : -1
        prevVertex = marker.coordIndex > 0 ? marker.coordIndex - 1 : -1
      } else if (type === 'Polygon') {
        nextVertex = marker.coordIndex < coords.length - 2 ? marker.coordIndex + 1 : 0
        prevVertex = marker.coordIndex > 0 ? marker.coordIndex - 1 : coords.length - 2
      }

      let tooltip = ''
      let br = ''
      if (prevVertex !== -1) {
        const d = distance(coords[prevVertex], coords[marker.coordIndex], { units: 'kilometers' })
        tooltip += `${br}+${this.formatDistance(d, 'km')}`
        br = '<br/>'
      }
      const d = length(lineString(coords), { units: 'kilometers' })
      tooltip += `${br}${this.formatDistance(d, 'km')}`
      br = '<br/>'
      if (prevVertex !== -1) {
        const a = bearing(coords[prevVertex], coords[marker.coordIndex])
        tooltip += `${br}In: ${this.formatAngle(a, 'deg')}`
      }
      if (nextVertex !== -1) {
        const a = bearing(coords[marker.coordIndex], coords[nextVertex])
        tooltip += `${br}Out: ${this.formatAngle(a, 'deg')}`
      }

      return tooltip
    },
    showCursorTooltip (latlng, content) {
      if (!this.tooltip) {
        this.tooltip = L.tooltip({ opacity: 0.7, permanent: true, direction: 'bottom', offset: L.point(0, 15) })
        this.tooltip.setLatLng(latlng)
        this.tooltip.setContent(content)
        this.kActivity.map.addLayer(this.tooltip)
      } else {
        this.tooltip.setLatLng(latlng)
        this.tooltip.setContent(content)
      }
    },
    hideCursorTooltip () {
      if (this.tooltip) {
        this.kActivity.map.removeLayer(this.tooltip)
        this.tooltip = null
      }
    },
    beginMeasureDistance () {
      this.kActivity.map.on('pm:drawstart', this.onMeasureDistanceDrawStart)
      this.kActivity.map.on('pm:create', this.onMeasureDistanceCreate)
      this.kActivity.map.on('mousemove', this.onMeasureDistanceMouseMove)

      this.kActivity.map.pm.enableDraw('Line', { tooltips: false, continueDrawing: true, cursorMarker: false })
    },
    onMeasureDistanceDrawStart (event) {
      // listen for vertex added to shape
      event.workingLayer.on('pm:vertexadded', this.onMeasureDistanceVertexAdded)
    },
    onMeasureDistanceVertexAdded (event) {
      const state = this.measureDistance

      const geojson = event.workingLayer.toGeoJSON()
      const coords = getCoords(geojson)

      if (!state.workingLayer) {
        // first point added, record working layer and listen to mousemove from now on
        state.workingLayer = event.workingLayer
        state.workingLayer._path.style.cursor = 'crosshair'
        state.workingLayer._renderer._container.style.cursor = 'crosshair'
        state.markers = []
        this.geojsons.push(geojson)
        this.measureValue = '--'
      } else {
        this.geojsons[this.geojsons.length - 1] = geojson
      }

      // add a marker at vertex position
      const marker = L.marker(event.latlng, { icon: this.vertexIcon, zIndexOffset: -10 }).bindTooltip(this.measureDistanceTooltip)
      marker.geojsonIndex = this.geojsons.length - 1
      marker.coordIndex = coords.length - 1
      state.markers.push(marker)
      this.kActivity.map.addLayer(marker)
    },
    onMeasureDistanceMouseMove (event) {
      const state = this.measureDistance
      // Only coordinates while no first location selected
      if (!state.workingLayer) {
        this.showCursorTooltip(event.latlng, this.formatCoordinates(event.latlng.lat, event.latlng.lng))
        return
      }

      const geojson = state.workingLayer.toGeoJSON()
      const coords = getCoords(geojson)

      // distance of last point to cursor
      const geoCoords0 = coords[coords.length - 1]
      const geoCoords1 = [event.latlng.lng, event.latlng.lat]
      const d = distance(geoCoords0, geoCoords1, { unit: 'kilometers' })

      let content = this.formatDistance(d, 'km')
      const b = bearing(geoCoords0, geoCoords1)
      content += ' '
      content += this.formatAngle(b, 'deg')
      content += '</br>'
      content += this.formatCoordinates(event.latlng.lat, event.latlng.lng)
      this.showCursorTooltip(event.latlng, content)

      // measure is length of complete line
      coords.push(geoCoords1)
      const d2 = length(lineString(coords), { units: 'kilometers' })
      this.measureValue = this.formatDistance(d2, 'km')
    },
    measureDistanceTooltip (marker) {
      return this.geometryVertexTooltip(marker)
    },
    onMeasureDistanceCreate (event) {
      const state = this.measureDistance

      // when a shape is created
      this.layers = this.layers.concat(state.markers)
      this.layers.push(event.layer)

      // bind a tooltip on the layer
      const geojson = event.layer.toGeoJSON()
      const d = length(geojson, { units: 'kilometers' })
      this.measureValue = this.formatDistance(d, 'km')
      event.layer.bindTooltip(this.measureValue, { sticky: true })
      event.layer.measureMode = this.measureMode

      // update associated geojson
      this.geojsons[this.geojsons.length - 1] = geojson

      // prepare for next polyline
      state.workingLayer = null
      state.markers = []

      this.hideCursorTooltip()
    },
    endMeasureDistance () {
      const state = this.measureDistance

      if (state.workingLayer) state.workingLayer.off('pm:vertexadded', this.onMeasureDistanceVertexAdded)
      if (state.markers) {
        for (const marker of state.markers) { this.kActivity.map.removeLayer(marker) }
      }
      this.kActivity.map.off('mousemove', this.onMeasureDistanceMouseMove)
      this.kActivity.map.off('pm:drawstart', this.onMeasureDistanceDrawStart)
      this.kActivity.map.off('pm:create', this.onMeasureDistanceCreate)

      state.workingLayer = null
      state.markers = null

      this.kActivity.map.pm.disableDraw()
    },
    beginMeasureArea () {
      this.kActivity.map.on('pm:drawstart', this.onMeasureAreaDrawStart)
      this.kActivity.map.on('pm:create', this.onMeasureAreaCreate)
      this.kActivity.map.on('mousemove', this.onMeasureAreaMouseMove)

      this.kActivity.map.pm.enableDraw('Polygon', { tooltips: false, continueDrawing: true, cursorMarker: false })
    },
    onMeasureAreaDrawStart (event) {
      // listen for vertex added to shape
      event.workingLayer.on('pm:vertexadded', this.onMeasureAreaVertexAdded)
    },
    onMeasureAreaVertexAdded (event) {
      const state = this.measureArea

      const geojson = event.workingLayer.toGeoJSON()
      const coords = getCoords(geojson)

      if (!state.workingLayer) {
        // first point added, record working layer and listen to mousemove from now on
        state.workingLayer = event.workingLayer
        state.workingLayer._path.style.cursor = 'crosshair'
        state.markers = []
        this.geojsons.push(geojson)
        this.measureValue = '--'
      } else {
        this.geojsons[this.geojsons.length - 1] = geojson
      }

      // add a marker at vertex position
      const marker = L.marker(event.latlng, { icon: this.vertexIcon, zIndexOffset: -10 }).bindTooltip(this.measureAreaTooltip)
      marker.geojsonIndex = this.geojsons.length - 1
      marker.coordIndex = coords.length - 1
      state.markers.push(marker)
      this.kActivity.map.addLayer(marker)
    },
    onMeasureAreaMouseMove (event) {
      const state = this.measureArea

      // Only coordinates while no first location selected
      if (!state.workingLayer) {
        this.showCursorTooltip(event.latlng, this.formatCoordinates(event.latlng.lat, event.latlng.lng))
        return
      }

      const geojson = state.workingLayer.toGeoJSON()
      const coords = getCoords(geojson)

      // distance of last point to cursor
      const geoCoords0 = coords[coords.length - 1]
      const geoCoords1 = [event.latlng.lng, event.latlng.lat]
      const d = distance(geoCoords0, geoCoords1, { unit: 'kilometers' })

      let content = this.formatDistance(d, 'km')
      const b = bearing(geoCoords0, geoCoords1)
      content += ' '
      content += this.formatAngle(b, 'deg')
      content += '</br>'
      content += this.formatCoordinates(event.latlng.lat, event.latlng.lng)
      this.showCursorTooltip(event.latlng, content)

      // area of the closed polygon
      if (coords.length >= 2) {
        coords.push(geoCoords1)
        coords.push(coords[0])
        const a = area(polygon([coords]))
        this.measureValue = this.formatArea(a, 'm^2')
      }
    },
    measureAreaTooltip (marker) {
      return this.geometryVertexTooltip(marker)
    },
    onMeasureAreaCreate (event) {
      const state = this.measureArea

      // when a shape is created
      this.layers = this.layers.concat(state.markers)
      this.layers.push(event.layer)

      // bind a tooltip on the layer
      const geojson = event.layer.toGeoJSON()
      const a = area(geojson)
      this.measureValue = this.formatArea(a, 'm^2')
      event.layer.bindTooltip(this.measureValue, { sticky: true })
      event.layer.measureMode = this.measureMode

      // update associated geojson
      this.geojsons[this.geojsons.length - 1] = geojson

      // prepare for next area
      state.workingLayer = null
      state.markers = []

      this.hideCursorTooltip()
    },
    endMeasureArea () {
      const state = this.measureArea

      if (state.workingLayer) state.workingLayer.off('pm:vertexadded', this.onMeasureAreaVertexAdded)
      if (state.markers) {
        for (const marker of state.markers) { this.kActivity.map.removeLayer(marker) }
      }
      this.kActivity.map.off('mousemove', this.onMeasureAreaMouseMove)
      this.kActivity.map.off('pm:drawstart', this.onMeasureAreaDrawStart)
      this.kActivity.map.off('pm:create', this.onMeasureAreaCreate)

      state.workingLayer = null
      state.markers = null

      this.kActivity.map.pm.disableDraw()
    },
    beginMeasureFeature () {
      this.kActivity.$engineEvents.on('click', this.onMeasureFeature)
    },
    onMeasureFeature (layer, event) {
      if (this.measureMode !== 'measure-feature') return
      // Retrieve the feature
      const feature = _.get(event, 'target.feature')
      // Check for valid types
      if (feature && !getType(feature).includes('Point')) {
        // Distance is possible on lines/polygons
        const d2 = length(feature, { units: 'kilometers' })
        this.measureValue = this.formatDistance(d2, 'km')
        // Area is only possible on polygons
        if (getType(feature).includes('Polygon')) {
          const a = area(feature)
          this.measureValue += '<br/>' + this.formatArea(a, 'm^2')
        }
      }
    },
    endMeasureFeature () {
      this.kActivity.$engineEvents.off('click', this.onMeasureFeature)
    },
    beginMeasureCircle () {
      this.kActivity.$engineEvents.on('click', this.onMeasureCircleMapClick)
      this.kActivity.map.on('mousemove', this.onMeasureCircleMouseMove)
      this.kActivity.map._container.style.cursor = 'crosshair'
    },
    onMeasureCircleMapClick (layer, event) {
      const state = this.measureCircle

      // We're only interested in clicks on the map, not on other layers
      if (event.target !== this.kActivity.map)
        return

      if (!state.center) {
        // we're placing circle center
        state.center = event.latlng
        // put a marker there
        state.centerMarker = L.marker(event.latlng, { icon: this.vertexIcon })
          .bindTooltip(this.formatCoordinates(event.latlng.lat, event.latlng.lng))
        this.kActivity.map.addLayer(state.centerMarker)
      } else {
        // end of circle
        this.layers.push(state.centerMarker)
        this.layers.push(state.circleLayer)
        this.kActivity.map.removeLayer(state.lineLayer)

        // bind tooltip
        state.circleLayer.distToCenter = state.distToCenter
        state.circleLayer.bindTooltip(this.formatDistance(state.distToCenter, 'm'), { sticky: true })
        state.circleLayer.measureMode = this.measureMode

        // append to exportable geojsons
        this.geojsons.push(state.circleLayer.toGeoJSON())

        // prepare for next circle
        state.centerMarker = null
        state.circleLayer = null
        state.lineLayer = null
        state.center = null

        this.hideCursorTooltip()
      }
    },
    onMeasureCircleMouseMove (event) {
      const state = this.measureCircle

      // Only coordinates while no first location selected
      if (!state.center) {
        this.showCursorTooltip(event.latlng, this.formatCoordinates(event.latlng.lat, event.latlng.lng))
        return
      }

      const center = [state.center.lng, state.center.lat]
      const cursor = [event.latlng.lng, event.latlng.lat]
      state.distToCenter = distance(center, cursor, { units: 'kilometers' }) * 1000 // GeodesicCircle requires radius in m
      this.measureValue = this.formatDistance(state.distToCenter, 'm')
      if (!state.circleLayer) {
        state.circleLayer = L.geodesiccircle(this.measureCircle.center, { fill: true, steps: 360, radius: state.distToCenter })
        state.lineLayer = L.polyline([state.center, event.latlng], { dashArray: [5, 5] })
        this.kActivity.map.addLayer(state.circleLayer)
        this.kActivity.map.addLayer(state.lineLayer)
        state.circleLayer._path.style.cursor = 'crosshair'
        state.lineLayer._path.style.cursor = 'crosshair'
      } else {
        state.circleLayer.setRadius(state.distToCenter)
        state.lineLayer.setLatLngs([state.center, event.latlng])
      }
      let content = this.measureValue
      content += '</br>'
      content += this.formatCoordinates(event.latlng.lat, event.latlng.lng)
      this.showCursorTooltip(event.latlng, content)
    },
    measureCircleTooltip (circleLayer) {
      let tooltip = ''
      tooltip += this.formatDistance(circleLayer.distToCenter, 'm')
      return tooltip
    },
    endMeasureCircle () {
      const state = this.measureCircle

      if (state.circleLayer) {
        this.kActivity.map.removeLayer(state.circleLayer)
        state.circleLayer = null
      }
      if (state.lineLayer) {
        this.kActivity.map.removeLayer(state.lineLayer)
        state.lineLayer = null
      }
      if (state.centerMarker) {
        this.kActivity.map.removeLayer(state.centerMarker)
        state.centerMarker = null
      }

      state.center = null

      this.kActivity.$engineEvents.off('click', this.onMeasureCircleMapClick)
      this.kActivity.map.off('mousemove', this.onMeasureCircleMouseMove)
      this.kActivity.map._container.style.cursor = ''
    },
    formatDistance (value, unit) {
      return Units.format(value, unit, this.distanceUnit)
    },
    formatArea (value, unit) {
      return Units.format(value, unit, this.areaUnit)
    },
    formatAngle (value, unit) {
      return Units.format(value, unit, this.angleUnit)
    },
    formatCoordinates (lat, lng) {
      return formatUserCoordinates(lat, lng, this.$store.get('locationFormat', 'FFf'))
    }
  },
  mounted () {
    this.layers = []
    this.geojsons = []
    this.measureValue = '--'
    this.distanceUnit = Units.getDefaultUnit('length')
    this.areaUnit = Units.getDefaultUnit('area')
    this.angleUnit = Units.getDefaultUnit('angle')

    this.measureDistance = {} // measure-distance state
    this.measureArea = {} // measure-area state
    this.measureCircle = {} // measure-circle state

    // add a method on the activity to serialize measure tool layers as GeoJSON
    this.kActivity.getMeasureToolLayers = () => { return featureCollection(this.geojsons) }

    // Disable selection on click while measuring
    this.selectionEnabled = (typeof this.kActivity.isSelectionEnabled === 'function') ? this.kActivity.isSelectionEnabled() : false
    if (typeof this.kActivity.setSelectionEnabled === 'function') this.kActivity.setSelectionEnabled(false)

    this.vertexIcon = L.divIcon({ className: 'measure-tool-vertex-icon' })

    this.beginMode('measure-distance')
  },
  beforeUnmount () {
    this.endMode(this.measureMode)
    this.clear()

    // remove method to fetch layers
    delete this.kActivity.getMeasureToolLayers
    // Restore selection state
    if (typeof this.kActivity.setSelectionEnabled === 'function') this.kActivity.setSelectionEnabled(this.selectionState)
  }
}
</script>

<style lang="scss">
  .measure-tool-vertex-icon {
    background-color: #ffffff;
    border: 1px solid #3388ff;
    border-radius: 50%;
    margin: -8px 0 0 -8px !important;
    width: 14px !important;
    height: 14px !important;
    outline: 0;
    transition: opacity ease 0.3s;
  }
  /*
  .measure-tool-arrow-icon {
    background-color: #ffffff;
    border: 1px solid #3388ff;
    border-radius: 50%;
    margin: -8px 0 0 -8px !important;
    width: 14px !important;
    height: 14px !important;
    outline: 0;
    transition: opacity ease 0.3s;
  }
  */
</style>
