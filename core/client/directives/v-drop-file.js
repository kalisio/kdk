import _ from 'lodash'
import logger from 'loglevel'
import { colors, Notify } from 'quasar'
import { Reader } from '../reader.js'
import { i18n } from '../i18n.js'
import { formatSize } from '../utils/utils.files.js'

export const vDropFile = {

  mounted (el, binding) {
    el.__state = {
      dropCallback: _.get(binding.value, 'dropCallback'),
      acceptedTypes:  _.get(binding.value, 'mimeTypes'),
      maxFiles:  _.get(binding.value, 'maxFiles'),
      maxFileSize:  _.get(binding.value, 'maxFileSize'),
      maxTotalSize:  _.get(binding.value, 'maxTotalSize'),
      fontSize: _.get(binding.value, 'fontSize', '2rem'),
      enabled: _.get(binding.value, 'enabled', true)
    }
    // check whether the dropCallback has been set properly
    if (!el.__state.dropCallback || typeof el.__state.dropCallback !== 'function') {
      logger.error(`[KDK] Missing 'dropCallback' argument in 'v-drop-file' directive`)
      return
    }
    // make element relative
    el.style.position = 'relative'
    // create overlay element
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
    let canDrop = false

    const onDragEnter = (e) => {
      // check whether the directive is enabled
      if (!el.__state.enabled) return
      e.preventDefault()
      // check the dragged items
      const items = e.dataTransfer.items
      let rejectedItems = []
      let acceptedItems = []
      let color, message
      if (el.__state.maxFiles && _.size(items) > el.__state.maxFiles) {
        color = colors.getPaletteColor('negative')
        message = i18n.tc('errors.MAX_FILES_REACHED', el.__state.maxFiles)
      } else {
        for (const item of items) {
          if (item.kind === 'file' && _.includes(el.__state.acceptedTypes, item.type)) acceptedItems.push(item)
          else rejectedItems.push(item)
        }  
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
      }
      canDrop = _.size(acceptedItems) > 0
      // customize the overlay
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
      if (!canDrop) return
      const files = Array.from(e.dataTransfer.files)
      const acceptedFiles = Reader.filter(files)    
      if (el.__state.maxTotalSize && _.size(acceptedFiles) > 1) {
        let totalSize = _.reduce(acceptedFiles, (size, file) => {
          size += file.files[0].size
          return size
        }, 0)
        if (totalSize > el.__state.maxTotalSize) {
          Notify.create({ type: 'negative', message: i18n.t('errors.MAX_TOTAL_SIZE_FILES_REACHED', { maxSize: formatSize(el.__state.maxTotalSize) }) })
          return
        }
      }
      for (const file of acceptedFiles) {
        if (el.__state.maxFileSize) {
          let size = file.files[0].size
          if (size > el.__state.maxFileSize) {
            Notify.create({ type: 'negative', message: i18n.t('errors.MAX_FILE_SIZE_REACHED', { file: file.name, maxSize: formatSize(el.__state.maxFileSize) }) })
            continue
          }
        }
        const content = await Reader.read(file)
        await el.__state.dropCallback(content)
      }
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
        dropCallback: _.get(binding.value, 'dropCallback'),
        acceptedTypes:  _.get(binding.value, 'mimeTypes'),
        maxFiles:  _.get(binding.value, 'maxFiles'),
        maxFileSize:  _.get(binding.value, 'maxFileSize'),
        maxTotalSize:  _.get(binding.value, 'maxTotalSize'),        
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
