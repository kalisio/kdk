<template>
  <q-expansion-item
    ref="expansionItemRef"
    v-model="isOpened"
    group="editor"
    header-class="bg-grey-2"
    :dense="dense"
    :disable="!isEnabled"
    :class="{ 'k-disabled': !isEnabled }"
  >
    <template v-slot:header>
      <q-item-section v-if="canBeDisabled" class="col-auto">
        <q-checkbox
          v-model="isEnabled"
          size="xs"
        />
      </q-item-section>
      <q-item-section v-if="label">
        {{ $t(label) }}
      </q-item-section>
      <q-item-section v-if="!isOpened && isEnabled" side>
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
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import KStylePreview from './KStylePreview.vue'
import KStyleTip from './KStyleTip.vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  label: {
    type: String,
    required: true
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
  },
  canBeDisabled: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['update:model-value'])

// Data
const expansionItemRef = ref(null)
const isEnabled = ref(props.modelValue)
const isOpened = ref(false)
const showTip = ref(false)

// Watch
watch(isOpened, (value) => {
  setTimeout(() => { showTip.value = value }, 500)
})
watch(() => props.modelValue, (value) => {
  isEnabled.value = value
  if (!value) isOpened.value = false
})
watch(isEnabled, (value) => {
  emit('update:model-value', value)
  removeQuasarDisabledClass()
})

// Functions
function onEnter () {
  showTip.value = true
}
function onUpdated (value) {
  if (showTip.value !== value) showTip.value = value
}
// Quasar "disabled" css class apply a "not-allowed" cursor, but we don't want that on the checkbox
// So we need to remove this class and apply a custom class that mimic the style, but without the cursor property
function removeQuasarDisabledClass () {
  if (isEnabled.value) return
  if (expansionItemRef.value) {
    setTimeout(() => {
      const target = expansionItemRef.value.$el.querySelector('.disabled')
      if (target) target.classList.remove('disabled')
    }, 100)
  }
}

onMounted(() => {
  removeQuasarDisabledClass()
})
</script>

<style lang="scss">
.k-disabled {
  opacity: 0.6 !important;
  outline: 0 !important;
}
</style>
