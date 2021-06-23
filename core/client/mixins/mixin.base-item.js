import _ from 'lodash'
import { Dialog, exportFile } from 'quasar'
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
    viewItem () {
      const path = this.$route.fullPath + `/view/${this.item._id}`
      this.$router.push(path)
    },
    editItem (scope = undefined) {
      const route = this.$route
      let subPath = '/edit/' + this.item._id
      if (scope)  subPath += `/${scope}`
      this.$router.push({
        path: route.path + subPath,
        params: route.params,
        query: route.query
      })
    },
    removeItem (prompt) {
      if (prompt === 'confirm' || prompt === 'input') {
        const name = this.name
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
      } else {
        this.$api.getService(this.service).remove(this.item._id)
      }
    },
    exportItem () {
      const name = this.name
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
