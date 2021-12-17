<template>
  <div class="row items-center no-padding">
    <q-chip class="ellipsis" text-color="accent" icon="las la-ruler-combined" :label="measureValue"/>
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
import { getCoords } from '@turf/invariant'

export default {
  name: 'k-measure-tool',
  inject: ['kActivity'],
  props: {
    distanceUnit: {
      type: String,
      default: 'kilometers'
    },
    areaUnit: {
      type: String,
      default: 'kilometers'
    }
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
        { id: 'measure-distance', icon: 'las la-project-diagram', toggled: this.measureMode === 'measure-distance', tooltip: 'KMeasureTool.MEASURE_DISTANCE', handler: () => { this.setMode('measure-distance') } },
        { id: 'measure-area', icon: 'las la-draw-polygon', toggled: this.measureMode === 'measure-area', tooltip: 'KMeasureTool.MEASURE_AREA', handler: () => { this.setMode('measure-area') } },
        { id: 'see-measure-value', icon: 'las la-hand-pointer', toggled: this.measureMode === 'see-measure-value', tooltip: 'KMeasureTool.MEASURE_AREA', handler: () => { this.setMode('see-measure-value') } },
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
    clearCurrentMeasurement () {
      if (this.workingLayer) this.workingLayer.off('pm:vertexadded', this.onVertexAdded)
      this.workingLayer = null
      if (this.cursorTooltip) this.kActivity.map.removeLayer(this.cursorTooltip)
      this.cursorTooltip = null
      for (const layer of this.currentMeasurementLayers) this.kActivity.map.removeLayer(layer)
      this.currentMeasurementLayers = []
      this.kActivity.map.off('mousemove', this.onMouseMove)
      this.kActivity.map.pm.disableDraw()
      this.measureValue = '--'
    },
    clearAllMeasurements () {
      this.clearCurrentMeasurement()
      for (const layer of this.toolLayers) this.kActivity.map.removeLayer(layer)
      this.toolLayers = []
    },
    makeDistanceTooltip (geojson, coords, index, latlng) {
      const totalLen = length(geojson, { unit: this.distanceUnit })
      const segmentLen = distance(coords[index], coords[index - 1], { unit: this.distanceUnit })
      const inBearing = bearing(coords[index], coords[index - 1])
      const outBearing = bearing(coords[index - 1], coords[index])

      const content = `In: ${inBearing.toFixed(2)}°<br/>
                       Out: ${outBearing.toFixed(2)}°<br/>
                       +${segmentLen.toFixed(3)}km<br/>
                       ${totalLen.toFixed(3)}km`

      // const marker = L.marker(latlng, { icon: this.markerIcon }).bindTooltip(content)
      const marker = L.marker(latlng).bindTooltip(content)
      this.currentMeasurementLayers.push(marker)
      this.kActivity.map.addLayer(marker)
    },
    onDrawStart (e) {
      // listen for vertex added to shape
      e.workingLayer.on('pm:vertexadded', this.onVertexAdded)
    },
    onDrawEnd (e) {
      this.clearCurrentMeasurement()
    },
    onVertexAdded (e) {
      if (!this.workingLayer) {
        // first point added, record working layer and listen to mousemove from now on
        this.workingLayer = e.workingLayer
        this.kActivity.map.on('mousemove', this.onMouseMove)
      } else {
        const geojson = e.workingLayer.toGeoJSON()
        const coords = getCoords(geojson)
        this.makeDistanceTooltip(geojson, coords, coords.length - 1, e.latlng)
      }
    },
    onMouseMove (e) {
      if (!this.workingLayer) return

      const geojson = this.workingLayer.toGeoJSON()
      const coords = getCoords(geojson)

      const geoCoords0 = coords[coords.length - 1]
      const geoCoords1 = [ e.latlng.lng, e.latlng.lat ]
      const d = distance(geoCoords0, geoCoords1, { unit: this.distanceUnit })
      const dstr = `${d.toFixed(3)}km`
      const b = bearing(geoCoords0, geoCoords1)
      const bstr = `${b.toFixed(2)}°`
      let astr = ''

      if (this.measureMode === 'measure-area' && coords.length >= 2) {
        coords.push(geoCoords1)
        coords.push(coords[0])
        const a = area(polygon([coords]))
        astr = `${a.toFixed(2)}m²`
        this.measureValue = astr
      } else if (this.measureMode === 'measure-distance') {
        coords.push(geoCoords1)
        const d2 = length(lineString(coords))
        this.measureValue = `${d2.toFixed(2)}km`
      }

      if (!this.cursorTooltip) {
        this.cursorTooltip = L.tooltip({ permanent: true })
        this.cursorTooltip.setLatLng(e.latlng)
        this.kActivity.map.addLayer(this.cursorTooltip)
      } else {
        this.cursorTooltip.setLatLng(e.latlng)
      }

      this.cursorTooltip.setContent('\t' + bstr + ' ' + dstr + ' ' + astr)
    },
    onCreate (e) {
      // when a shape is created
      this.toolLayers.push(e.layer)
      // when measuring area, add a marker at the last point
      if (this.measureMode === 'measure-area') {
        const geojson = e.layer.toGeoJSON()
        const coords = getCoords(geojson)[0]
        const last = coords.length - 1
        this.makeDistanceTooltip(geojson, coords, last, L.latLng(coords[last][1], coords[last][0]))
        // and add a tooltip on the polygon too
        const a = area(geojson)
        e.layer.bindTooltip(`${a.toFixed(2)}m²`)
      }
      // move measurement layers to tool layers
      this.toolLayers = this.toolLayers.concat(this.currentMeasurementLayers)
      this.currentMeasurementLayers = []
    }
  },
  created () {
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
  },
  mounted () {
    this.toolLayers = []
    this.currentMeasurementLayers = []

    this.kActivity.map.on('pm:drawstart', this.onDrawStart)
    this.kActivity.map.on('pm:drawend', this.onDrawEnd)
    this.kActivity.map.on('pm:create', this.onCreate)

    /*
    this.markerIcon = L.divIcon({
      html: '<i class="las la-info-circle"></i>',
      iconSize: L.point(32, 32),
      className: 'measure-tool-icon'
    });
    */

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
  .measure-tool-icon {
    color: red;
    text-align: center;
    line-height: 32px;
  }
</style>
