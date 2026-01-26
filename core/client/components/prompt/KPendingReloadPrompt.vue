<template>
  <q-dialog persistent position="bottom" ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-pa-xs column items-center q-gutter-y-xs no-wrap">
      <q-card-section>
        <div class="text-h6">{{ $t('INFORMATION') }}</div>
      </q-card-section>
      <q-card-section class="q-py-none text-center" style="max-width: 400px">
        {{ $t('KPendingReloadPrompt.RECONNECT') }}
      </q-card-section>
      <div :class="dense ? 'q-py-xs flex' : 'q-py-md flex'">
        <KAction
          id="ignore-button"
          :label="$t('KPendingReloadPrompt.IGNORE')"
          renderer="form-button"
          :outline="true"
          :handler="() => onDialogCancel()"
        />
        <div class="q-mx-sm"></div>
        <KAction
          id="update-button"
          :label="$t('KPendingReloadPrompt.RELOAD')"
          renderer="form-button"
          :handler="() => onDialogOK()"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'

// Emits
defineEmits([...useDialogPluginComponent.emits])

// Data
const $q = useQuasar()
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()

// Computed
const dense = computed(() => {
  return $q.screen.lt.sm
})
</script>
