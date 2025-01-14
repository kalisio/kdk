<template>
  <KExpandable
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
        class="q-pr-lg"
        :class="{ 'k-textarea-collapsed': !isExpanded, 'k-textarea-expanded': isExpanded }"
        v-html="Document.sanitizeHtml(props.text)"
      />
    </KScrollArea>
    <div class="k-expandable-action">
      <KAction
        v-if="isExpandable"
        id="collapse-action"
        class="k-expandable-action"
        :icon="isExpanded ? 'las la-angle-up' : 'las la-ellipsis-h'"
        :tooltip="isExpanded ? 'KTextArea.COLLAPSE' : ''"
        size="xs"
        :handler="() => isExpanded = !isExpanded"
        :propagate="false"
      />
    </div>
  </KExpandable>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Document } from '../document.js'
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
  bottom: 0px;
  right: 4px;
  padding: 1px;
  background-color: white;
}
</style>
