<template>
  <div class="full-width column">
    <div class="full-width row items-center no-wrap">
      <q-toggle
        v-model="isActive"
        :label="label"
        size="sm"
        :dense="dense"
        @update:model-value="onToggled"
      />
      <div class="full-width q-pa-md">
        <q-separator class="col-grow" />
      </div>
    </div>
    <q-list v-if="isActive">
      <template v-for="property in properties" :key="property.key">
        <KStyleProperty
          v-bind="property"
          v-model="values[property.name]"
          :dense="dense"
          @update:model-value="onPropertyUpdated"
        />
      </template>
    </q-list>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, watch } from 'vue'
import KStyleProperty from './KStyleProperty.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => null
  },
  label: {
    type: String,
    required: true
  },
  properties: {
    type: Array,
    required: true
  },
  dense: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Data
const isActive = ref(null)
const values = ref(null)

// Watch
watch(() => props.modelValue, (value) => {
  values.value = _.clone(value)
  isActive.value = !_.isEmpty(value)
}, { immediate: true })

// Function
function onToggled (value) {
  if (value) {
    values.value = {}
    for (const property of props.properties) values.value[property.name] = property.default
  } else values.value = null
  emit('update:modelValue', values.value)
}
function onPropertyUpdated () {
  emit('update:modelValue', values.value)
}
</script>
