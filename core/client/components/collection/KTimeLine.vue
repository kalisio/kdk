<template>
  <div class="fit column no-wrap">
    <!--
      Header
    -->
    <div id="timeline-header" class="q-pr-xs q-pb-xs">
      <slot name="header">
        <KPanel
          :content="header"
          :class="headerClass"
         />
      </slot>
    </div>
    <!--
      Content
    -->
    <div v-if="items && items.length > 0"
      id="timeline-content"
      ref="contentRef"
      class="col scroll"
    >
      <q-timeline
        :layout="layout"
        color="grey-7"
      >
        <q-infinite-scroll
          @load="onLoad"
          :initial-index="1"
          :offset="scrollOffset"
          v-scroll="onScroll"
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
            <q-timeline-entry :color="getColor(item)">
              <template v-slot:title>
                <slot name="title">
                  <div v-if="getTitle(item)" class="text-h6 ellipsis">
                    {{ getTitle(item) }}
                  </div>
                </slot>
              </template>
              <template v-slot:subtitle>
                <slot name="subtitle">
                  <div v-if="layout === 'dense'" class="row items-center q-gutter-x-sm">
                    <span v-if="getTimestamp(item)">
                      {{  getTimestamp(item) }}
                    </span>
                    <span v-if="getAuthor(item)" class="text-caption" style="text-transform: capitalize;">
                      {{  getAuthor(item) }}
                    </span>
                    <KPanel
                      v-if="getDecoration(item)"
                      :content="getDecoration(item)"
                      class="q-gutter-xs k-decoration"
                    />
                  </div>
                  <div v-else class="column items-end">
                    <span v-if="getTimestamp(item)">
                      {{  getTimestamp(item) }}
                    </span>
                    <span v-if="getAuthor(item)" class="text-caption" style="text-transform: capitalize;">
                      {{  getAuthor(item) }}
                    </span>
                    <KPanel
                      v-if="getDecoration(item)"
                      :content="getDecoration(item)"
                      class="justify-end q-gutter-xs k-decoration"
                    />
                  </div>
                </slot>
              </template>
              <div :class="{ 'q-pr-sm': dense, 'q-pr-md': !dense }">
                <div v-if="bodyRenderer" :class="bodyRendererClass">
                  <component
                    :id="item._id"
                    :ref="onBodyRendered"
                    :service="service"
                    :item="item"
                    :is="bodyRendererComponent"
                    v-bind="bodyRenderer"
                  />
                </div>
                <div v-else v-html="getBody(item)" />
              </div>
            </q-timeline-entry>
          </template>
        </q-infinite-scroll>
      </q-timeline>
    </div>
    <!-- Empty slot -->
    <div v-else-if="items && items.length === 0"
      id="timeline-content"
    >
      <slot name="empty">
        <KStamp
          icon="las la-exclamation-circle"
          icon-size="4rem"
          :text="$t('KTimeLine.EMPTY_LABEL')"
          text-size="1.2rem"
          direction="vertical"
          class="absolute-center"
        />
      </slot>
    </div>
    <!-- Initializing slot -->
    <div v-else id="timeline-initializing">
      <slot name="initializing">
        <div class="row justify-center">
          <q-spinner
            color="primary"
            size="4rem"
            class="absolute-center"
          />
        </div>
      </slot>
    </div>
    <!--
      Controls
     -->
    <div v-if="items && items.length > 0 && contentRef"
      id="timeline-controls"
      :class="dense ? 'q-px-sm' : 'q-px-md'"
      class="row items-center"
    >
      <div class="col-4"></div>
      <div class="col-4 row justify-center">
        <KScrollDown
          v-if="scrollDown"
          :ref="scrollDownRefCreated"
          target="timeline-content"
          :loading="loadDoneFunction ? true : false"
          @visibility-changed="onScrollDownVisibilityChanged"
      />
      </div>
      <div class="col-4 row justify-end">
        <KScrollToTop
          v-if="scrollToTop"
          :ref="scrollToTopRefCreated"
          target="timeline-content"
          @visibility-changed="onScrollToTopVisibilityChanged"
        />
      </div>
    </div>
    <!--
      Footer
    -->
    <div id="timeline-footer">
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
import { useQuasar } from 'quasar'
import { useCollection } from '../../composables'
import { Events } from '../../events.js'
import { Time } from '../../time.js'
import { loadComponent } from '../../utils'
import KScrollToTop from './KScrollToTop.vue'
import KScrollDown from './KScrollDown.vue'
import KStamp from '../KStamp.vue'
import KPanel from '../KPanel.vue'

// Props
const props = defineProps({
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
  schema: {
    type: Object,
    default: () => {
      return {
        colorField: 'color',
        titleField: 'name',
        timestampField: 'createdAt',
        bodyField: 'description',
        decorationField: 'tags'
      }
    }
  },
  processor: {
    type: Function,
    default: undefined
  },
  sideWidth: {
    type: Number,
    default: 20
  },
  scrollDown: {
    type: Boolean,
    default: true
  },
  scrollToTop: {
    type: Boolean,
    default: true
  },
  scrollOffset: {
    type: Number,
    default: 300
  },
  header: {
    type: [Array, Object],
    default: () => null
  },
  headerClass: {
    type: String,
    default: undefined
  },
  heading: {
    type: Boolean,
    default: true
  },
  footer: {
    type: [Array, Object],
    default: () => null
  },
  footerClass: {
    type: String,
    default: undefined
  },
  dense: {
    type: Boolean,
    default: false
  },
  timeFormat: {
    type: String,
    default: undefined
  }
})

