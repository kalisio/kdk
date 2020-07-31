<template>
  <canvas ref="canvas" v-show="visible" class='k-legend-canvas' :width="canvasWidth" :height="canvasHeight" @click="onClickLegend">
    <q-tooltip v-if="hint" anchor="top middle" self="bottom middle" :offset="[10, 20]" v-show="hint">
      {{hint}}
    </q-tooltip>
  </canvas>
</template>

<script>
import _ from 'lodash'
import math from 'mathjs'

// Get the unique global symbol to store event listeners on a leaflet object
const DATA_LISTENER_KEY = Symbol.for('data-listener')

export default {
  name: 'k-color-legend',
  inject: ['kActivity'],
  data () {
    return {
      visible: false,
      hint: null
    }
  },
  computed: {
    canvasWidth () {
      return 90
    },
    canvasHeight () {
      return 0.5 * this.kActivity.engineContainerHeight
    }
  },
  methods: {
    async onColorLegendShowLayer (layer, engineLayer) {
      if (engineLayer.hasData) this.updateColorLegend(layer, engineLayer)
      engineLayer[DATA_LISTENER_KEY] = () => this.updateColorLegend(layer, engineLayer)
      engineLayer.on('data', engineLayer[DATA_LISTENER_KEY])
    },
    onColorLegendHideLayer (layer) {
      if (this.layer && ((this.layer._id === layer._id) || (this.layer.name === layer.name))) {
        this.visible = false
        this.engineLayer.off('data', this.engineLayer[DATA_LISTENER_KEY])
        delete this.engineLayer[DATA_LISTENER_KEY]
      }
    },
    onClickLegend (event) {
      if (!this.unitFrom) return

      const units = _.get(this.layer, 'variables[0].units')
      const index = units.indexOf(this.unitTo)
      if (index === -1) return

      const to = (index + 1) % units.length
      this.unitTo = units[to]

      this.drawLegend()
      this.updateHint()
    },
    updateColorLegend (layer, engineLayer) {
      this.layer = layer
      this.engineLayer = engineLayer

      this.colorMap = _.get(engineLayer, 'colorMap', null)
      this.visible = this.colorMap !== null

      const units = _.get(layer, 'variables[0].units')
      this.unitFrom = units ? units[0] : null
      this.unitTo = units ? units[0] : null

      if (this.visible) {
        this.drawLegend()
        this.updateHint()
      }
    },
    updateHint () {
      if (!this.unitFrom) return

      const units = _.get(this.layer, 'variables[0].units')
      const index = units.indexOf(this.unitTo)
      if (index === -1) return

      const next = (index + 1) % units.length
      this.hint = this.$t('mixins.legend.CONVERT_UNITS', { layer: this.layer.name, unit: units[next] })
    },
    drawLegend () {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d', { alpha: true })

      ctx.save()

      // clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      /*
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      */

      const fontSize = 12
      const topPadding = 10
      const bottomPadding = 30
      const legendHeight = canvas.height - (topPadding + bottomPadding)
      const colorWidth = 30
      const markWidth = 6

      const grad = ctx.createLinearGradient(0, topPadding, 0, topPadding + legendHeight)
      const values = this.scaleToCanvas(grad, this.colorMap, this.unitFrom, this.unitTo)

      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1
      ctx.shadowColor = 'black'
      ctx.shadowBlur = 2

      // draw legend colors
      ctx.fillStyle = grad
      ctx.fillRect(0, topPadding, colorWidth, legendHeight)

      // draw legend values
      ctx.font = `${fontSize}px sans`
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'white'

      const xOffset = colorWidth + markWidth
      for (let i = 0; i < values.length; ++i) {
        const d = values[i][0]
        const v = values[i][1]
        ctx.fillText(v, xOffset, topPadding + d * legendHeight)
      }

      // draw values unit if any
      if (this.unitTo) {
        ctx.textBaseline = 'alphabetic'
        ctx.fillText(`${this.unitTo}`, 0, canvas.height - fontSize)
      }

      ctx.restore()
    },
    scaleToCanvas (grad, scale, unitFrom, unitTo) {
      const values = []

      const colors = scale.colors()
      const domain = scale.domain()
      const classes = scale.classes()

      if (classes) {
        // expect N classes and N-1 colors
        if (colors.length !== (classes.length - 1)) {
          throw new Error(`Colormap has ${classes.length} classes and ${colors.length} colors, we expect N classes and N-1 colors, fix your colormap !`)
        }
        for (let i = 0; i < colors.length; ++i) {
          grad.addColorStop(i / colors.length, colors[i])
          grad.addColorStop((i + 1) / colors.length, colors[i])
          values.push([i / colors.length, classes[i]])
        }
        values.push([1.0, classes[colors.length]])
      } else {
        if (domain.length === colors.length) {
          // as many colors as domain values
          const vl = domain[0]
          const vh = domain[domain.length - 1]

          for (let i = 0; i < domain.length; ++i) {
            const d = (domain[i] - vl) / (vh - vl)
            grad.addColorStop(d, colors[i])
            values.push([d, domain[i]])
          }
        } else {
          // expect 2 domain values, we'll create intermediate values corresponding to colors
          if (domain.length !== 2) {
            throw new Error(`Colormap has ${domain.length} domain values, we expect only 2 when domain size is not equal to scale color size, fix your colormap !`)
          }
          const off = domain[0]
          const sca = domain[domain.length - 1] - domain[0]
          for (let i = 0; i < colors.length; ++i) {
            const d = i / (colors.length - 1)
            grad.addColorStop(d, colors[i])
            const v = off + d * sca
            values.push([d, v])
          }
        }
      }

      // maybe convert to some other unit
      if (unitFrom && unitTo && unitTo !== unitFrom) {
        for (let i = 0; i < values.length; ++i) {
          const oldv = values[i][1]
          const newv = math.unit(oldv, unitFrom).toNumber(unitTo)
          values[i][1] = newv
        }
      }

      // now try to find best way to display those
      for (let i = 0; i < values.length; ++i) {
        const oldv = values[i][1]
        values[i][1] = `${oldv.toFixed(2)}`
      }

      return values
    }
  },
  mounted () {
    this.kActivity.$on('layer-shown', this.onColorLegendShowLayer)
    this.kActivity.$on('layer-hidden', this.onColorLegendHideLayer)
  },
  beforeDestroy () {
    // Delete reference to the legend layer
    this.layer = null
    this.engineLayer = null

    this.kActivity.$off('layer-shown', this.onColorLegendShowLayer)
    this.kActivity.$off('layer-hidden', this.onColorLegendHideLayer)
  }
}
</script>

<style lang="stylus">
  .k-legend-canvas
    cursor: pointer;
</style>
