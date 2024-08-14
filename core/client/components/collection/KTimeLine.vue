<template>
  <div class="column no-wrap">
    <!--
      Header
    -->
    <div class="q-pr-xs q-pb-xs">
      <slot name="header">
        <KPanel
          :content="header"
          :class="headerClass"
         />
      </slot>
    </div>
    <div v-if="items.length > 0" class="scroll">
      <!--
        Content
      -->
      <q-timeline
        color="primary"
        :layout="layout"
      >
        <q-infinite-scroll
          @load="onLoad"
          :initial-index="1"
          :offset="100"
        >
          <template v-for="item in items" :key="item._id">
            <!-- Heading entry if any -->
            <q-timeline-entry
              v-if="getHeading(item)"
              :heading="true"
            >
              <div class="k-timeline-heading">
                {{ getHeading(item) }}
              </div>
            </q-timeline-entry>
            <!-- Item entry -->
            <q-timeline-entry
              :color="getColor(item)"
            >
              <template v-slot:title>
                <slot name="title">
                  <div v-if="getTitle(item)" class="text-h6">
                    {{ getTitle(item) }}
                  </div>
                </slot>
              </template>
              <template v-slot:subtitle>
                <slot name="subtitle">
                  <div class="row items-center q-gutter-x-sm">
                    <span v-if="getTimestamp(item)">
                      {{  getTimestamp(item) }}
                    </span>
                    <KPanel
                      v-if="getDecoration(item)"
                      :content="getDecoration(item)"
                    />
                  </div>
                </slot>
              </template>
              <div v-if="bodyRenderer" :class="bodyRendererClass">
                <component
                  :id="item._id"
                  :service="service"
                  :item="item"
                  :contextId="contextId"
                  :is="bodyRendererComponent"
                  v-bind="renderer"
                />
              </div>
              <div v-else :class="$q.screen.lt.md ? 'q-pr-sm' :'q-pr-md'">
                {{ item.body }}
              </div>
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
    <!-- Empty slot -->
    <div v-else>
      <slot name="empty">
        <div class="row justify-center">
          <KStamp
            icon="las la-exclamation-circle"
            icon-size="1.6rem"
            :text="$t('KTimeLine.EMPTY_LABEL')"
            direction="horizontal"
          />
        </div>
      </slot>
    </div>
    <!--
      Footer
    -->
    <div>
      <slot name="footer">
        <q-separator inset v-if="footer"/>
        <KPanel
          :content="footer"
          :class="footerClass"
        />
      </slot>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import moment from 'moment'
import { ref, computed, watch, toRefs, onBeforeMount, onBeforeUnmount } from 'vue'
import { useCollection } from '../../composables'
import { Events } from '../../events.js'
import { Time } from '../../time.js'
import { loadComponent } from '../../utils'
import KStamp from '../KStamp.vue'
import KPanel from '../KPanel.vue'

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
    default: () => { return { $sort: { createdAt: -1 } } }
  },
  filterQuery: {
    type: Object,
    default: () => {}
  },
  nbItemsPerPage: {
    type: Number,
    default: 10
  },
  listStrategy: {
    type: String,
    default: 'smart'
  },
  bodyRenderer: {
    type: Object,
    default: () => null
  },
  layout: {
    type: String,
    default: 'dense',
    validator: (value) => {
      return ['dense', 'comfortable', 'loose'].includes(value)
    }
  },
  schema: {
    type: Object,
    default: () => {
      return {
        colorField: 'color',
        titleField: 'name',
        timestampField: 'createdAt',
        contentField: 'description',
        decorationField: 'tags'
      }
    }
  },
  processor: {
    type: Function,
    default: undefined
  },
  header: {
    type: [Array, Object],
    default: () => null
  },
  headerClass: {
    type: String,
    default: undefined
  },
  footer: {
    type: [Array, Object],
    default: () => null
  },
  footerClass: {
    type: String,
    default: undefined
  }
})

// Emits
const emit = defineEmits(['collection-refreshed', 'selection-changed'])

// Data
const { items, nbTotalItems, currentPage, refreshCollection } = useCollection(_.merge(toRefs(props), { appendItems: ref(true) }))
let doneFunction = null

// Computed
const bodyRendererComponent = computed(() => {
  return loadComponent(props.bodyRenderer.component)
})
const bodyRendererClass = computed(() => {
  return props.bodyRenderer.class || 'col-12'
})

// Watch
watch(items, onCollectionRefreshed)

// Functions
function getHeading (item) {
  const currentTimestamp = moment(_.get(item, _.get(props.schema, 'timestampField')))
  if (!currentTimestamp || !currentTimestamp.isValid()) return false
  const heading = _.capitalize(currentTimestamp.format('MMMM, YYYY'))
  if (!item.previous) return heading
  const previousTimestamp = moment(_.get(item.previous, _.get(props.schema, 'timestampField')))
  if (!previousTimestamp || !previousTimestamp.isValid()) return heading
  if (currentTimestamp.year() !== previousTimestamp.year()) return heading
  if (currentTimestamp.month() !== previousTimestamp.month()) return heading
  return null
}
function getTimestamp (item) {
  const time = _.get(item, _.get(props.schema, 'timestampField'))
  if (time) return `${Time.format(time, 'date.long')} - ${Time.format(time, 'time.long')}`
}
function getColor (item) {
  return _.get(item, _.get(props.schema, 'colorField'))
}
function getTitle (item) {
  return _.get(item, _.get(props.schema, 'titleField'))
}
function getDecoration (item) {
  return _.get(item, _.get(props.schema, 'decorationField'))
}
function onLoad (index, done) {
  currentPage.value = index
  refreshCollection()
  doneFunction = done
}
function onCollectionRefreshed () {
  emit('collection-refreshed', items.value)
  // set previous item. This is required to compute whether it must display an heading or not
  _.forEach(items.value, (item, index) => {
    item.previous = index > 0 ? items.value[index - 1] : null
  })
  // call done callback if needed
  if (doneFunction) {
    doneFunction(items.value.length === nbTotalItems.value)
    doneFunction = null
  }
}

// Hooks
onBeforeMount(() => {
  refreshCollection()
  Events.on('user-abilities-changed', refreshCollection)
})
onBeforeUnmount(() => {
  Events.off('user-abilities-changed', refreshCollection)
})
</script>

<style lang="scss">
.q-timeline__heading-title {
  padding-bottom: 8px;
}
.k-timeline-heading {
  font-size: 1.25rem;
  font-weight: bold;
}
.q-timeline__title {
  margin-bottom: 4px;
}
.q-timeline__subtitle {
  margin-bottom: 0px;
  opacity: 0.9;
}
.q-timeline__content {
  padding-bottom: 16px;
}
</style>
