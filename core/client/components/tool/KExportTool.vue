<template>
  <KAction
    id="export-tool"
    :tooltip="title"
    icon="las la-download"
    :handler="onTriggered"
  />
</template>

<script setup>
import { useQuasar, openURL } from 'quasar'
import { i18n } from '../../i18n.js'
import { api } from '../../api.js'
import KAction from '../KAction.vue'

// props
const props = defineProps({
  title: {
    type: String,
    default: 'KExportTool.TITLE'
  },
  service: {
    type: String,
    required: true
  },
  context: {
    type: String,
    default: undefined
  },
  query: {
    type: Object,
    default: {}
  },
  formats: {
    type: Array,
    default: [
      { label: 'CSV', value: 'csv' },
      { label: 'JSon', value: 'json' }
    ]
  },
  gzip: {
    type: Boolean,
    default: false
  }
})

// Data
const $q = useQuasar()

// Functions
async function process (format) {
  const exportService = api.getService('import-export')
  let response = await exportService.create({ 
    method: 'export',
    servicePath: api.getServicePath(props.service, props.context).substr(1),
    query: props.query,
    format,
    gzip: props.gzip
  })
  const target = format === 'json' ? '_blank' : '_self'
  window.open(response.SignedUrl, target)
}
async function onTriggered () {
  if (props.formats.length > 1) {
    const dialog = {
      title: i18n.t('KExportTool.TITLE'),
      message: i18n.t('KExportTool.MESSAGE'),
      html: true,
      options: {
        type: 'radio',
        model: props.formats[0].value,
        items: props.formats
      },
      cancel: {
        id: 'cancel-button',
        label: i18n.t('CANCEL'),
        color: 'primary',
        outline: true
      },
      ok: {
        id: 'export-button',
        label: i18n.t('KExportTool.EXPORT'),
        color: 'primary'
      },
      persistent: true
    }
    $q.dialog(dialog)
    .onOk(async (format) => {
      await process(format)
    })
  } else {
    await process(props.format[0])
  }
}
</script>