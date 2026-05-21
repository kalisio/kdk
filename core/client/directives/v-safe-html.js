import { Document } from '../document.js'

function sanitize(el, binding) {
  el.innerHTML = Document.sanitizeHtml(binding.value)
}

export const vSafeHtml = {
  mounted: sanitize,
  updated: sanitize,
}