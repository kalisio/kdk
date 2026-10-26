import { h } from 'vue'
import theme from '@kalisio/vitepress-theme'
import KnowledgeSearch from './components/KnowledgeSearch.vue'
import './custom.css'

export default {
  ...theme,
  // Rendered beside the theme's own layout rather than through a slot: the
  // theme ships a custom Layout, and nothing guarantees it forwards the
  // default theme's slots. A fragment adds no wrapper element, and the
  // floating button positions itself.
  Layout: () => [h(theme.Layout), h(KnowledgeSearch)]
}
