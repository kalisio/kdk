<template>
  <div style="position: relative;">
    <KExpandable
      v-hover="{ enter: () => hovered = true, leave: () => hovered = false }"
      class="k-expandable"
      :isExpanded="isExpanded"
      :minHeight="minHeight"
      :maxHeight="maxHeight"
      @click="onClick"
    >
      <KScrollArea
        ref="scrollArea"
        :key="scrollAreaKey"
        :maxHeight="maxHeight"
        :visible="isExpanded"
        :dense="dense"
        @scrolled="onScrolled"
      >
        <!-- content -->
        <div
          v-safe-html="props.text"
          class="q-pr-lg"
          :class="{ 'k-textarea-collapsed': !isExpanded, 'k-textarea-expanded': isExpanded }"
        />
      </KScrollArea>
    </KExpandable>
    <div class="k-expandable-action">
      <KAction
        v-show="isExpandable"
        id="collapse-action"
        :icon="isExpanded ? 'las la-angle-up' : 'las la-angle-down'"
        :tooltip="isExpanded ? 'KTextArea.COLLAPSE' : ''"
        size="xs"
        :handler="() => isExpanded = !isExpanded"
        :propagate="false"
      />
    </div>
    <div class="k-copy-action">
      <KAction
        v-show="props.copyable && hovered"
        v-hover="{ enter: () => hovered = true, leave: () => hovered = false }"
        id="copy-content"
        icon="las la-copy"
        tooltip="KTextArea.COPY"
        size="md"
        :handler="onCopy"
        :propagate="false"
      />
    </div>
  </div>
</template>

<script setup>
import logger from 'loglevel'
import { ref, computed, watch } from 'vue'
import { Notify, copyToClipboard } from 'quasar'
import { i18n } from '../i18n.js'
import KExpandable from './KExpandable.vue'
import KScrollArea from './KScrollArea.vue'

// props
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  minHeight: {
    type: Number,
    default: 64
  },
  maxHeight: {
    type: Number,
    default: 304
  },
  zoom: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  },
  copyable: {
    type: Boolean,
    default: true
  },
  isExpanded: {
    type: Boolean,
    default: false
  }
})

// data
const scrollArea = ref(null)
const scrollAreaKey = ref(0)
const isExpandable = ref(false)
const isExpanded = ref(props.isExpanded)
const isScrollable = ref(false)
const hovered = ref(false)

// computed
const cssCursor = computed(() => {
  return isExpandable.value ? 'pointer' : 'default'
})
const cssExpandedFontSize = computed(() => {
  return props.zoom ? '1rem' : '0.875rem'
})

// functions
function onClick () {
  if (!isExpandable.value) return
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    isScrollable.value = true
  } else {
    scrollArea.value.setScrollPosition('vertical', 0)
  }
}
function onScrolled (info) {
  if (info.verticalSize > props.minHeight) {
    isExpandable.value = true
    if (info.verticalSize > props.maxHeight) {
      isScrollable.value = true
    } else {
      isScrollable.value = false
    }
  } else {
    isExpandable.value = false
    isScrollable.value = false
  }
}
async function onCopy () {
  try {
    await copyToClipboard(props.text)
    Notify.create({
      type: 'positive',
      message: i18n.t('KTextArea.COPIED')
    })
  } catch (error) {
    logger.debug('[KDK] Unable to copy data to the clipboard:', error)
    Notify.create({
      type: 'negative',
      message: i18n.t('KTextArea.CANNOT_COPY')
    })
  }
}

// watch
watch(() => props.text, (text) => {
  // Reset the states
  isExpandable.value = false
  isExpanded.value = false
  isScrollable.value = false
  // force the scroll area to be rendered
  scrollAreaKey.value += 1
})
</script>

<style lang="scss" scoped>
.k-textarea-collapsed {
  transition: 0.3s;
}
.k-textarea-expanded {
  transition: 0.3s;
  font-size: v-bind('cssExpandedFontSize');
}
.k-expandable {
  position: relative;
}
.k-expandable:hover {
  cursor: v-bind('cssCursor');
}
.k-expandable-action {
  position: absolute;
  bottom: 2px;
  right: 6px;
}
.k-copy-action {
  position: absolute;
  top: -24px;
  right: -16px;
  background-color: white;
  border-radius: 20px;
  border: 1px solid lightgrey;
}
</style>
