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
import { getStyleType } from '../../utils/utils.style.js'
import KSubMenu from '../../../../core/client/components/menu/KSubMenu.vue'

// Props
const props = defineProps({
  context: {
    type: Object,
    required: true
  },
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
  },
  maxItems: {
    type: Number,
    default: 250
  },
  filteringPolicy: {
    type: String,
    default: 'none',
    validator: (value) => {
      return ['none', 'permissive', 'strict'].includes(value)
    }
  }
})

// Data
const { CurrentActivity } = useCurrentActivity()
const styles = ref([])

// Computed
const menuContent = computed(() => {
  if (styles.value.length <= 0) return []
  return styles.value.map((style, i) => ({
    id: 'apply-style-to-layer-' + i,
    label: style.name,
    handler: () => applyToLayer(style)
  }))
})

// Functions
async function applyToLayer (styleToApply) {
  const layer = props.context
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
async function getFilterQuery () {
  const layer = _.has(props.context, 'layer') ? props.context.layer : props.context
  let filterQuery = {}
  if (!['permissive', 'strict'].includes(props.filteringPolicy) || !_.has(layer, 'geometryTypes')) return filterQuery

  const styleTypes = _.uniq(_.map(layer.geometryTypes, type => getStyleType(type)))
  if (props.filteringPolicy === 'strict') {
    filterQuery = { $and: ['point', 'line', 'polygon'].map(type => ({ [type]: { $exists: styleTypes.includes(type) } })) }
  } else {
    filterQuery = { $or: styleTypes.map(type => ({ [type]: { $exists: true } })) }
  }

  return filterQuery
}

onMounted(async () => {
  const baseQuery = { $limit: props.maxItems, $sort: { name: 1 } }
  const filterQuery = await getFilterQuery()
  const res = await api.getService('styles').find({ query: Object.assign({}, baseQuery, filterQuery) })
  styles.value = res.data
})
</script>
