<template>
  <KExpandable
    class="k-expandable"
    v-model="isExpanded" 
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
      <div class="q-pr-lg" 
        :class="{ 'k-textarea-collapsed': !isExpanded, 'k-textarea-expanded': isExpanded }"
        v-html="sanitizedText" 
      />
    </KScrollArea>
    <q-btn
      id="expandable-button"
      v-if="isScrollAreaActive"
      :icon="buttonIcon"
      class="k-expandable-button"
      size="xs"
      color="grey-6"
      round
      flat
      dense
      @click.stop="onClick"
    />
  </KExpandable>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import sanitizeHtml from 'sanitize-html'
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
  }
})

// data
const scrollArea = ref(null)
const scrollAreaKey = ref(0)
const isExpanded = ref(false)
const isScrollAreaActive = ref(false)

// computed
const sanitizedText = computed(() => {
  return sanitizeHtml(props.text)
})
const buttonIcon = computed (() => {
  return isExpanded.value ? 'las la-angle-up' : 'las la-angle-down'
})
const cssCursor = computed(() => {
  return isScrollAreaActive.value ? 'pointer' : 'default'
})
const cssExpandedFontSize = computed (() => {
  return props.zoom ? '1rem' : '0.875rem'
})

// functions
function onClick () {
  if (isScrollAreaActive.value) {
    isExpanded.value = !isExpanded.value
    if (!isExpanded.value) scrollArea.value.setScrollPosition('vertical', 0)
  }
}
function onScrolled (info) {
  if (info.verticalSize > props.minHeight) {
    isScrollAreaActive.value = true
    if (info.verticalPercentage > 0) isExpanded.value = true
  } else {
    isScrollAreaActive.value = false
  }
}

// watch
watch(() => props.text, (text) => { 
  // Reset the states and force rerender the scroll area to handle the new content
  isScrollAreaActive.value = false
  isExpanded.value = false
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
.k-expandable-button {
  position: absolute;
  bottom: 4px;
  right: 8px;
  background-color: white;
}
</style>