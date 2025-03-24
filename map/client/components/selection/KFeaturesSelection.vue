<template>
  <div class="fit column no-wrap">
    <div v-if="hasItems">
      <template v-for="(item, index) in items" :key="item._id">
        <div :class="rendererClass">
          <component
            :id="item._id"
            :item="item"
            :is="itemRenderer"
            v-bind="renderer"
          />
        </div>
      </template>
    </div>
    <div v-else class="row justify-center q-pa-sm">
      <KStamp
        icon="las la-exclamation-circle"
        icon-size="sm"
        :text="$t('KFeaturesSelection.NONE_SELECTED')"
        direction="horizontal"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onBeforeUnmount } from 'vue'
import { loadComponent } from '../../../../core/client/utils'
import KStamp from '../../../../core/client/components/KStamp.vue'
import { useCurrentActivity } from '../../composables/activity.js'

// Props
const props = defineProps({
  renderer: {
    type: Object,
    default: () => {
      return {
        component: 'selection/KSelectedLayerFeatures'
      }
    }
  }
})

// Data
const { getSelectedFeaturesByLayer, CurrentActivity } = useCurrentActivity()

// Computed
const itemRenderer = computed(() => {
  return loadComponent(props.renderer.component)
})
const rendererClass = computed(() => {
  return props.renderer.class || 'q-pa-sm col-12 col-sm-6 col-md-4 col-lg-3'
})
const items = computed(() => {
  return getSelectedFeaturesByLayer()
})
const hasItems = computed(() => {
  return Object.keys(items.value).length > 0
})

// Hooks
// As long as the selection manager is visible we force highlights to appear in order to show the current selection
onBeforeMount(() => {
  CurrentActivity.value.setHighlightMode('all-layers')
})
// Cleanup on destroy
onBeforeUnmount(() => {
  // Activity might have been cleared already
  if (CurrentActivity.value) CurrentActivity.value.setHighlightMode('highlightable-layers')
})
</script>
