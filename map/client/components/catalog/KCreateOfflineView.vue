<template>
  <!--
    Form section
  -->
  <KForm
    ref="form"
    :schema="schema"
    class="q-pa-sm"
  />
</template>
<script setup>
import { ref, computed } from 'vue'
import KForm from '../../../../core/client/components/form/KForm.vue'

// Data
const form = ref(null)

// Computed
const schema = computed(() => {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'http://www.kalisio.xyz/schemas/offline-view.create.json#',
    description: 'Map offline view creation schema',
    type: 'object',
    properties: {
      minZoom: {
        type: 'number',
        default: 8,
        field: {
          component: 'form/KNumberField',
          label: 'KCreateOfflineView.MIN_ZOOM_FIELD_LABEL'
        }
      },
      maxZoom: {
        type: 'number',
        default: 10,
        field: {
          component: 'form/KNumberField',
          label: 'KCreateOfflineView.MAX_ZOOM_FIELD_LABEL'
        }
      },
      nbConcurrentRequests: {
        type: 'number',
        default: 10,
        field: {
          component: 'form/KNumberField',
          label: 'KCreateOfflineView.NB_CONCURRENT_REQUESTS_FIELD_LABEL'
        }
      }
    },
    required: ['minZoom', 'maxZoom', 'nbConcurrentRequests']
  }
})

// Functions
async function apply () {
  const { isValid, values } = form.value.validate()
  if (isValid) {
    return values
  }
  return isValid
}

// Expose
defineExpose({
  apply
})
</script>
