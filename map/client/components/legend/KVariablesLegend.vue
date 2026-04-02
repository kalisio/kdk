<template>
  <KLegendRenderer
    v-if="variables.length"
    :label="label"
    :labelClass="labelClass"
  >
    <!-- content -->
    <template v-for="variable in variables" :key="variable.name">
      <!-- caption -->
      <span class="text-caption">{{ variable.label }}</span>
      <!-- colorscale -->
      <KColorScale
        v-bind="variable.colorScale"
      />
    </template>
  </KLegendRenderer>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import { computed } from 'vue'
import { i18n } from '../../../../core/client'
import { Units } from '../../../../core/client/units'
import { useCurrentActivity } from '../../composables'
import { KColorScale } from '../../../../core/client/components'
import KLegendRenderer from './KLegendRenderer.vue'

// Props
const props = defineProps({
  layer: {
    type: Object,
    required: true
  },
  label: {
    type: String,
    default: undefined
  },
  labelClass: {
    type: String,
    default: undefined
  },
  content: { // Used to provide properties to underlying color scale
    type: Object,
    default: () => null
  }
})

// Data
const { CurrentActivity } = useCurrentActivity({ selection: false, probe: false })

// Computed
const variables = computed(() => {
  return _.filter(props.layer.variables, variable => {
    if (variable.chromajs) return true
    logger.warn(`[KDK] variable '${variable.name}' must have a 'chromajs' property`)
    return false
  })
    .map(variable => {
      // Pick useful properties
      let { name, label, chromajs, unit } = _.pick(variable, ['name', 'label', 'chromajs', 'unit'])
      // Avoid mutating layer data for color scale props
      const colorScale = _.merge(_.cloneDeep(chromajs), props.content)
      // We allow variable name to be customized based on level information
      label = _.template(i18n.tie(label))({
        Units,
        level: (CurrentActivity.value ? CurrentActivity.value.selectedLevel : null),
        levelUnit: (CurrentActivity.value && CurrentActivity.value.selectableLevels ? CurrentActivity.value.selectableLevels.unit : '')
      })
      // The same for legend ticks
      const format = _.get(props.content, 'layout.ticks.format')
      // Template function as by default it's a configuration object for mathjs ?
      if (typeof format === 'string') {
        _.set(colorScale, 'layout.ticks.format', _.template(format))
      }
      label = `${label} (${Units.getTargetUnitSymbol(unit)})`
      // Rename required properties for backward compatibility
      if (colorScale.scale) {
        colorScale.colors = colorScale.scale
        delete colorScale.scale
      }
      // Convert to target unit
      if (colorScale.domain) {
        colorScale.domain = colorScale.domain.map(value => Units.convert(value, unit))
      }
      if (colorScale.classes) {
        colorScale.classes = colorScale.classes.map(value => Units.convert(value, unit))
      }
      return {
        name,
        label,
        colorScale
      }
    })
})

</script>
