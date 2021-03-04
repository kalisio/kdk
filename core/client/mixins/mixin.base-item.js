import _ from 'lodash'
import { getIconName, getInitials } from '../utils'
import { Layout } from '../layout'

export default {
  props: {
    contextId: {
      type: String,
      default: ''
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
    getName () {
      // Check for custom name field
      return this.options.nameField ? _.get(this.item, this.options.nameField, '') : this.item.name
    },
    getDescription () {
      // Check for custom description field
      return this.options.descriptionField ? _.get(this.item, this.options.descriptionField, '') : this.item.description
    },
    setActions (actions) {
      // As context is different for each item we need to clone the global action configuration
      // otheriwse context will always reference the last processed item
      this.itemActions = Layout.bindContent(_.cloneDeep(actions), this)
    },
    clearActions () {
      this.itemActions = null
    },
    // This method should be overriden in items
    configureActions () {
      if (this.actions) {
        // Apply filtering
        const actions = Layout.filterContent(this.actions, this.filter)
        this.setActions(actions)
      } else this.clearActions()
    },
    onItemSelected (section) {
      this.$emit('item-selected', this.item, section)
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
