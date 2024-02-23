<template>
  <KLegendRenderer
    :label="label"
  >
  <div class="q-pl-md">
    <template v-for="variable in variables" :key="variable.name">
      <!-- caption -->
      <span class="text-caption">{{ variable.label }}</span>
      <!-- colorscale -->
      <KColorScale
        v-bind="variable.colorScale"
        style="height: 46px;"
      />
    </template>
  </div>
  </KLegendRenderer>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { i18n } from '../../../../core/client'
import { Units } from '../../../../core/client/units'
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
  content: {
    type: Object,
    default: () => null
  }
})

// Computed
const variables = computed(() => {
  return props.layer.variables.filter(variable => {
    return _.has(variable, 'chromajs')
  })
    .map(variable => {
      // Pick useful properties
      let { name, label, chromajs, unit } = _.pick(variable, ['name', 'label', 'chromajs', 'unit'])
      // Avoid mutating layer data
      const colorScale = _.cloneDeep(chromajs)
      label = `${i18n.tie(label)} (${Units.getTargetUnitSymbol(unit)})`
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
