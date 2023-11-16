import _ from 'lodash'
import { watch, ref } from 'vue'
import config from 'config'
import { Time, i18n, Events, Store, api } from '../../../core/client/index.js'
import * as composables from '../../../core/client/composables/index.js'
import { exportFile, useQuasar } from 'quasar'

export function useCapture (options = {}) {
  // data
  const { kActivity } = composables.useCurrentActivity()
  let processing = false
  const width = ref(1280)
  const height = ref(720)
  const resolution = ref(undefined)
  const header = ref(false)
  const title = ref('')
  const footer = ref(false)
  const footerContent = ref('')
  const legend = ref(false)
  const legendPosition = ref('left')
  const compass = ref(false)
  const compassPosition = ref('bottom-left')
  const $q = useQuasar()

  // Watch
  watch(resolution, (value) => {
    if (!value) resolution.value = getResolutions()[1]
    else {
      const size = _.split(resolution.value.value, 'x')
      width.value = size[0]
      height.value = size[1]
    }
  }, { immediate: true })
  watch(width, (value) => {
    if (value < 256) width.value = 256
    if (value > 4000) width.value = 4000
  })
  watch(height, (value) => {
    if (value < 256) height.value = 256
    if (value > 4000) height.value = 4000
  })
  watch(header, (value) => {
    header.value = value
  })
  watch(title, (value) => {
    title.value = value
  })
  watch(footer, (value) => {
    footer.value = value
  })
  watch(footerContent, (value) => {
    footerContent.value = value
  })
  watch(legend, (value) => {
    legend.value = value
  })
  watch(legendPosition, (value) => {
    legendPosition.value = value
  })
  watch(compass, (value) => {
    compass.value = value
  })
  watch(compassPosition, (value) => {
    compassPosition.value = value
  })

  // functions
  function getResolutions () {
    return [
      { label: i18n.t('KCaptureToolbar.SD_LABEL'), description: i18n.t('KCaptureToolbar.SD_DESCRIPTION'), value: '640x480' },
      { label: i18n.t('KCaptureToolbar.HD_LABEL'), description: i18n.t('KCaptureToolbar.HD_DESCRIPTION'), value: '1280x720' },
      { label: i18n.t('KCaptureToolbar.FHD_LABEL'), description: i18n.t('KCaptureToolbar.FHD_DESCRIPTION'), value: '1920x1080' },
      { label: i18n.t('KCaptureToolbar.QHD_LABEL'), description: i18n.t('KCaptureToolbar.QHD_DESCRIPTION'), value: '2560x1440' },
      { label: i18n.t('KCaptureToolbar.2K_LABEL'), description: i18n.t('KCaptureToolbar.2K_DESCRIPTION'), value: '2048x1080' },
      { label: i18n.t('KCaptureToolbar.4K_LABEL'), description: i18n.t('KCaptureToolbar.4K_DESCRIPTION'), value: '3840x2160' }
    ]
  }
  async function capture () {
    // Check if processing is already in progress
    if (processing) {
      return $q.notify({
        type: 'negative',
        message: i18n.t('KDialogToolbar.ERROR_MESSAGE')
      })
    }
    processing = true
    // Retrieve the layers
    const layers = kActivity.value.getContextParameters('layers').layers
    // Retrieve the extension
    const bbox = kActivity.value.getContextParameters('view')
    // Setup the request url options
    const endpoint = Store.get('capabilities.api.gateway') + '/capture'
    const layout = {
      panes: {
        left: { opener: false, visible: false },
        top: { opener: false, visible: false },
        right: { opener: false, visible: false },
        bottom: { opener: false, visible: false }
      },
      fab: { visible: false }
    }
    _.set(layout, 'header', header.value ? { content: [{ component: 'KStamp', text: title.value, direction: 'horizontal', textSize: '1.5rem' }], visible: true } : undefined )
    _.set(layout, 'footer', footer.value ? { content: [{ component: 'KStamp', text: footerContent.value, direction: 'horizontal', textSize: '1.5rem' }], visible: true } : undefined )
    _.set(layout, 'page', compass.value ? { content: [{ component: 'layout/KPageSticky', position: compassPosition.value, offset: [0, 5], content: [{ component: 'KNorth' }]}]} : undefined )
    _.set(layout, `windows.${legendPosition.value}`, legend.value ? {
      content: [{  id: 'legend-widget', label: 'KLegend.LABEL', icon: 'las la-list', scrollable: true, content: { component: 'legend/KLegend' }}],
      current: 'legend-widget',
      state: 'pinned',
      sizePolicy: {
        pinned: {
          xs: [35, 100],
          sm: [30, 100],
          md: [25, 100],
          lg: [20, 100],
          xl: [15, 100]
        }
      },
      visible: true 
    } : undefined )
    const options = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        activity: kActivity.value.is3D() ? 'globe' : 'map',
        layers,
        bbox: [bbox.west, bbox.south, bbox.east, bbox.north],
        size: { width: +width.value, height: +height.value },
        time: Time.getCurrentTime().toISOString(),
        layout
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    // Add the Authorization header if jwt is defined
    const jwt = await api.get('storage').getItem(config.gatewayJwt)
    if (jwt) options.headers.Authorization = 'Bearer ' + jwt
    // Perform the request
    let dismiss = null
    try {
      dismiss = $q.notify({
        group: 'capture',
        icon: 'las la-hourglass-half',
        message: i18n.t('KCaptureToolbar.CAPTURING_VIEW'),
        color: 'primary',
        timeout: 0,
        spinner: true
      })
      const response = await fetch(endpoint, options)
      dismiss()
      processing = false
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer()
        exportFile('capture.png', new Uint8Array(arrayBuffer))
      } else {
        Events.emit('error', { message: i18n.t('errors.' + response.status) })
      }
    } catch (error) {
      // Network error
      dismiss()
      processing = false
      Events.emit('error', { message: i18n.t('errors.NETWORK_ERROR') })
    }
  }

  // expose
  return { width, height, resolution, header, title, footer, footerContent, legend, legendPosition, compass, compassPosition, getResolutions, capture }
}