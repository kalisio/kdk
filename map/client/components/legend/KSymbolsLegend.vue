<template>
  <template v-for="(section, index) in sections" :key="index" class="column full-width">
    <q-list dense>
      <template v-for="element in getElements(section)" :key="element.name" class="row full-width items-center">
        <q-item dense>
          <q-item-section avatar>
            <component 
              :is="element.component" 
              v-bind="element.props" 
              :key="element.label" 
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ $tie(element.label )}}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <q-separator v-if="index < sections.length - 1" />
    </q-list>
  </template>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import { computed } from 'vue'
import { loadComponent } from '../../../../core/client/utils.js'

// props
const props = defineProps({
  content: {
    type: Object,
    required: true
  }
})

// computed
const sections = computed(() => {
  return _.keys(props.content)
})

// function 
function getElements (section) {
  return props.content[section].map(element => {
    const symbol = element.symbol
    const label = element.label
    if (!symbol || !label) {
      logger.error(`element ${element.label || element} is invalid in section ${section}`)
      return
    }
    const entries = _.entries(element.symbol)
    if (entries.length !== 1) {
      logger.error(`invalid entries for symbol in element ${element.label || element}`)
      return
    }
    let component = entries[0][0]
    const props =  entries[0][1]
    if (!_.startsWith(component, 'Q') && !_.startsWith(component, 'q-')) {
      component = loadComponent(component)
    }
    return { label, component, props }
  })
}
</script>

<style lang="scss" scoped>
  .q-item__section--avatar {
    min-width: 16px;
  }
</style>