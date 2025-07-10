<template>
  <div v-if="readOnly && model" :id="properties.name + '-field'">
    <q-chip :color="model.color" dense>
      {{ model.name }}
    </q-chip>
  </div>
  <q-select v-else
    ref="select"
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="items"
    :label="label"
    :multiple="properties.multiselect"
    autocomplete="off"
    hide-dropdown-icon
    use-input
    clearable
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    bottom-slots
    :options="options"
    @filter="onSearch"
    @update:model-value="onSelected">
    <!-- Value display -->
    <template v-slot:selected-item="scope">
      <KChip
        v-bind="scope.opt"
        :label="scope.opt.name"
        square
        removable
        @remove="scope.removeAtIndex(scope.index)"
      />
    </template>
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :id="getId(scope.opt)"
      >
        <q-item-section v-if="scope.opt.create" class="col-auto">
          {{ $t('KTagManager.CREATE_TAG_ON_THE_FLY')}}
        </q-item-section>
        <q-item-section>
          <KChip v-bind="scope.opt" :label="scope.opt.name" />
        </q-item-section>
        <q-item-section v-if="!scope.opt.create" class="col-auto">
          <KPanel
              id="tag-actions"
              :content="getActions(scope.opt)"/>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { api } from '../../api.js'
import { Search } from '../../search'
import { baseField } from '../../mixins'
import KChip from '../KChip.vue'

export default {
  mixins: [baseField],
  components: {
    KChip
  },
  data () {
    return {
      items: null,
      options: [],
      searchString: ''
    }
  },
  computed: {
    hasSingleService () {
      const services = _.uniqBy(this.properties.services, 'service')
      return services.length === 1
    }
  },
  methods: {
    getServiceForItem (item) {
      return (this.hasSingleService
        ? this.properties.services[0]
        : _.find(this.properties.services, { service: item.service }))
    },
    getId (item) {
      return _.kebabCase(this.getLabel(item))
    },
    getLabel (item) {
      const service = this.getServiceForItem(item)
      return _.get(item, service.field || 'name', '')
    },
    getActions (item) {
      const actions = [{
        id: 'item-field-actions',
        component: 'menu/KMenu',
        dropdownIcon: 'las la-ellipsis-v',
        actionRenderer: 'item',
        propagate: false,
        dense: true,
        content: [
          {
            id: 'edit-tag',
            icon: 'las la-edit',
            label: 'KTagManager.EDIT_TAG',
            dialog: {
              component: 'KEditor',
              service: 'tags',
              object: item,
              hideButtons: true,
              schema: 'tags.update',
              cancelAction: 'CANCEL',
              baseObject: {
                service: _.get(this.properties, 'field.service'),
                property: _.get(this.properties, 'field.property')
              },
              afterRequest: () => {
                // Trigger a re-render of the select component
                this.$refs.select.updateInputValue(this.searchString)
                return { isOk: true }
              },
              okAction: {
                id: 'ok-button',
                label: 'APPLY',
                handler: 'apply'
              }
            }
          },
          {
            id: 'delete-tag',
            icon: 'las la-trash',
            label: 'KTagManager.DELETE_TAG',
            context: item,
            handler: this.deleteTag
          }
        ]
      }]
      return actions
    },
    emptyModel () {
      if (this.properties.multiselect) return []
      return null
    },
    fill (value) {
      this.model = value
      this.items = _.clone(value)
    },
    async onSearch (pattern, update, abort) {
      if (pattern.length < _.get(this.properties, 'minCharsToSearch', 2)) {
        abort()
        return
      }
      this.searchString = pattern
      const results = await Search.query(this.properties.services, pattern)
      update(() => {
        if (this.properties.multiselect) {
          this.options = _.differenceWith(results, this.items, (item1, item2) => {
            return _.get(item1, 'name') === _.get(item2, 'name') && _.get(item1, 'color') === _.get(item2, 'color')
          })
        } else this.options = results

        // Add the current pattern as an option if it is not already present
        const hasInvalidMinLength = pattern.length < _.get(this.properties, 'minLength', 0)
        const hasInvalidMaxLength = pattern.length > _.get(this.properties, 'maxLength', 256)
        if (hasInvalidMinLength || hasInvalidMaxLength) return
        this.options = _.filter(this.options, (item) => !item.create)
        if (pattern !== '' && (this.options.length === 0 || pattern !== this.options[0].name)) {
          this.options.push({
            name: pattern,
            color: 'grey',
            create: true
          })
        }
      })
    },
    async onSelected (value) {
      if (value) {
        // FIXME: ???
        if (this.properties.multiselect) this.model = this.items
        else this.model = this.items
      } else this.model = this.emptyModel()
      this.options = []
      this.$refs.select.updateInputValue('')
      this.onChanged()

      for (const item of value) {
        if (item.create) {
          const service = api.getService('tags')

          if (!_.get(this.properties, 'field.service') || !_.get(this.properties, 'field.property')) {
            logger.error('[KDK] KTagField: Missing service or property in field definition for tag creation.')
            return
          }

          const hasInvalidMinLength = item.name.length < _.get(this.properties, 'minLength', 0)
          const hasInvalidMaxLength = item.name.length > _.get(this.properties, 'maxLength', 256)
          if (hasInvalidMinLength || hasInvalidMaxLength) {
            logger.error(`[KDK] KTagField: Tag name "${item.name}" is invalid. It must be between ${_.get(this.properties, 'minLength', 0)} and ${_.get(this.properties, 'maxLength', 256)} characters long.`)
            return
          }

          await service.create({
            service: this.properties.field.service,
            property: this.properties.field.property,
            name: item.name,
            color: item.color || 'grey',
            description: ''
          })
          delete item.create
        }
      }
    },
    async deleteTag (item) {
      const service = api.getService('tags')
      await service.remove(item._id)
      // Trigger a re-render of the select component
      this.$refs.select.updateInputValue(this.searchString)
    }
  }
}

</script>
