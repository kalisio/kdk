import _ from 'lodash'
import logger from 'loglevel'
import { colors } from 'quasar'
import { Reader } from '../reader.js'
import { i18n } from '../i18n.js'

export const vDropFile = {

  mounted (el, binding) {
    el.__state = {
      acceptedTypes:  _.get(binding.value, 'mimeTypes'),
      dropCallback: _.get(binding.value, 'dropCallback'),
      fontSize: _.get(binding.value, 'fontSize', '2rem'),
      enabled: _.get(binding.value, 'enabled', true)
    }
    // Make element relative
    el.style.position = 'relative'
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'drag-overlay'
    overlay.innerHTML = `<div class="drag-overlay-box" />`
    el.appendChild(overlay)
    const style = document.createElement('style')
    style.textContent = `
      .drag-overlay {
        display: none;
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        justify-content: center;
        align-items: center;
        font-size: ${el.__state.fontSize};
        z-index: 9999;
        pointer-events: none;
      }
      .drag-overlay-box {
        display: flex;
        border: 3px dashed;
        width: 95%; height: 95%;
        border-radius: 5px;
        justify-content: center;
        align-items: center;
        pointer-events: none;
      }
    `
    document.head.appendChild(style)
    const showOverlay = () => overlay.style.display = 'flex'
    const hideOverlay = () => overlay.style.display = 'none'
    let dragCounter = 0

    const onDragEnter = (e) => {
      // check whether the directive is enabled
      if (!el.__state.enabled) return
      e.preventDefault()
      // filter the items
      const items = e.dataTransfer.items
      let rejectedItems = []
      let acceptedItems = []
      for (const item of items) {
        if (item.kind === 'file' && el.__state.acceptedTypes.includes(item.type)) acceptedItems.push(item)
        else rejectedItems.push(item)
      }
      // customize the elements
      let color, message
      if (_.isEmpty(acceptedItems)) {
        color = colors.getPaletteColor('negative')
        message = i18n.tc('directives.ALL_FILES_ARE_UNSUPPORTED', rejectedItems.length)
      }
      else if (_.isEmpty(rejectedItems)) {
        color = colors.getPaletteColor('positive')
        message = i18n.tc('directives.DROP_FILES', acceptedItems.length)
      }
      else {
        color = colors.getPaletteColor('warning')
        message = i18n.t('directives.SOME_FILES_ARE_UNSUPPORTED')
      }
      overlay.style.background = '#0007'
      const overlayBox = overlay.querySelector('.drag-overlay-box')
      overlayBox.textContent = message
      overlayBox.style.borderColor = color
      overlayBox.style.color = 'white'
      overlayBox.style.textShadow = '-2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black, 2px 2px 0 black'
      overlayBox.style.padding = '20px;'
      
      // show the overlay
      dragCounter++
      showOverlay()
    }
    const onDragOver = (e) => {
      e.preventDefault()
    }
    const onDragLeave = (e) => {
      e.preventDefault()
      dragCounter--
      if (dragCounter === 0) hideOverlay()
    }
    const onDrop = async (e) => {
      e.preventDefault()
      dragCounter = 0
      hideOverlay()
      const files = Array.from(e.dataTransfer.files)
      // call the provided handler with the accepted files
      if (el.__state.dropCallback && typeof el.__state.dropCallback === 'function') {
        const acceptedFiles = Reader.filter(files)
        for (const file of acceptedFiles) {
          const content = await Reader.read(file)
          await el.__state.dropCallback(content)
        }
      } else logger.warn(`[KDK] Missing 'dropCallback' argument in 'v-drop-file' directive`)
    }
      
    el.__handlers = { onDragEnter, onDragOver, onDragLeave, onDrop }
    el.addEventListener('dragenter', onDragEnter)
    el.addEventListener('dragover', onDragOver)
    el.addEventListener('dragleave', onDragLeave)
    el.addEventListener('drop', onDrop)
  },

  updated (el, binding) {
    // Handle arguments changes
    if (binding.value !== binding.oldValue) {
      el.__state = {
        acceptedTypes:  _.get(binding.value, 'mimeTypes'),
        dropCallback: _.get(binding.value, 'dropCallback'),
        fontSize: _.get(binding.value, 'fontSize', '2rem'),
        enabled: _.get(binding.value, 'enabled', true)
      }
    }
  },

  beforeUnmount (el, binding) {
    // Clean directive
    const { onDragEnter, onDragOver, onDragLeave, onDrop } = el.__handlers
    el.removeEventListener('dragenter', onDragEnter)
    el.removeEventListener('dragover', onDragOver)
    el.removeEventListener('dragleave', onDragLeave)
    el.removeEventListener('drop', onDrop)
    delete el.__handlers
    delete el.__state
  }
}
