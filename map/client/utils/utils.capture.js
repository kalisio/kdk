import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import moment from 'moment'
import { i18n, Events, Store, api, Layout } from '../../../core/client/index.js'
import * as composables from '../../../core/client/composables/index.js'
import { base64Encode, getLocale } from '../../../core/client/utils/index.js'
import { exportFile, Notify } from 'quasar'
import { image } from '@pdfme/schemas'
import { generate } from '@pdfme/generator'

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
    headers: {
      'Content-Type': 'application/json'
    }
  }
  // Add the Authorization header if jwt is defined
  const jwt = await api.get('storage').getItem(config.gatewayJwt)
  if (jwt) options.headers.Authorization = 'Bearer ' + jwt
  // Perform the request
  let dismiss = null
  dismiss = Notify.create({
    group: 'capture',
    icon: 'las la-hourglass-half',
    message: i18n.t('KCapture.PRINTING_VIEW'),
    color: 'primary',
    timeout: 0,
    spinner: true
  })

  const results = []
  const dateArray = generateDateArray(values.dateTime.start, values.dateTime.end)
  try {
    for (let index = 0; index < dateArray.length; index++) {
      // Setup the request body
      options.body = JSON.stringify({
        activity: kActivity.value.is3D() ? 'globe' : 'map',
        layers,
        bbox: [bbox.west, bbox.south, bbox.east, bbox.north],
        size: { width: +values.resolution.width, height: +values.resolution.height },
        layout: getLayout(values),
        time: dateArray[index],
        basePath: _.has(values, 'basePath') ? values.basePath : '/#/home/',
        lang: getLocale()
      })
      const response = await fetch(endpoint, options)
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer()
        results.push(arrayBuffer)
      } else {
        Events.emit('error', { message: i18n.t('errors.' + response.status) })
      }
    }
    if (values.format === 'pdf') {
      const pdf = await generatePdf(results, _.toNumber(values.resolution.width), _.toNumber(values.resolution.height))
      exportFile(i18n.t('utils.capture.CAPTURE_PDF_FILE', { time: _.get(dateArray, '[0]', '') }), pdf)
    } else {
      _.forEach(results, (result, index) => {
        const time = dateArray[index]
        exportFile(i18n.t('utils.capture.CAPTURE_IMAGE_FILE', { time: _.get(dateArray, `[${index}]`, '') }), new Uint8Array(result))
      }) 
    }
    dismiss()
  } catch (error) {
    // Network/Service error
    dismiss()
    logger.error(error)
    Events.emit('error', { message: i18n.t('errors.NETWORK_ERROR') });
  }  
}