// Emits
const emit = defineEmits(['collection-refreshed', 'selection-changed', 'scroll-state-changed'])

// Data
const $q = useQuasar()
const { items, nbTotalItems, currentPage, refreshCollection } = useCollection(_.merge(toRefs(props), { appendItems: ref(true) }))
const contentRef = ref(null)
const scrollDownRef = ref(null)
const scrollToTopRef = ref(null)
const loadDoneFunction = ref(null)

// Computed
const bodyRendererComponent = computed(() => {
  return loadComponent(props.bodyRenderer.component)
})
const bodyRendererClass = computed(() => {
  return props.bodyRenderer.class || 'col-12'
})
const layout = computed(() => {
  if (props.dense) return 'dense'
  return $q.screen.lt.md ? 'dense' : 'comfortable'
})
const comfortSize = computed(() => {
  return `${props.sideWidth}%`
})
const comfortPadding = computed(() => {
  return props.dense ? '24px' : '32px'
})
const decorationSize = computed(() => {
  if (layout.value === 'dense') return '80vw'
  return `${props.sideWidth}vw`
})

// Watch
watch(items, onCollectionRefreshed)

// Functions
function onBodyRendered (instance) {
  // Force the scroll components to be refreshed
  if (instance) onScroll()
}
function scrollDownRefCreated (instance) {
  scrollDownRef.value = instance
  if (instance) instance.refresh()
}
function scrollToTopRefCreated (instance) {
  scrollToTopRef.value = instance
  if (instance) instance.refresh()
}
function getTitle (item) {
  return _.get(item, _.get(props.schema, 'titleField'))
}
function getTimestamp (item) {
  const time = _.get(item, _.get(props.schema, 'timestampField'))
  if (!props.timeFormat) {
    if (time) return `${Time.format(time, 'date.long')} - ${Time.format(time, 'time.long')}`
  }
  if (time) return Time.format(time, props.timeFormat)
}
function getAuthor (item) {
  return _.get(item, _.get(props.schema, 'authorField'))
}
function getDecoration (item) {
  return _.get(item, _.get(props.schema, 'decorationField'))
}
function getBody (item) {
  return _.get(item, _.get(props.schema, 'bodyField'))
}
function getColor (item) {
  return _.get(item, _.get(props.schema, 'colorField'))
}
function getHeading (item) {
  if (!props.heading) return null
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
function onScroll () {
  if (scrollDownRef.value) scrollDownRef.value.refresh()
  if (scrollToTopRef.value) scrollToTopRef.value.refresh()
}
function onLoad (index, done) {
  // check whether the items are all loaded yet
  if (items.value.length >= nbTotalItems.value) {
    done(true)
    return
  }
  // set the current page and tell the collection to be refreshed
  currentPage.value = index
  refreshCollection()
  loadDoneFunction.value = done
}
function onCollectionRefreshed () {
  emit('collection-refreshed', items.value)
  // set previous item. This is required to compute whether it must display an heading or not
  _.forEach(items.value, (item, index) => {
    item.previous = index > 0 ? items.value[index - 1] : null
  })
  // call done callback if needed
  if (loadDoneFunction.value) {
    loadDoneFunction.value(items.value.length === nbTotalItems.value)
    loadDoneFunction.value = null
  }
}
function onScrollDownVisibilityChanged (isVisible) {
  emit('scroll-state-changed', isVisible ? 'scroll' : 'bottom')
}
function onScrollToTopVisibilityChanged (isVisible) {
  emit('scroll-state-changed', isVisible ? 'scroll' : 'top')
}

// Hooks
onBeforeMount(() => {
  refreshCollection()
  Events.on('user-abilities-changed', refreshCollection)
})
onBeforeUnmount(() => {
  Events.off('user-abilities-changed', refreshCollection)
  if (scrollDownRef.value) scrollDownRef.value.refresh.cancel()
  if (scrollToTopRef.value) scrollToTopRef.value.refresh.cancel()
})
</script>

<style lang="scss">
.q-timeline__heading-title {
  padding-top: 8px;
  padding-bottom: 8px;
}
.q-timeline__title {
  margin-bottom: 4px;
  max-width: 80vw;
}
.q-timeline__subtitle {
  margin-bottom: 0px;
  opacity: 1.0; // override default opacity
  text-transform: capitalize;
  font-weight: 400;
}
.q-timeline__content {
  padding-bottom: 16px;
  width: 100%;
}
.q-timeline__entry {
  line-height: 18px;
}
.q-timeline--comfortable .q-timeline__subtitle {
  width: v-bind(comfortSize);
}
.q-timeline--comfortable .q-timeline__content {
  padding-bottom: 16px;
  width: calc(100% - v-bind(comfortSize));
}
.q-timeline--dense--right .q-timeline__entry {
  padding-left: v-bind(comfortPadding);
}
.k-timeline-heading {
  font-size: 1.2rem;
  font-weight: bold;
}
.k-decoration {
  max-width: v-bind(decorationSize);
}
</style>
