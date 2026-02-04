<template>
  <KLegendRenderer
    v-if="content"
    :label="label"
    :labelClass="labelClass"
  >
    <!-- content -->
    <div>
      <template
        v-for="(section, index) in sections"
        :key="index"
        class="column full-width"
      >
        <q-list dense>
          <template
            v-for="element in getElements(section)"
            :key="element.name"
          >
            <q-item dense>
              <q-item-section avatar v-if="element.component">
                <div class="row justify-center">
                  <component
                    :is="element.component"
                    v-bind="element.props"
                    :key="element.label"
                  />
                </div>
              </q-item-section>
              <q-item-section>
                <q-item-label :class="element.labelClass || 'text-caption'">
                  {{ $tie(element.label) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <q-separator v-if="index < sections.length - 1" style="margin: 8px;" />
        </q-list>
      </template>
    </div>
  </KLegendRenderer>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import { computed } from 'vue'
import { loadComponent } from '../../../../core/client/utils'
import KLegendRenderer from './KLegendRenderer.vue'

// Props
const props = defineProps({
  label: {
    type: String,
    default: undefined
  },
  labelClass: {
    type: String,
    default: undefined
  },
  content: {
    type: Object,
    default: () => null
  }
})

// Computed
const sections = computed(() => {
  return _.difference(_.keys(props.content))
})

// function
function getElements (section) {
  return _.map(props.content[section], element => {
    const symbol = element.symbol
    const label = element.label
    const labelClass = element.labelClass
    if (!symbol && !label) {
      logger.error(`element ${element.label || element} is invalid in section ${section}`)
      return
    }
    // Label only ?
    if (symbol) {
      const entries = _.entries(element.symbol)
      if (entries.length !== 1) {
        logger.error(`invalid entries for symbol in element ${element.label || element}`)
        return
      }
      let component = entries[0][0]
      const props = entries[0][1]
      if (!_.startsWith(component, 'Q') && !_.startsWith(component, 'q-')) {
        component = loadComponent(component)
      }
      return { label, labelClass, component, props }
    } else {
      return { label, labelClass }
    }
  })
}
</script>

<style lang="scss" scoped>
.q-item {
  padding: 1px 0px;
  min-height: 24px;
}
.q-item__section--avatar {
  min-width: 16px;
}
</style>
