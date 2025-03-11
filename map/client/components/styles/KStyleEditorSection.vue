<template>
  <div>
    <q-expansion-item
      v-model="isOpened"
      group="editor"
      header-class="bg-grey-2"
      :dense="dense"
    >
      <template v-slot:header>
        <q-item-section v-if="title">
          {{ $t(title) }}
        </q-item-section>
        <q-item-section v-if="!isOpened" side>
          <KStylePreview :style="style[type]" :type="type" />
        </q-item-section>
      </template>
      <q-list v-hover="{ enter: onEnter }">
        <slot />
      </q-list>
      <KStyleTip
        v-model="showTip"
        :style="style[type]"
        :type="type"
        target="#style-editor"
        anchor="top right"
        self="center middle"
        no-parent-event
        @update:model-value="onUpdated"
      />
    </q-expansion-item>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import KStylePreview from './KStylePreview.vue'
import KStyleTip from './KStyleTip.vue'

// Props
defineProps({
  title: {
    type: String,
    default: null
  },
  style: {
    type: Object,
    default: () => null
  },
  type: {
    type: String,
    default: 'point',
    validator: (value) => {
      return ['point', 'line', 'polygon'].includes(value)
    }
  },
  dense: {
    type: Boolean,
    default: false
  }
})

// Data
const isOpened = ref(false)
const showTip = ref(false)

// Watch
watch(isOpened, (value) => {
  setTimeout(() => { showTip.value = value }, 300)
})

// Functions
function onEnter () {
  showTip.value = true
}
function onUpdated (value) {
  if (showTip.value !== value) showTip.value = value
}
</script>
