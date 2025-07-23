<template>
  <KSubMenu
    v-if="styles.length > 0"
    id="style-layer-menu"
    size="sm"
    dense
    direction="vertical"
    action-renderer="item"
    :content="menuContent"
    class="q-pr-xs"
    :propagate="false"
    :label="label"
    :icon="icon"
  />
</template>

<script setup>
import _ from 'lodash'
import { computed, onMounted, ref } from 'vue'
import { api } from '../../../../core/client'
import { useCurrentActivity } from '../../composables'
import { editLayerStyle, editFilterStyle } from '../../utils.map'
import KSubMenu from '../../../../core/client/components/menu/KSubMenu.vue'

const { CurrentActivity } = useCurrentActivity()

const styles = ref([])

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: false
  },
  ignoreFeatureStyle: {
    type: Boolean,
    default: false
  }
})

const menuContent = computed(() => {
  if (styles.value.length <= 0) return []
  return styles.value.map((style, i) => ({
    id: 'apply-style-to-layer-' + i,
    label: style.name,
    handler: (layer) => applyToLayer(layer, style)
  }))
})

async function applyToLayer (layer, styleToApply) {
  if (_.get(layer, 'filter')) {
    const engineStyle = _.pick(_.get(CurrentActivity.value, 'activityOptions.engine.style', {}), ['point', 'line', 'polygon'])
    await editFilterStyle(layer.layer, layer.filter, engineStyle, styleToApply, props.ignoreFeatureStyle)
  } else {
    await editLayerStyle(layer, styleToApply, props.ignoreFeatureStyle)
    if (CurrentActivity.value.isInMemoryLayer(layer)) {
      await CurrentActivity.value.resetLayer(layer)
    }
  }
}

onMounted(async () => {
  const res = await api.getService('styles').find()
  styles.value = res.data
})
</script>
