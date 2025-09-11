<template>
  <div class="q-pa-xs">
    <q-input
      :label="$tie(label)"
      v-model="inputValue"
      clearable
      borderless
      dense
      debounce="500"
      @update:model-value="onSearch"
    >
      <template v-slot:before v-if="!hideIcon">
        <div class="row">
          <q-icon class="q-pl-xs" dense name="search" />
        </div>
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'KFilter.SEARCH_LABEL'
  },
  hideIcon: {
    type: Boolean,
    default: false
  },
  onSearch: {
    type: Function,
    default: () => {}
  }
})

// Data
const inputValue = ref(props.value)

</script>
