<template>
  <q-dialog persistent position="bottom" ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-pa-xs column items-center q-gutter-y-xs no-wrap">
      <q-card-section>
        <div class="text-h6">{{ $t('composables.session.ALERT') }}</div>
      </q-card-section>
      <q-card-section class="q-py-none text-center" style="max-width: 400px">
        {{ $t('composables.session.REFUSED') }}
      </q-card-section>
      <div :class="dense ? 'q-py-xs flex' : 'q-py-md flex'">
        <KAction
          id="retry-button"
          label="composables.session.RETRY"
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
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

// Computed
const dense = computed(() => {
  return $q.screen.lt.sm
})
</script>
