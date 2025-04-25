<template>
  <div class="fit row no-wrap">
    <!-- missions timeline  -->
    <div :class="wide ? 'col-11' : 'col-12'">
      <KTimeLine
        service="messages"
        :base-query="baseQuery"
        :filter-query="computedFilterQuery"
        :processor="process"
        :schema="schema"
        :body-renderer="renderer"
        :side-width="15"
        @collection-refreshed="onCollectionRefreshed"
        class="messages-timeline"
      />
    </div>
    <!-- extra space on wider screen -->
    <div v-if="wide" class="col-1" />
  </div>
</template>

<script setup>
import {
  Store,
  composables as kdkCoreComposables
} from '@kalisio/kdk/core.client'
import _ from 'lodash'
import { computed, ref, watch } from 'vue'
import { i18n } from '../../i18n'

// Props
const props = defineProps({
  itemSections: {
    type: Object,
    default: () => null
  },
  itemActions: {
    type: Array,
    default: () => null
  },
  tagFields: {
    type: Object,
    default: () => {}
  },
  messageTypes: {
    type: Object,
    required: true
  },
  baseQueryProp: {
    type: Object,
    default: { $sort: { createdAt: -1 } }
  }
})

// Emits
const emit = defineEmits(['messages-refreshed'])

// Data
const { dense, wide } = kdkCoreComposables.useScreen()
const baseQuery = ref({})
const { filterQuery, hasTimeSelection, hasTagsSelection } =
  kdkCoreComposables.useCollectionFilter({
    service: ref('messages'),
    baseQuery,
    tagFields: props.tagFields
  })
const patternFilter = Store.get('filter')
const schema = {
  timestampField: 'createdAt',
  authorField: 'author',
  colorField: 'color',
  decorationField: 'decorations',
  bodyField: 'body'
}

// Computed
const renderer = computed(() => {
  return {
    component: 'messages/KMessageCard',
    actions: props.itemActions,
    dense: dense.value
  }
})
const computedFilterQuery = computed(() => {
  return _.merge({}, patternFilter.query, filterQuery.value)
})
const filterOffset = computed(() => {
  let offset = 0
  if (hasTimeSelection) offset += 36
  if (hasTagsSelection) offset += 24
  return `${offset}px`
})

watch(
  () => props.tagFields,
  () => {
    const query = {}
    _.forEach(props.tagFields, (values, property) => {
      _.merge(query, { [property]: { $in: _.keys(values) } })
    })
    _.merge(query, props.baseQueryProp)
    baseQuery.value = query
  },
  { immediate: true }
)

// Functions
function process (messages) {
  _.forEach(messages, (message) => {
    const messageType = message.type
    // process tags
    message.decorations = [
      {
        component: 'KChip',
        name: messageType,
        label: i18n.t(props.messageTypes[messageType].label),
        color: props.messageTypes[messageType].color,
        textColor: props.messageTypes[messageType].textColor,
        icon: props.messageTypes[messageType].icon,
        dense: true,
        square: true
      }
    ]
    message.color = props.messageTypes[messageType].color
  })
  return messages
}
function onCollectionRefreshed (messages) {
  emit('messages-refreshed', messages)
}
</script>

<style lang="scss" scoped>
.messages-timeline {
  padding-top: v-bind(filterOffset);
}
</style>