// Layout utility functions
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

  if (_.has(values, 'header') && !_.isEmpty(values.header)) _.set(layout, 'header', headerFooterComponent(values.header, 'header'))
  if (_.has(values, 'footer') && !_.isEmpty(values.footer)) _.set(layout, 'footer', headerFooterComponent(values.footer, 'footer'))
  if (_.includes(placements, values.north)) _.set(layout, 'stickies', northComponent(values.north))
  if (_.includes(placements, values.legend)) _.set(layout, `windows.${values.legend}`, legendComponent())

  return layout
}
function headerFooterComponent (text, position) {
  return { content: [{ component: _.get(config, `capture.${position}.component`, 'KCaptureTextArea'), text, position }], visible: true }
}
function northComponent (position) {
  const northSticky = Layout.findSticky('north-arrow-sticky')
  return { content: [{ ...northSticky, position, offset: [0, 5], visible: true }] }
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
// Moment utility functions
function generateDateArray (startDateString, endDateString) {
  if (startDateString === endDateString) return [startDateString]
  // Convert input strings to Moment.js objects
  const startDate = moment.utc(startDateString)
  const endDate = moment.utc(endDateString)
  const intervalMinutes =  Store.get('time.interval')
  const dateArray = []
  // Clone the start date for iteration
  let currentDate = startDate.clone()
  // Iterate until the current date is before the end date
  while (currentDate.isSameOrBefore(endDate)) {
    dateArray.push(currentDate.toISOString())
    currentDate.add(intervalMinutes, 'minutes')
  }
  return dateArray
}
// PDFME utility functions
function getImageProperties (width, height) {
  const imageProperties = { type: 'image', rotate: 0}
  if (width > height) {
    imageProperties.width = 287
    imageProperties.height = 287 * height / width
    imageProperties.position = { x: 5, y: (210 - imageProperties.height) / 2 }
  } else {
    imageProperties.height = 200
    imageProperties.width = 200 * width / height
    imageProperties.position = { y: 5, x: (297 - imageProperties.width) / 2 }
  }

  return imageProperties
}
async function generatePdf (imageArray, width, height) {
  const template = {
    schemas: [ { capture: getImageProperties(width, height) }],
    basePdf: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iaiA8PC9UeXBlL1hPYmplY3QvUmVzb3VyY2VzPDwvUHJvY1NldFsvUERGL1RleHRdL0ZvbnQgMiAwIFI+Pi9TdWJ0eXBlL0Zvcm0vQkJveFswIDAgMjk4IDQyMF0vTWF0cml4WzEgMCAwIDEgMCAwXS9MZW5ndGggNDQvRm9ybVR5cGUgMS9GaWx0ZXIvRmxhdGVEZWNvZGU+PnN0cmVhbQp4nDPQM1Qo5ypUMFAw0DNRMLI01zNXMDG01DNTKEpVCNdSyOMKVAAAiEAHjgplbmRzdHJlYW0KZW5kb2JqCjMgMCBvYmogPDwvTGVuZ3RoIDgxL0ZpbHRlci9GbGF0ZURlY29kZT4+c3RyZWFtCnicK+RyCuEyNlMwNbXUMzZVCEnhcg3hCuQqVDDQMzMwNDNUMABBKNvY2FDP2ETB2MBMz8xcITlXQT8izVDBJV8hkAukzFAhyJ0rmAsAxQ8Q1AplbmRzdHJlYW0KZW5kb2JqCjQgMCBvYmo8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1s1IDAgUl0+PgplbmRvYmoKNSAwIG9iajw8L1BhcmVudCA0IDAgUi9UeXBlL1BhZ2UvQ29udGVudHMgMyAwIFIvUmVzb3VyY2VzPDwvUHJvY1NldFsvUERGL1RleHQvSW1hZ2VCL0ltYWdlQy9JbWFnZUldL1hPYmplY3Q8PC9YZjEgMSAwIFI+Pj4+L01lZGlhQm94WzAgMCA4NDEuOTUgNTk1LjM1XT4+CmVuZG9iagoyIDAgb2JqPDw+PgplbmRvYmoKNiAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyA0IDAgUj4+CmVuZG9iago3IDAgb2JqPDwvUHJvZHVjZXIoUERGaWxsOiBGcmVlIFBERiBXcml0ZXIgYW5kIFRvb2xzKS9Nb2REYXRlKEQ6MjAwOTEwMTgyMjMwMTArMDInMDAnKS9DcmVhdGlvbkRhdGUoRDoyMDA5MTAxODIyMzAxMCswMicwMCcpPj4KZW5kb2JqCnhyZWYKMCA4CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwNjAyIDAwMDAwIG4gCjAwMDAwMDAyNDQgMDAwMDAgbiAKMDAwMDAwMDM5MSAwMDAwMCBuIAowMDAwMDAwNDQxIDAwMDAwIG4gCjAwMDAwMDA2MjEgMDAwMDAgbiAKMDAwMDAwMDY2NSAwMDAwMCBuIAp0cmFpbGVyCjw8L1Jvb3QgNiAwIFIvSW5mbyA3IDAgUi9TaXplIDg+PgpzdGFydHhyZWYKNzk5CiUlRU9GCg=='
  }
  const plugins = { image }
  const inputs = []
  _.forEach(imageArray, (value) => {
    inputs.push({ capture: `data:image/png;base64,${base64Encode(value)}` })
  })
  return await generate({ template, plugins, inputs })
}
