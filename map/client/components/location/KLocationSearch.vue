<template>
  <q-select
    for="location-search"
    id="location-search"
    v-model="location"
    :label="computedLabel"
    clearable
    use-input
    hide-dropdown-icon
    borderless
    hide-bottom-space
    dense
    :options="locations"
    :display-value="locationName"
    :disable="disabled"
    @filter="onSearch"
    @update:model-value="onLocationChanged"
    class="q-pl-sm"
  >
    <!-- Extra actions -->
    <template v-slot:append>
      <div class="q-pl-xs row items-center">
        <!-- geocoders filtering -->
        <KAction
          v-if="hasGeocoders"
          id="configure"
          tooltip="KLocationSearch.FILTER"
          icon="las la-sliders-h"
          color="grey-7"
          size="0.8rem"
          dense
        >
          <q-popup-proxy>
            <KGeocodersFilter
              v-model="selectedGeocoders"
              :geocoders="availableGeocoders"
            />
          </q-popup-proxy>
        </KAction>
      </div>
    </template>
    <!-- Selected item -->
    <template v-slot:selected-item="scope">
      {{ scope.opt.properties ? scope.opt.properties.name : scope.opt.name }}
    </template>
    <!-- Options -->
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps" class="option" dense>
        <q-item-section>
          <q-item-label>{{ scope.opt.properties ? scope.opt.properties.name : scope.opt.name }}</q-item-label>
        </q-item-section>
        <q-item-section avatar v-if="scope.opt.properties.source">
          <q-chip dense size="0.7rem" color="primary" text-color="white">
            {{ $tie(`Geocoders.${scope.opt.properties.source}`) }}
          </q-chip>
        </q-item-section>
        <KLocationTip :location="scope.opt" />
      </q-item>
    </template>
    <!-- No options -->
    <template v-slot:no-option>
      <q-item>
        <q-item-section avatar>
          <q-icon name="las la-frown" color="grey" />
        </q-item-section>
        <q-item-section class="text-grey">
          {{ $t('KLocationSearch.NO_RESULT') }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>

</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watch } from 'vue'
import { i18n } from '../../../../core.client'
import { KAction } from '../../../../core/client/components'
import KGeocodersFilter from './KGeocodersFilter.vue'
import KLocationTip from './KLocationTip.vue'
import { useLocation } from '../../composables'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => null
  },
  label: {
    type: String,
    default: 'KLocationSearch.SEARCH'
  },
  icon: {
    type: String,
    default: null
  },
  geocoders: {
    type: Array,
    default: () => []
  },
  geolocation: {
    type: Boolean,
    default: false
  },
  editor: {
    type: Object,
    default: () => null
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Data
const location = ref(props.modelValue)
const locations = ref([])
const { availableGeocoders, selectedGeocoders, setGeocoders, search: searchLocation } = useLocation()

// Computed
const computedLabel = computed(() => {
  return location.value ? undefined : i18n.tie(props.label)
})
const locationName = computed(() => {
  return _.get(location.value, 'properties.name')
})
const hasGeocoders = computed(() => {
  return !_.isNull(props.geocoders)
})

// Functions
async function onSearch (pattern, update, abort) {
  if (pattern.length < 3) {
    abort()
    return
  }
  const result = await searchLocation(pattern)
  update(() => {
    locations.value = result
  })
}
function onLocationChanged () {
  emit('update:modelValue', location.value)
}

// Hooks
watch(() => props.geocoders, (geocoders) => {
  setGeocoders(geocoders)
}, { immediate: true })
</script>
