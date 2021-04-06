import _ from 'lodash'
import { Dialog, exportFile } from 'quasar'
import { getIconName, getInitials } from '../utils'
import { Layout } from '../layout'

export default {
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
    actions: function () {
      // Make configured actions reactive as item actions are built from
      this.configureActions()
    }
  },
  data () {
    return {
      itemActions: null
    }
  },
  computed: {
    avatar () {
      const iconName = this.getIconName()
      const iconColor = this.getIconColor()
      if (iconName || iconColor) {
        return {
          type: 'icon',
          icon: { name: iconName, color: iconColor || 'primary' }
        }
      }
      const name = this.getName()
      return {
        type: 'text',
        text: getInitials(name)
      }
    },
    name () {
      return this.getName()
    },
    description () {
      return this.getDescription()
    }
  },
  methods: {
    getName () {
      return _.get(this.item, this.options.nameField || 'name', '')
    },
    getDescription () {
      return _.get(this.item, this.options.descriptionField || 'description', '')
    },
    getIcon () {
      return (this.options.iconField ? _.get(this.item, this.options.iconField, '') : this.item.icon)
    },
    getIconName () {
      // Check for custom icon name field
      if (this.options.iconNameField) {
        return getIconName(this.item, this.options.iconNameField)
      } else {
        const icon = this.getIcon()
        return (icon ? getIconName(icon, 'name') : '')
      }
    },
    getIconColor () {
      // Check for custom icon color field
      if (this.options.iconColorField) {
        return _.get(this.item, this.options.iconColorField, '')
      } else {
        const icon = this.getIcon()
        return (icon ? _.get(icon, 'color', '') : '')
      }
    },
    setActions (actions) {
      // As context is different for each item we need to clone the global action configuration
      // otheriwse context will always reference the last processed item
      this.itemActions = (this.bindActions ? Layout.bindContent(_.cloneDeep(actions), this) : actions)
    },
    clearActions () {
      this.itemActions = null
    },
    filteredActions () {
      return (this.actions ? Layout.filterContent(this.actions, this.filter || {}) : [])
    },
    // This method should be overriden in items
    configureActions () {
      // Apply filtering
      const actions = this.filteredActions()
      if (actions && actions.length > 0) this.setActions(actions)
      else this.clearActions()
    },
    onItemSelected (section) {
      this.$emit('item-selected', this.item, section)
    },
    editItem () {

    },
    removeItem () {
      const name = this.getName()
      Dialog.create({
        message: this.$t('mixins.baseItem.REMOVE_MESSAGE', { name }),
        html: true,
        ok: {
          label: this.$t('OK'),
          flat: true
        },
        cancel: {
          label: this.$t('CANCEL'),
          flat: true
        }
      }).onOk(() => {
        this.$api.getService(this.service).remove(this.item._id)
      })
    },
    exportItem () {
      const name = this.getName()
      const file = name + '.json'
      if (exportFile(file, JSON.stringify(this.item))) {
        this.$toast({ type: 'error', message: this.$t('mixins.baseItem.ITEM_EXPORTED', { name, file }) })
      } else {
        this.$toast({ type: 'error', message: this.$t('mixins.baseItme.CANNOT_EXPORT_ITEM') })
      }
    }
  },
  created () {
    // Register the actions
    this.configureActions()
    // Whenever the user abilities are updated, update actions as well
    this.$events.$on('user-abilities-changed', this.configureActions)
  },
  beforeDestroy () {
    this.$events.$off('user-abilities-changed', this.configureActions)
  }
}
