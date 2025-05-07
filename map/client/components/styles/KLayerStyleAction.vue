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
import { computed, onMounted, ref } from 'vue'
import { api } from '../../../../core/client'
import { useCurrentActivity } from '../../composables'
import { editLayerStyle } from '../../utils.map'

const { CurrentActivity } = useCurrentActivity()

const styles = ref([])

defineProps({
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: false
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
  await editLayerStyle(layer, styleToApply)
  if (CurrentActivity.value.isInMemoryLayer(layer)) {
    await CurrentActivity.value.resetLayer(layer)
  }
}

onMounted(async () => {
  const res = await api.getService('styles').find()
  console.log(res)
  styles.value = res.data
})
</script>
