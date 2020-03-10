<template>

  <div class="k-legend shadow-2" :style="colorLegendStyle"
    v-show="visible" @click="onColorLegendClick"
  >
    <span class="k-unit-box bg-secondary text-white text-caption"
      :style="colorUnitStyle"
    >
      {{unit}}
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 20]" v-show="hint">{{hint}}</q-tooltip>
    </span>

    <span class="k-gradient-step"
      v-for="gradientStep in gradientSteps" :key="'step'+gradientStep"
      :style="getGradientStepStyle(gradientStep)"
    >
    </span>

    <span class="k-value-step text-white"
      v-for="(unitValue, index) in unitValues" :key="index"
      :style="getUnitValueStyle(index)"
    >
      {{unitValue}}
    </span>
  </div>

</template>

<script>
import _ from 'lodash'
import math from 'mathjs'
const COLOR_STEPS = 10

// Get the unique global symbol to store event listeners on a leaflet object
const DATA_LISTENER_KEY = Symbol.for('data-listener')

export default {
  name: 'k-color-legend',
  inject: ['kActivity'],
  props: {
    // Height of the unit box (in pixels)
    unitHeight: {
      type: Number,
      default: 42
    }
  },
  data () {
    return {
      visible: false,
      unit: null,
      hint: null,
      colorMap: null,
      colors: null,
      values: null,
      unitValues: null,
      showGradient: false
    }
  },
  computed: {
    domainStart () {
      return this.visible ? this.colorMap.domain()[0] : 0
    },
    domainRange () {
      return this.visible ? this.colorMap.domain()[1] - this.colorMap.domain()[0] : 0
    },
    invert () {
      return this.visible ? this.values[0] < this.values[this.values.length - 1] : false
    },
    // Height of the legend (in pixels) WITHOUT the unit box
    colorLegendHeight () {
      const height = 0.50 * this.kActivity.engineContainerHeight
      return height - this.unitHeight
    },
    colorLegendStyle () {
      return {
        height: this.colorLegendHeight + 'px',
        width: '40px',
        fontSize: '12px'
      }
    },
    // This is a number (the number of gradient steps) used in the Vue "v-for" clause - it must be an integer!
    gradientSteps () {
      // If we're not showing a gradient then return zero for the gradient steps,
      // otherwise use Math.trunc() to make it an integer
      return this.showGradient ? Math.trunc(this.colorLegendHeight) : 0
    },
    gradientStepValue () {
      return this.domainRange / this.colorLegendHeight
    },
    colorUnitStyle () {
      return {
        width: '100%',
        height: this.unitHeight + 'px'
      }
    }
  },
  methods: {
    getUnitValueStyle (index) {
      const height = this.colorLegendHeight / this.values.length
      let top = index * height
      // invert: calculate placement from the bottom of the legend
      if (this.invert) {
        top = this.colorLegendHeight - top
      // offset it from the color unit box
      } else {
        top = this.unitHeight + top
      }
      const css = {
        width: '100%',
        height: height + 'px',
        top: top + 'px',
        'text-shadow': '1px 1px 2px black'
      }
      if (!this.showGradient) {
        css.backgroundColor = this.colors ? this.colors[index] : this.colorMap(this.values[index])
      }
      return css
    },
    getGradientStepStyle (gradientStep) {
      let top = gradientStep
      // invert: calculate placement from the bottom of the legend
      if (this.invert) {
        top = this.colorLegendHeight - top
      }
      // offset it from the color unit box
      top = this.unitHeight + top
      // calculate the domain value at this gradient step
      const domainValue = this.domainStart + (gradientStep - 1) * this.gradientStepValue
      return {
        width: '100%',
        height: '1px',
        top: top + 'px',
        backgroundColor: this.colorMap(domainValue)
      }
    },
    async onColorLegendShowLayer (layer, engineLayer) {
      // Check for valid types
      const colorMap = _.get(layer, 'variables[0].chromajs')
      if (!colorMap) return
      // It is required data is here to get color map object ready
      if (engineLayer.hasData) this.addColorLegend(layer, engineLayer)
      // Register to data change
      engineLayer[DATA_LISTENER_KEY] = () => this.addColorLegend(layer, engineLayer)
      engineLayer.on('data', engineLayer[DATA_LISTENER_KEY])
    },
    onColorLegendHideLayer (layer) {
      if (this.legendLayer && ((this.legendLayer._id === layer._id) || (this.legendLayer.name === layer.name))) {
        this.legendEngineLayer.off('data', this.legendEngineLayer[DATA_LISTENER_KEY])
        delete this.legendEngineLayer[DATA_LISTENER_KEY]
        this.hideColorLegend()
      }
    },
    async onColorLegendUpdateForecastLevel () {
      const layer = this.legendLayer
      const engineLayer = this.legendEngineLayer
      this.hideColorLegend()
      // We let Vue update computed data
      await this.$nextTick()
      this.addColorLegend(layer, engineLayer)
    },
    addColorLegend (layer, engineLayer) {
      this.updateColorLegend(layer, engineLayer)
    },
    hideColorLegend () {
      this.updateColorLegend(null, null)
    },
    setColorLegend (visible, unit, hint, colorMap, colors, values, unitValues, showGradient) {
      this.visible = visible
      this.unit = unit
      this.hint = hint
      this.colorMap = colorMap
      this.colors = colors
      this.values = values
      this.unitValues = unitValues
      this.showGradient = showGradient
    },
    resetColorLegend () {
      this.setColorLegend(false, null, null, null, null, null, null, false)
    },
    updateColorLegend (layer, engineLayer) {
      this.legendLayer = layer
      this.legendEngineLayer = engineLayer

      // Reset & hide the color legend
      if (!this.legendLayer) {
        this.resetColorLegend()
      } else {
        const colorMap = this.legendEngineLayer.colorMap
        const scale = _.get(this.legendLayer, 'variables[0].chromajs.scale')
        const units = this.getColorLegendUnits()
        const unit = !units || units.length === 0 ? null : units[0]
        const hint = this.getColorLegendHint(units, unit, this.legendLayer.name)
        const [showGradient, colors, values, unitValues] =
          this.getColorLegendValues(colorMap, scale, units, unit, COLOR_STEPS)
        // We don't have units or steps for this layer, hide it
        if (unit === null || values.length === 0) {
          this.hideColorLegend()
        // Units and steps (re)calculated, update the color legend
        } else {
          this.setColorLegend(true, unit, hint, colorMap, colors, values, unitValues, showGradient)
        }
      }
    },
    // Color legend was clicked - toggle to the next unit
    onColorLegendClick (event) {
      const colorMap = this.legendEngineLayer.colorMap
      const scale = _.get(this.legendLayer, 'variables[0].chromajs.scale')
      const units = this.getColorLegendUnits()
      // There's only one unit, no toggling to do, we're done
      if (units.length <= 1) {
        return
      }
      // Get next unit and recalculate hint and steps
      const nextUnit = this.getNextUnit(units, this.unit)
      const hint = this.getColorLegendHint(units, nextUnit, this.legendLayer.name)
      const [showGradient, colors, values, unitValues] =
        this.getColorLegendValues(colorMap, scale, units, nextUnit, COLOR_STEPS)
      // Units and steps (re)calculated, update the color legend
      this.setColorLegend(true, nextUnit, hint, colorMap, colors, values, unitValues, showGradient)
    },
    getColorLegendUnits () {
      return _.get(this.legendLayer, 'variables[0].units')
    },
    getColorLegendHint (units, unit, layerName) {
      if (!units || units.length <= 1 || !unit) {
        return null
      }
      // Determine hint by calling "this.getNextUnit"
      const nextUnit = this.getNextUnit(units, unit)
      return this.$t('mixins.legend.CONVERT_UNITS', { layer: layerName, unit: nextUnit })
    },
    getColorLegendValues (colorMap, scale, units, unit, steps) {
      if (!colorMap || !units || units.length === 0 || !unit) return []

      let showGradient
      let colors
      let values
      let unitValues
      const unitFrom = units[0] // base unit
      const unitTo = unit

      function valueMap (value) {
        const unitValue = math.unit(value, unitFrom).toNumber(unitTo)
        return Math.round(unitValue, 0).toFixed(0)
      }

      const classes = colorMap.classes()
      // Some tricky logic below:
      //
      // - Depending on whether we have one unit or more than one unit, we perform a unit conversion (or not)
      // - Depending on whether we have 'classes' (predefined values) or not, we display a color 'gradient' or color 'steps'
      // - Depending on whether the Chroma scale is specified as an array of colors, we pass these as "the" colors to
      //   display; otherwise, we'll depend on calling "colorMap(value)" (chroma.js) to determine the colors
      if (classes) {
        showGradient = false
        values = classes
        // Special case: if we have classes, AND the scale is specified as an array of colors, then we take these
        // as THE "colors" to be displayed by the color legend, so we then bypass "colorMap(value)" for getting the color
        if (scale && Array.isArray(scale)) {
          colors = scale
        }
        // Only one unit, we don't need to convert, return the class values as-is
        if (units.length === 1) {
          unitValues = values
        } else {
          unitValues = values.map(valueMap)
        }
      } else {
        showGradient = true
        values = []
        const dm = colorMap.domain()[0]
        const dd = colorMap.domain()[1] - dm
        for (let i = 0; i < steps; i++) {
          const value = dm + i / (steps - 1) * dd
          values.push(value)
        }
        unitValues = values.map(valueMap)
      }

      return [showGradient, colors, values, unitValues]
    },
    getNextUnit (units, currentUnit) {
      // No available units
      if (!units || units.length <= 1 || !currentUnit) return null

      // 'Rotate' from the current unit to the next
      const index = units.findIndex(unit => unit === currentUnit)
      const newIndex = index === -1 ? null : index === units.length - 1 ? 0 : index + 1
      const unit = newIndex === null ? null : units[newIndex]

      return unit
    }
  },
  mounted () {
    this.resetColorLegend()
    this.kActivity.$on('layer-shown', this.onColorLegendShowLayer)
    this.kActivity.$on('layer-hidden', this.onColorLegendHideLayer)
    //this.kActivity.$on('forecast-level-changed', this.onColorLegendUpdateForecastLevel)
  },
  beforeDestroy () {
    // Delete reference to the legend layer
    this.legendLayer = null
    this.legendEngineLayer = null
    this.resetColorLegend()
    this.kActivity.$off('layer-shown', this.onColorLegendShowLayer)
    this.kActivity.$off('layer-hidden', this.onColorLegendHideLayer)
    //this.kActivity.$off('forecast-level-changed', this.onColorLegendUpdateForecastLevel)
  }
}
</script>

<style lang="stylus">
.k-legend
  position: relative;
  cursor: pointer;
  border: none

.k-unit-box
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;

.k-value-step
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

.k-gradient-step
  position: absolute;
  display: inline-block;
</style>
