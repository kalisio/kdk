import _ from 'lodash'
import { Dialog, exportFile } from 'quasar'
import { bindContent, filterContent } from '../utils/index.js'

export const baseItem = {
  emits: [
    'item-selected',
    'item-toggled',
    'item-expanded'
  ],
  props: {
    contextId: {
      type: String,
      default: ''
    },
    service: {
      type: String,
      required: true
    },
    item: {
      type: Object,
      required: true
    },
    actions: {
      type: [Object, Array],
      default: () => null
    },
    filter: {
      type: Object,
      default: () => {}
    },
    handlerContext: {
      type: Object,
      default: () => null
    },
    options: {
      type: Object,
      default: function () {
        return {}
      }
    },
    bindActions: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    // Make configured actions reactive as item actions are built from
    item: function () {
      this.configureActions()
    },
    actions: function () {
      this.configureActions()
    }
  },
  data () {
    return {
      itemActions: null
    }
  },
  computed: {
    name () {
      return _.get(this.item, this.options.nameField || 'name', '')
    },
    description () {
      return _.get(this.item, this.options.descriptionField || 'description', '')
    }
  },
  methods: {
    setActions (actions) {
      // As context is different for each item we need to clone the global action configuration
      // otheriwse context will always reference the last processed item
      this.itemActions = (this.bindActions ? bindContent(_.cloneDeep(actions), this.handlerContext || this) : actions)
    },
    clearActions () {
      this.itemActions = null
    },
    filteredActions () {
      return (this.actions ? filterContent(this.actions, this.filter || {}) : [])
    },
    // This method should be overridden in items
    configureActions () {
      // Apply filtering
      const actions = this.filteredActions()
      if (actions && actions.length > 0) this.setActions(actions)
      else this.clearActions()
    },
    onItemToggled (toggled) {
      this.$emit('item-toggled', this.item, toggled)
    },
    onItemSelected (section) {
      this.$emit('item-selected', this.item, section)
    },
    onItemExpanded (expanded) {
      this.$emit('item-expanded', this.item, expanded)
    },
    canViewItem () {
      return this.$can('read', this.service, this.contextId, this.item)
    },
    viewItem () {
      const path = this.$route.fullPath + `/view/${this.item._id}`
      this.$router.push(path)
    },
    canEditItem () {
      return this.$can('update', this.service, this.contextId, this.item)
    },
    editItem (scope = undefined, properties = undefined) {
      const route = this.$route
      let subPath = 'edit/' + this.item._id
      // Add trailing / if required (as sometimes it might be already present)
      if (!route.path.endsWith('/')) subPath = `/${subPath}`
      if (scope) {
        if (properties) subPath += `/${properties}`
        else subPath += `/${scope}`
      }
      this.$router.push({
        path: route.path + subPath,
        params: route.params,
        query: route.query
      })
    },
    canRemoveItem () {
      return this.$can('remove', this.service, this.contextId, this.item)
    },
    removeItem (prompt, nameField = 'name') {
      if (prompt === 'confirm' || prompt === 'input') {
        const name = _.get(this.item, nameField)
        const input = {
          type: 'text',
          model: '',
          isValid: val => val === name
        }
        Dialog.create({
          title: this.$t('mixins.baseItem.REMOVE_ITEM_TITLE', { name }),
          message: prompt === 'input' ? this.$t('mixins.baseItem.REMOVE_ITEM_MESSAGE') : '',
          html: true,
          prompt: prompt === 'input' ? input : undefined,
          persistent: true,
          ok: {
            label: this.$t('YES'),
            flat: true
          },
          cancel: {
            label: this.$t('NO'),
            flat: true
          }
        }).onOk(() => {
          this.$api.getService(this.service, this.contextId).remove(this.item._id)
        })
      } else {
        this.$api.getService(this.service, this.contextId).remove(this.item._id)
      }
    },
    exportItem () {
      const name = this.name
      const file = name + '.json'
      if (exportFile(file, JSON.stringify(this.item))) {
        this.$notify({ type: 'positive', message: this.$t('mixins.baseItem.ITEM_EXPORTED', { name, file }) })
      } else {
        this.$notify({ type: 'negative', message: this.$t('mixins.baseItme.CANNOT_EXPORT_ITEM') })
      }
    }
  },
  created () {
    // Register the actions
    this.configureActions()
    // Whenever the user abilities are updated, update actions as well
    this.$events.on('user-abilities-changed', this.configureActions)
  },
  beforeUnmount () {
    this.$events.off('user-abilities-changed', this.configureActions)
  }
}
