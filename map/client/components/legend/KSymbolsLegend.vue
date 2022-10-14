<template>
  <template v-for="(section, name, index) in props.content" key="name" class="column full-width">
    <q-list dense>
      <template v-for="element in section" key="element.label" class="row full-width items-center">
        <q-item dense>
          <q-item-section avatar>
            <q-icon v-bind="element.icon" />
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
import { computed } from 'vue'

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
</script>

<style lang="scss" scoped>
  .q-item__section--avatar {
    min-width: 24px;
  }
</style>