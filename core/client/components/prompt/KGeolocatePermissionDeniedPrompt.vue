<template>
  <q-dialog persistent position="bottom" ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-pa-xs column items-center q-gutter-y-xs no-wrap">
      <q-card-section>
        <div class="text-h6">{{ $t('KGeolocatePermissionDeniedPrompt.TITLE') }}</div>
      </q-card-section>
      <q-card-section class="q-py-none text-center" style="max-width: 400px">
        {{ $t('KGeolocatePermissionDeniedPrompt.MESSAGE') }}
      </q-card-section>
      <div :class="dense ? 'q-py-xs' : 'q-py-md'">
        <KAction
          id="close-button"
          label="CLOSE"
          renderer="form-button"
          :handler="() => onDialogCancel()"
        />
      </div>
      <q-checkbox
        id="toggle-geolocate-prompt-checkbox"
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
const { dialogRef, onDialogHide, onDialogCancel } =
  useDialogPluginComponent()

// Computed
const dense = computed(() => {
  return $q.screen.lt.sm
})

// Functions
function onToggleCheckbox (toggle) {
  LocalStorage.set('geolocate-permission-error-prompt', !toggle)
}
</script>
