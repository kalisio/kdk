import _ from 'lodash'
import config from 'config'
import { Time, i18n, Events, Store, api, Layout } from '../../../core/client/index.js'
import * as composables from '../../../core/client/composables/index.js'
import { exportFile, Notify } from 'quasar'

const placements = ['right', 'left', 'top', 'bottom', 'top-left', 'top-right', 'bottom-right', 'bottom-left']

export async function capture (values) {
  // Retrieve activity
  const { kActivity } = composables.useCurrentActivity()
  // Retrieve the layers
  const layers = kActivity.value.getContextParameters('layers').layers
  // Retrieve the extension
  const bbox = kActivity.value.getContextParameters('view')
  // Setup the request url options
  const endpoint = Store.get('capabilities.api.gateway') + '/capture'
  const options = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({
      activity: kActivity.value.is3D() ? 'globe' : 'map',
      layers,
      bbox: [bbox.west, bbox.south, bbox.east, bbox.north],
      size: { width: +values.resolution.width, height: +values.resolution.height },
      time: Time.getCurrentTime().toISOString(),
      layout: getLayout(values)
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
    dismiss = Notify.create({
      group: 'capture',
      icon: 'las la-hourglass-half',
      message: i18n.t('KCapture.CAPTURING_VIEW'),
      color: 'primary',
      timeout: 0,
      spinner: true
    })
    const response = await fetch(endpoint, options)
    dismiss()
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer()
      exportFile('capture.png', new Uint8Array(arrayBuffer))
    } else {
      Events.emit('error', { message: i18n.t('errors.' + response.status) })
    }
  } catch (error) {
    // Network error
    dismiss()
    Events.emit('error', { message: i18n.t('errors.NETWORK_ERROR') })
  }
}

function getLayout (values) {
  const layout = {
    panes: {
      left: { opener: false, visible: false },
      top: { opener: false, visible: false },
      right: { opener: false, visible: false },
      bottom: { opener: false, visible: false }
    },
    fab: { visible: false }
  }
  if (_.has(values, 'header')) _.set(layout, 'header', headerFooterComponent(values.header, 'header'))
  if (_.has(values, 'footer')) _.set(layout, 'footer', headerFooterComponent(values.footer, 'footer'))
  if (_.includes(placements, values.compass)) _.set(layout, 'page', compassComponent(values.compass))
  if (_.includes(placements, values.legend)) _.set(layout, `windows.${values.legend}`, legendComponent())

  return layout
}

function headerFooterComponent (text, position) {
  return { content: [{ component: _.get(config, `capture.${position}.component`, 'KCaptureTextArea'), text, position }], visible: true }
}

function compassComponent (position) {
  return { content: _.union(Layout.getPage().content, [{ component: 'layout/KPageSticky', position, offset: [0, 5], content: [{ component: 'KNorth' }] }]) }
}

function legendComponent () {
  return {
    content: [{ id: 'legend-widget', label: 'KLegend.LABEL', icon: 'las la-list', scrollable: true, content: { component: 'legend/KLegend' } }],
    current: 'legend-widget',
    state: 'pinned',
    controls: {
      pin: false,
      unpin: false,
      maximize: false,
      restore: false,
      close: false,
      resize: false
    },
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
  }
}
