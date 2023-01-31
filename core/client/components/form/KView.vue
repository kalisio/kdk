<template>
  <div class="column">
    <!--
      Non-grouped fields
     -->
    <template v-for="field in fields" :key="field.name">
      <div
        v-if="!field.group"
         class="row items-center"
        v-bind:class="{ 'k-view-row': separators }"
      >
        <!-- Field label -->
        <span class="col-xs-5 col-sm-4 col-3 text-caption ellipsis">
          {{ getLabel(field) }}
        </span>
        <!-- Field value -->
        <component class="col"
          :is="field.component"
          v-bind="$props"
          :properties="field"
          :readOnly="true"
        />
      </div>
    </template>
    <!--
      Grouped fields
     -->
    <template v-for="group in groups" :key="group">
      <q-expansion-item icon="las la-file-alt" :group="group" :label="$t(group)">
        <template v-for="field in fields" :key="field.group + field.name">
          <div
            v-if="field.group === group"
            class="row items-center"
            v-bind:class="{ 'k-view-row': separators }"
          >
            <!-- Field label -->
            <span class="col-xs-5 col-sm-4 col-3 text-caption ellipsis">
              {{ getLabel(field) }}
            </span>
            <!-- Field value -->
            <component class="col"
              :is="field.component"
              v-bind="$props"
              :properties="field"
              :readOnly="true" />
          </div>
        </template>
      </q-expansion-item>
    </template>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, watch } from 'vue'
import { loadComponent } from '../../utils.js'
import { i18n } from '../../i18n.js'

// Props
const props = defineProps({
  schema: {
    type: Object,
    default: () => null
  },
  values: {
    type: Object,
    default: () => null
  },
  separators: {
    type: Boolean,
    default: false
  }
})

// Data
const fields = ref([])
const groups = ref([])

// Watch
watch(() => props.schema, () => {
  refresh()
}, { immediate: true })

// Functions
function getLabel (field) {
  return i18n.tie(_.get(field, 'field.label'))
}
async function refresh () {
  // clear the states
  fields.value = []
  groups.value = []
  // build the fields
  // 1- assign a name corresponding to the key to enable a binding between properties and fields
  // 2- assign a component key corresponding to the component path
  // 3- load the component if not previously loaded
  if (props.schema) {
    Object.keys(props.schema.properties).forEach(property => {
      const field = props.schema.properties[property]
      // 1- assign a name corresponding to the key to enable a binding between properties and fields
      field.name = property
      // 2 - qdds the field to the list of fields to be rendered
      fields.value.push(field)
      if (field.group && !this.groups.includes(field.group)) groups.value.push(field.group)
      // 3- load the component
      field.component = loadComponent(field.field.component)
    })
  }
}
</script>

<style lang="scss">
  .k-view-row {
    border-bottom: solid 1px $secondary;
  }
  .k-view-row:hover {
    background: $secondary;
  }
</style>
