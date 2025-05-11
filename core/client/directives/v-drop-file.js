import _ from 'lodash'
import { colors } from 'quasar'
import { Reader } from '../reader.js'
import { i18n } from '../i18n.js'

export const vDropFile = {

  mounted (el, binding) {
    const { value } = binding;
    const acceptedTypes = value?.mimeTypes || null
    const onDropCallback = value?.onDrop
    const fontSize = value?.fontSize || '2rem'

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'drag-overlay'
    overlay.innerHTML = `<div class="drag-overlay-box" />`
    document.body.appendChild(overlay)
    const style = document.createElement('style')
    style.textContent = `
      .drag-overlay {
        display: none;
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.6);
        font-size: ${fontSize};
        z-index: 9999;
        pointer-events: none;
      }
      .drag-overlay.visible {
        display: flex;
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
    const showOverlay = () => overlay.classList.add('visible')
    const hideOverlay = () => overlay.classList.remove('visible')
    let dragCounter = 0

    const onDragEnter = (e) => {
      e.preventDefault()
      // filter the items
      const items = e.dataTransfer.items
      let rejectedItems = []
      let acceptedItems = []
      for (const item of items) {
        if (item.kind === 'file' && acceptedTypes.includes(item.type)) acceptedItems.push(item)
        else rejectedItems.push(item)
      }
      // customize the elements
      let color, message
      if (_.isEmpty(acceptedItems)) {
        color = colors.getPaletteColor('negative')
        console.log(rejectedItems.length)
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
      overlay.style.background = colors.changeAlpha(color, 0.05)
      const overlayBox = overlay.querySelector('.drag-overlay-box')
      overlayBox.textContent = message
      overlayBox.style.borderColor = color
      overlayBox.style.color = color
      overlayBox.style.textShadow = '-2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff, 0 0 ' + fontSize + ' ' + color
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
      if (onDropCallback && typeof onDropCallback === 'function') {
        const acceptedFiles = Reader.filter(files)
        for (const file of acceptedFiles) {
          const content = await Reader.read(file)
          await onDropCallback(content)
        }
      }
    }
      
    el.__dropHandlers__ = { onDragEnter, onDragOver, onDragLeave, onDrop }
    el.addEventListener('dragenter', onDragEnter)
    el.addEventListener('dragover', onDragOver)
    el.addEventListener('dragleave', onDragLeave)
    el.addEventListener('drop', onDrop)
  },

  beforeUnmount (el, binding) {
    // Remove Event Listeners
    const { onDragEnter, onDragOver, onDragLeave, onDrop } = el.__dropHandlers__
    el.removeEventListener('dragenter', onDragEnter)
    el.removeEventListener('dragover', onDragOver)
    el.removeEventListener('dragleave', onDragLeave)
    el.removeEventListener('drop', onDrop)
    delete el.__dropHandlers__
  }
}
