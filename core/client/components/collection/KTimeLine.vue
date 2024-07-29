<template>
  <div v-if="items.length > 0" class="scroll">
    <q-timeline 
      color="primary"
      :layout="layout"
      :side="side"
    >
      <q-infinite-scroll 
        @load="onLoad" 
        :initial-index="1"
        :offset="100" 
      >
        <template v-for="(item, index) in items" :key="index">
          <q-timeline-entry :color="computedColor">
            <template v-slot:title>
              <slot name="entry-title">
                {{  getTitle(item) }}
              </slot>
            </template>
            <template v-slot:subtitle>
              <slot name="entry-subtitle">
                <div class="row items-center">
                  <div>{{  getTime(item) }}</div>
                  <template v-for="tag in getTags(item)" :key="tag.name">
                    <KChip :object="tag" />
                  </template>
                </div>
              </slot>
            </template>
            <slot name="entry-content">
              <div v-html="Document.sanitizeHtml(getContent(item))" />
            </slot>
          </q-timeline-entry>
        </template>
        <template v-slot:loading>
          <div class="text-center q-my-md">
            <q-spinner-dots 
              color="primary" 
              size="40px" 
            />
          </div>
        </template>
      </q-infinite-scroll>
    </q-timeline>
  </div>
  <!--
    Empty slot
  -->    
  <div v-else>
    <slot name="empty">
      <div class="row justify-center">
        <KStamp 
          icon="las la-exclamation-circle" 
          icon-size="1.6rem" 
          :text="$t('KTimeLine.NO_ENTRY')" 
          direction="horizontal" 
        />
      </div>
    </slot>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, watch, toRefs, onBeforeMount, onBeforeUnmount } from 'vue'
import { useCollection } from '../../composables'
import { Events } from '../../events.js'
import { Document } from '../../document.js'
import KChip from '../KChip.vue'
import KStamp from '../KStamp.vue'

// Props
const props = defineProps({
  contextId: {
    type: String,
    default: undefined
  },
  service: {
    type: String,
    required: true
  },
  baseQuery: {
    type: Object,
    default: () => {}
  },
  filterQuery: {
    type: Object,
    default: () => {}
  },
  processor: {
    type: Function,
    default: undefined
  },
  nbItemsPerPage: {
    type: Number,
    default: 10
  },
  listStrategy: {
    type: String,
    default: 'smart'
  },
  layout: {
    type: String,
    default: 'dense',
    validator: (value) => {
      return ['dense', 'comfortable', 'loose'].includes(value)
    }
  },
  side: {
    type: String,
    default: 'left',
    validator: (value) => {
      return ['left', 'right'].includes(value)
    }
  },
  schema: {
    type: Object,
    default: () => { 
      return {
        timeField: 'createdAt',
        colorField: 'color',
        titleField: 'name',
        contentField: 'description',
        tagsField: 'tags'
      }
    }
  }
})

// Emits
const emit = defineEmits(['collection-refreshed', 'selection-changed'])

// Data
const { items, nbTotalItems, nbPages, currentPage, refreshCollection, resetCollection } = useCollection(_.merge(toRefs(props), { appendItems: ref(true) }))
let doneFunction = null

// Watch
watch(items, onCollectionRefreshed)

// Functions
function getTime (item) {
  return _.get(item, _.get(props.schema, 'timeField', 'createdAt'))
}
function getColor (item) {
  return _.get(item, _.get(props.schema, 'colorField', 'color'))
}
function getTitle (item) {
  return _.get(item, _.get(props.schema, 'titleField', 'name'))
}
function getContent (item) {
  return _.get(item, _.get(props.schema, 'contentField', 'description'))
}
function getTags (item) {
  return _.get(item, _.get(props.schema, 'tagsField', 'tags'))
}
function onLoad (index, done) {
  currentPage.value = index
  refreshCollection()
  doneFunction = done
}
function onCollectionRefreshed () {
  emit('collection-refreshed', items.value)
  if (doneFunction) {
    doneFunction(items.value.length === nbTotalItems.value ? true : false)
    doneFunction = null
  }
}

// Hooks
onBeforeMount(() => {
  refreshCollection()
  // Whenever the user abilities are updated, update collection as well
  Events.on('user-abilities-changed', refreshCollection)
})
onBeforeUnmount(() => {
  Events.off('user-abilities-changed', refreshCollection)
})

// Expose
defineExpose({
  items,
  nbTotalItems,
  nbPages,
  currentPage,
  refreshCollection,
  resetCollection
})
</script>
