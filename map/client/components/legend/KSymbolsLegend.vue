<template>
  <template v-for="(section, index) in props.content" :key="index" class="column full-width">
    <q-list dense>
      <template v-for="element in section" :key="element.name" class="row full-width items-center">
        <q-item dense>
          <q-item-section avatar>
            <component 
              :is="getSymbolCommponent(element)" 
              v-bind="getSymbolProps(element)" 
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
      <q-separator v-if="index < sectionCount - 1" />
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
const sectionCount = computed(() => {
  return _.size(props.content)
})

// function 
function getSymbolCommponent (element) {
  if (!element.symbol) {
    logger.error(`symbol must be defined for element ${element.label || element}`)
    return
  }
  const entries = _.entries(element.symbol)
  if (entries.length !== 1) {
    logger.error(`invalid entries for symbol in element ${element.label || element}`)
    return
  }
  const component = entries[0][0]
  if (_.startsWith(component, 'Q') || _.startsWith(component, 'q-')) return component
  return loadComponent(entries[0][0])
}
function getSymbolProps (element) {
  if (!element.symbol) {
    logger.error(`symbol must be defined for element ${element.label || element}`)
    return
  }
  const entries = _.entries(element.symbol)
  if (entries.length !== 1) {
    logger.error(`invalid entries for symbol in element ${element.label || element}`)
    return
  }
  return entries[0][1]
}
</script>

<style lang="scss" scoped>
  .q-item__section--avatar {
    min-width: 24px;
  }
</style>
