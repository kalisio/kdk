<template>
  <!--
    Form section
  -->
  <KForm
    ref="form"
    :schema="schema"
    @field-changed="onFieldChanged"
    class="q-pa-sm"
  />
  {{ $t('KCreateOfflineView.NUMBER_OF_TILES') + n }}
</template>

<script setup>
import SphericalMercator from '@mapbox/sphericalmercator'
import { ref, computed } from 'vue'
import KForm from '../../../../core/client/components/form/KForm.vue'

// Props
const props = defineProps({
  zoomLevel: {
    type: Number,
    default: 8
  },
  view: {
    type: Object,
    required: true
  }
})

// Data
const form = ref(null)
const n = ref(0)

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
        default: props.zoomLevel,
        field: {
          component: 'form/KNumberField',
          label: 'KCreateOfflineView.MIN_ZOOM_FIELD_LABEL'
        }
      },
      maxZoom: {
        type: 'number',
        default: props.zoomLevel + 2,
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
function updateNumberOfTiles (minZoom, maxZoom) {
  n.value = 0
  for (let z = minZoom; z <= maxZoom; z++) {
    const sm = new SphericalMercator()
    const tilesBounds = sm.xyz([props.view.west, props.view.south, props.view.east, props.view.north], z)
    n.value += (tilesBounds.maxX - tilesBounds.minX + 1) * (tilesBounds.maxY - tilesBounds.minY + 1)
  }
}
function onFieldChanged () {
  const { minZoom, maxZoom } = form.value.values()
  updateNumberOfTiles(minZoom, maxZoom)
}
async function apply () {
  const { isValid, values } = form.value.validate()
  if (isValid) {
    return values
  }
  return isValid
}

// Immediate
updateNumberOfTiles(props.zoomLevel, props.zoomLevel + 2)

// Expose
defineExpose({
  apply
})
</script>
