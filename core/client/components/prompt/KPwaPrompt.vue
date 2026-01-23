<template>
  <q-dialog persistent position="bottom" ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-pa-xs column items-center q-gutter-y-xs no-wrap">
      <q-card-section>
        <div class="text-h6">{{ $t('KPwaPrompt.INSTALL_TITLE') }}</div>
      </q-card-section>
      <q-card-section class="q-py-none text-center" style="max-width: 400px">
        {{ $t(computedMessage) }}
      </q-card-section>
      <div
        v-if="computedMessage === 'KPwaPrompt.INSTALL_MESSAGE'"
        :class="dense ? 'q-py-xs flex' : 'q-py-md flex'"
      >
        <KAction
          id="ignore-button"
          :label="$t('KPwaPrompt.IGNORE')"
          renderer="form-button"
          :outline="true"
          :handler="() => onDialogCancel()"
        />
        <div class="q-mx-sm"></div>
        <KAction
          id="install-button"
          :label="$t('KPwaPrompt.INSTALL')"
          renderer="form-button"
          :handler="() => onDialogOK()"
        />
      </div>
      <div v-else :class="dense ? 'q-py-xs' : 'q-py-md'">
        <KAction
          id="close-button"
          label="CLOSE"
          renderer="form-button"
          :handler="() => onDialogCancel()"
        />
      </div>
      <q-checkbox
        id="toggle-install-checkbox"
        v-model="toggle"
        :label="$t('KPrompt.HIDE')"
        color="primary"
        size="xs"
        :dense="dense"
        @update:modelValue="onToggleCheckbox"
        :class="dense ? 'text-caption' : ''"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { LocalStorage } from '../../local-storage.js'

// Emits
defineEmits([...useDialogPluginComponent.emits, 'update:modelValue'])

// Data
const $q = useQuasar()
const toggle = ref(false)
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()

// Computed
const dense = computed(() => {
  return $q.screen.lt.sm
})
const computedMessage = computed(() => {
  if ($q.platform.is.ios) return 'KPwaPrompt.IOS_INSTALL_MESSAGE'
  if ($q.platform.is.firefox && $q.platform.is.desktop) { return 'KPwaPrompt.FIREFOX_DESKTOP_INSTALL_MESSAGE' }
  return 'KPwaPrompt.INSTALL_MESSAGE'
})

// Functions
function onToggleCheckbox (toggle) {
  LocalStorage.set('install', !toggle)
}
</script>
