import _ from 'lodash'
import { getIconName, getInitials } from '../utils'

const baseItemMixin = {
  props: {
    contextId: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      actions: {
        pane: [],
        menu: []
      }
    }
  },
  computed: {
    avatar () {
      const icon = this.getIcon()
      if (icon) {
        return {
          type: 'icon',
          icon
        }
      }
      const iconName = this.getIconName()
      const iconColor = this.getIconColor()
      if (iconName && iconColor) {
        return {
          type: 'icon',
          icon: { name: iconName, color: iconColor }
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
    getIcon () {
      return this.options.iconField ? _.get(this.item, this.options.iconField, '') : this.item.icon
    },
    getIconName () {
      // Check for custom icon field
      return this.options.iconNameField ? getIconName(this.item, this.options.iconNameField) : getIconName(this.item, 'icon.name')
    },
    getIconColor () {
      // Check for custom icon field
      return this.options.iconColorField ? _.get(this.item, this.options.iconColorField, '') : _.get(this.item, 'icon.color', '')
    },
    getName () {
      // Check for custom name field
      return this.options.nameField ? _.get(this.item, this.options.nameField, '') : this.item.name
    },
    getDescription () {
      // Check for custom description field
      return this.options.descriptionField ? _.get(this.item, this.options.descriptionField, '') : this.item.description
    },
    registerPaneAction (action) {
      this.registerAction('pane', action)
    },
    registerMenuAction (action) {
      this.registerAction('menu', action)
    },
    registerAction (type, action) {
      this.actions[type] = this.actions[type].concat([action])
    },
    getActions (type) {
      return this.actions[type] || []
    },
    getAction (name) {
      let action = null
      _.forOwn(this.actions, (value, key) => {
        const actionForType = value.find(action => action.name === name)
        if (actionForType) action = actionForType
      })
      return action
    },
    clearActions () {
      this.actions.menu = []
      this.actions.pane = []
    },
    // This method should be overriden in items
    refreshActions () {
      this.clearActions()
    },
    onItemSelected () {
      this.$emit('item-selected', this.item)
    }
  },
  created () {
    // Register the actions
    this.refreshActions()
    // Whenever the user abilities are updated, update actions as well
    this.$events.$on('user-abilities-changed', this.refreshActions)
  },
  beforeDestroy () {
    this.$events.$off('user-abilities-changed', this.refreshActions)
  }
}

export default baseItemMixin
