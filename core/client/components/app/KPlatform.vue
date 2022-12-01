<template>
  <q-markup-table>
    <thead class="bg-accent text-white">
      <tr>
        <th class="text-left">{{ $t('KPlatform.PROPERTY') }}</th>
        <th>
          <div class="row items-center">
            <div>{{ $t('KPlatform.VALUE') }}</div>
            <q-space />
            <KAction
              id="copy-info"
              icon="las la-copy"
              tooltip="KPlatform.COPY_INFO"
              :handler="copy"
            />
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(value, prop) in Platform" :key="prop">
        <td>{{ prop }}</td>
        <td>{{ value === true ? $t('YES') : value === false ? $t('NO') : value }}</td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script setup>
import { useQuasar, copyToClipboard } from 'quasar'
import { i18n } from '../../i18n.js'
import { usePlatform } from '../../composables'
import KAction from '../frame/KAction.vue'

// data
const $q = useQuasar()
const { Platform } = usePlatform()

// function
async function copy () {
  try {
    await copyToClipboard(JSON.stringify(Platform.value, null, 2))
    $q.notify({ type: 'positive', message: i18n.t('KPlatform.INFO_COPIED') })
  } catch (error) {
    $q.notify({ message: i18n.t('KPositionIndicator.CANNOT_COPY_INFO') })
  }
}
</script>
