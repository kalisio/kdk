<template>
  <KLegendRenderer
    v-if="content"
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
        style="height: 46px;"
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
  content: {
    type: String,
    default: '.'
  }
})

// Data
const { CurrentActivity } = useCurrentActivity({ selection: false, probe: false })

// Computed
const variables = computed(() => {
  const regexp = new RegExp(props.content)
  return _.filter(props.layer.variables, variable => {
    if (regexp.test(variable)) {
      if (variable.chromajs) return true
      logger.warn(`[KDK] variable '${variable.name}' must have a 'chromajs' property`)
    }
    return false
  })
    .map(variable => {
      // Pick useful properties
      let { name, label, chromajs, unit } = _.pick(variable, ['name', 'label', 'chromajs', 'unit'])
      // We allow variable name to be customized based on level information
      label = _.template(i18n.tie(label))({
        level: (CurrentActivity.value ? CurrentActivity.value.selectedLevel : null),
        levelUnit: (CurrentActivity.value && CurrentActivity.value.selectableLevels ? CurrentActivity.value.selectableLevels.unit : '')
      })
      // Avoid mutating layer data
      const colorScale = _.cloneDeep(chromajs)
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
        name, label, colorScale
      }
    })
})

</script>
