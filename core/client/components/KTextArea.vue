<template>
  <div style="position: relative;">
    <KExpandable
      class="k-expandable"
      :isExpanded="isExpanded"
      :minHeight="minHeight"
      :maxHeight="maxHeight"
      @click="onClick"
    >
      <KScrollArea
        ref="scrollAreaRef"
        :key="scrollAreaKey"
        :maxHeight="maxHeight"
        :visible="isExpanded"
        :dense="dense"
      >
        <!-- content -->
        <div
          ref="contentRef"
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
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
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
  expanded: {
    type: Boolean,
    default: false
  }
})

// data
const contentRef = ref(null)
const scrollAreaRef = ref(null)
const scrollAreaKey = ref(0)
const isExpandable = ref(false)
const isExpanded = ref(props.expanded)
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
  if (!isExpanded.value) {
    scrollAreaRef.value.setScrollPosition('vertical', 0)
  }
}
async function updateExpandableState () {
  await nextTick()
  const height = contentRef.value?.offsetHeight ?? 0
  isExpandable.value = height > props.minHeight
  isExpanded.value = isExpandable.value ? props.expanded : false
  isScrollable.value = height > props.maxHeight
}

// Watch
watch(() => props.text, async (text) => {
  // Reset the states
  isExpandable.value = false
  isExpanded.value = props.expanded
  isScrollable.value = false
  // force the scroll area to be rendered
  scrollAreaKey.value += 1
  await updateExpandableState()
})

// Hooks
onMounted(updateExpandableState)
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
</style>
