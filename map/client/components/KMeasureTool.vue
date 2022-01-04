<template>
  <div class="row items-center no-padding">
    <span class="q-pl-md q-pr-md" @click="changeUnit">
      {{ measureValue }}
    </span>
    <!-- q-chip class="ellipsis" text-color="accent" icon="las la-ruler-combined" :label="measureValue"/ -->
    <k-panel id="toolbar-buttons" :content="buttons" action-renderer="button"/>
  </div>
</template>

<script>
import L from 'leaflet'
import distance from '@turf/distance'
import bearing from '@turf/bearing'
import length from '@turf/length'
import area from '@turf/area'
import { polygon, lineString } from '@turf/helpers'
import { getCoords, getType } from '@turf/invariant'
import math from 'mathjs'

export default {
  name: 'k-measure-tool',
  inject: ['kActivity'],
  data () {
    return {
      measureMode: 'measure-distance',
      measureValue: ''
    }
  },
  computed: {
    buttons () {
      const allModes = [
        { id: 'measure-distance', icon: 'las la-project-diagram', toggled: this.measureMode === 'measure-distance', tooltip: 'KMeasureTool.MEASURE_DISTANCE', handler: () => { this.setMode('measure-distance') } },
        { id: 'measure-area', icon: 'las la-draw-polygon', toggled: this.measureMode === 'measure-area', tooltip: 'KMeasureTool.MEASURE_AREA', handler: () => { this.setMode('measure-area') } },
        { id: 'see-measure-value', icon: 'las la-hand-pointer', toggled: this.measureMode === 'see-measure-value', tooltip: 'KMeasureTool.DISPLAY_MEASURE_VALUE', handler: () => { this.setMode('see-measure-value') } },
        { id: 'clear-measurements', icon: 'las la-trash', tooltip: 'KMeasureTool.CLEAR',  handler: () => { this.onClear() } }
      ]

      return allModes
    }
  },
  methods: {
    setMode (mode) {
      this.clearCurrentMeasurement()

      this.measureMode = mode

      if (this.measureMode === 'measure-distance') {
        this.kActivity.map.pm.enableDraw('Line', { tooltips: false, continueDrawing: true })
      } else if (this.measureMode === 'measure-area') {
        this.kActivity.map.pm.enableDraw('Polygon', { tooltips: false, continueDrawing: true })
      }
    },
    onClear () {
      this.clearAllMeasurements()
      this.setMode(this.measureMode)
    },
    changeUnit () {
      if (this.measureMode === 'measure-distance') {
        this.distanceUnit = this.distanceUnit === 'km' ? 'miles' : 'km'
        const v = math.unit(this.measureValue)
        const s = v.to(this.distanceUnit).format({ notation: 'fixed', precision: 3 })
        this.measureValue = s
      } else {
        return
      }

      // we only need to recompute tooltips on Polygon / LineString.
      // tooltips on vertex are dynamic
      for (const layer of this.layers) {
        const geojson = layer.toGeoJSON()
        const type = getType(geojson)
        if (type === 'LineString') {
          const d = length(geojson, { units: 'kilometers' })
          layer.bindTooltip(this.formatDistance(d, 'km'), { sticky: true })
        } else if (type === 'Polygon') {
          const a = area(geojson)
          layer.bindTooltip(this.formatArea(a, 'm^2'), { sticky: true })
        }
      }
    },
    clearCurrentMeasurement () {
      if (this.measurementLayer) this.measurementLayer.off('pm:vertexadded', this.onVertexAdded)
      this.measurementLayer = null
      if (this.cursorTooltip) this.kActivity.map.removeLayer(this.cursorTooltip)
      this.cursorTooltip = null
      for (const layer of this.measurementLayers) this.kActivity.map.removeLayer(layer)
      this.measurementLayers = []
      this.kActivity.map.off('mousemove', this.onMouseMove)
      this.kActivity.map.pm.disableDraw()
    },
    clearAllMeasurements () {
      this.clearCurrentMeasurement()
      for (const layer of this.layers) this.kActivity.map.removeLayer(layer)
      this.layers = []
      this.measureValue = '--'
    },
    vertexTooltip (marker) {
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
    onDrawStart (e) {
      // listen for vertex added to shape
      e.workingLayer.on('pm:vertexadded', this.onVertexAdded)
    },
    onDrawEnd (e) {
      this.clearCurrentMeasurement()
    },
    onVertexAdded (e) {
      const geojson = e.workingLayer.toGeoJSON()
      const coords = getCoords(geojson)

      if (!this.measurementLayer) {
        // first point added, record working layer and listen to mousemove from now on
        this.measurementLayer = e.workingLayer
        this.kActivity.map.on('mousemove', this.onMouseMove)
        this.geojsons.push(geojson)
      } else {
        this.geojsons[this.geojsons.length - 1] = geojson
      }

      // add a marker at vertex position
      const marker = L.marker(e.latlng, { icon: this.vertexIcon, zIndexOffset: -1000 }).bindTooltip(this.vertexTooltip)
      marker.geojsonIndex = this.geojsons.length - 1
      marker.coordIndex = coords.length - 1
      this.measurementLayers.push(marker)
      this.kActivity.map.addLayer(marker)

      // also add an arrow in the middle of the segment
      if (coords.length > 1)
        this.addArrowIcon(geojson, coords, coords.length - 2)
    },
    onMouseMove (e) {
      if (!this.measurementLayer) return

      const geojson = this.measurementLayer.toGeoJSON()
      const coords = getCoords(geojson)

      const geoCoords0 = coords[coords.length - 1]
      const geoCoords1 = [ e.latlng.lng, e.latlng.lat ]
      const d = distance(geoCoords0, geoCoords1, { unit: 'kilometers' })
      let content = this.formatDistance(d, 'km')
      const b = bearing(geoCoords0, geoCoords1)
      content += ' '
      content += this.formatAngle(b, 'deg')

      if (this.measureMode === 'measure-area' && coords.length >= 2) {
        coords.push(geoCoords1)
        coords.push(coords[0])
        const a = area(polygon([coords]))
        this.measureValue = this.formatArea(a, 'm^2')
      } else if (this.measureMode === 'measure-distance') {
        coords.push(geoCoords1)
        const d2 = length(lineString(coords), { units: 'kilometers' })
        this.measureValue = this.formatDistance(d2, 'km')
      }

      if (!this.cursorTooltip) {
        this.cursorTooltip = L.tooltip({ permanent: true })
        this.cursorTooltip.setLatLng(e.latlng)
        this.kActivity.map.addLayer(this.cursorTooltip)
      } else {
        this.cursorTooltip.setLatLng(e.latlng)
      }

      this.cursorTooltip.setContent(content)
    },
    onCreate (e) {
      // when a shape is created
      this.layers.push(e.layer)
      const geojson = e.layer.toGeoJSON()
      if (this.measureMode === 'measure-distance') {
        const d = length(geojson, { units: 'kilometers' })
        e.layer.bindTooltip(this.formatDistance(d, 'km'), { sticky: true })
      } else if (this.measureMode === 'measure-area') {
        const a = area(geojson)
        e.layer.bindTooltip(this.formatArea(a, 'm^2'), { sticky: true })

        // also add arrow for closing segment
        const coords = getCoords(geojson)[0]
        this.addArrowIcon(geojson, coords, coords.length - 2)
      }
      // move measurement layers to tool layers
      this.layers = this.layers.concat(this.measurementLayers)
      this.measurementLayers = []
      // update associated geojson
      this.geojsons[this.geojsons.length - 1] = e.layer.toGeoJSON()
    },
    addArrowIcon (geojson, coords, segment) {
      const p0 = segment
      const p1 = segment + 1
      const b = bearing(coords[p0], coords[p1])
      const middle = L.latLng((coords[p0][1] + coords[p1][1]) / 2, (coords[p0][0] + coords[p1][0]) / 2)
      const arrow = L.marker(middle, { icon: this.arrowIcon, zIndexOffset: -1000, rotation: b })
      // override _setPos to apply rotation too ...
      // robin: this is highly dependent on the icon you choose !
      arrow._setPos = (pos) => {
        this.markerSetPosBackup.call(arrow, pos)
        // arrow._icon.style[L.DomUtil.TRANSFORM + 'Origin'] = arrow.options.rotationOrigin
        arrow._icon.style['transform-origin'] = 'center'
        arrow._icon.style[L.DomUtil.TRANSFORM] += ` rotate(${arrow.options.rotation}deg) translateX(-12px) translateY(-12px)`
      }

      this.measurementLayers.push(arrow)
      this.kActivity.map.addLayer(arrow)
    },
    formatDistance (value, unit) {
      const f = math.unit(value, unit)
      const t = f.to(this.distanceUnit)
      return t.format({ notation: 'fixed', precision: 3 })
    },
    formatArea (value, unit) {
      const f = math.unit(value, unit)
      const t = f.to('km^2')
      return t.format({ notation: 'fixed', precision: 2 }).replace('^2', '²')
    },
    formatAngle (value, unit) {
      const f = math.unit(value, unit)
      const t = f.to('deg')
      return t.format({ notation: 'fixed', precision: 2 })
    },
  },
  created () {
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
  },
  mounted () {
    this.layers = []
    this.measurementLayers = []
    this.geojsons = []
    this.measureValue = '--'
    this.distanceUnit = 'km'
    this.markerSetPosBackup = L.Marker.prototype._setPos

    this.kActivity.map.on('pm:drawstart', this.onDrawStart)
    this.kActivity.map.on('pm:drawend', this.onDrawEnd)
    this.kActivity.map.on('pm:create', this.onCreate)

    this.vertexIcon = L.divIcon({
      className: 'measure-tool-vertex-icon'
    });
    this.arrowIcon = L.divIcon({
      // robin: changing the used icon probably require to update stuff in addArrowIcon
      html: '<i class="las la-angle-double-up la-3x" style="color: #3388ff"/>',
      className: 'measure-tool-arrow-icon',
    });

    this.setMode('measure-distance')
  },
  beforeDestroy () {
    this.clearAllMeasurements()

    this.kActivity.map.off('pm:drawstart', this.onDrawStart)
    this.kActivity.map.off('pm:drawend', this.onDrawEnd)
    this.kActivity.map.off('pm:create', this.onCreate)
  }
}
</script>

<style lang="stylus">
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
  .measure-tool-arrow-icon {
/*
    background-color: #ffffff;
    border: 1px solid #3388ff;
    border-radius: 50%;
    margin: -8px 0 0 -8px !important;
    width: 14px !important;
    height: 14px !important;
    outline: 0;
    transition: opacity ease 0.3s;
*/
  }
</style>
