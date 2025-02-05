<template>
  <k-modal
    id="features-filter-modal"
    :title="title"
    :buttons="buttons"
    :maximized="isModalMaximized"
    v-model="isModalOpened"
  >
    <q-list dense class="row items-center justify-around">
      <q-item v-for="filter in filters" :key="filter.key" class="col-12">
        <q-item-section avatar v-if="filter.operator">
          <q-select v-model="filter.operator" :label="filter.property" stack-label :options="getOperators(filter)" emit-value map-options/>
        </q-item-section>
        <q-item-section>
          <component
            :is="filter.component"
            :ref="filter.onComponentCreated"
            :properties="filter.properties"
            :display="{ icon: false, label: false }"
            @field-changed="filter.onValueChanged"
          />
        </q-item-section>
        <q-item-section avatar>
          <q-btn flat color="primary" icon="las la-trash" @click="onRemoveFilter(filter)">
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
              {{$t('KFeaturesFilter.REMOVE_FILTER')}}
            </q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
      <q-item class="col-12">
        <q-item-section avatar class="col-6">
          {{$t('KFeaturesFilter.ADD_FILTER')}}
        </q-item-section>
        <q-item-section class="col-6">
          <q-select v-model="property" :options="properties">
            <template v-slot:after>
              <q-btn v-if="property" round dense flat icon="las la-plus" @click="onAddFilter(property)"/>
            </template>
          </q-select>
        </q-item-section>
      </q-item>
    </q-list>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import config from 'config'
import logger from 'loglevel'
import { uid } from 'quasar'
import { mixins as kCoreMixins, utils as kCoreUtils, composables as kCoreComposables } from '../../../core/client'
import { KModal } from '../../../core/client/components'

export default {
  name: 'k-features-filter',
  components: {
    KModal
  },
  emits: [
    'applied'
  ],
  mixins: [
    kCoreMixins.baseModal
  ],
  props: {
    layerId: {
      type: String,
      default: ''
    },
    layerName: {
      type: String,
      default: ''
    },
    contextId: {
      type: String,
      default: ''
    }
  },
  computed: {
    title () {
      return this.$t('KFeaturesFilter.TITLE') + ` ${this.layer.name}`
    },
    buttons () {
      return [
        { id: 'cancel-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.closeModal() },
        { id: 'apply-button', label: 'APPLY', renderer: 'form-button', handler: () => this.onApply() }
      ]
    },
    fields () {
      // Avoid modifying the layer schema as we might update it internally
      return _.cloneDeep(_.get(this.layer, 'schema.content.properties', {}))
    },
    properties () {
      const properties = []
      _.forOwn(this.fields, (value, key) => {
        // Use label or ID
        properties.push({
          label: _.get(value, 'field.label', key),
          value: key
        })
      })
      return properties
    }
  },
  data () {
    return {
      layer: {},
      filters: [],
      property: null
    }
  },
  methods: {
    async createFilter (property, options = {}) {
      // Retrieve schema descriptor
      const properties = this.fields[property]
      let componentName = properties.field.component
      // We previously directly used the component type from the schema
      // but now we prefer to switch to a select field in order to:
      // - be able to select multiple target values at once
      // - provide list of possible values for discrete types
      if (componentName !== 'form/KNumberField') {
        componentName = 'form/KSelectField'
        properties.multiselect = true
        properties.field.chips = true
        // Get available values
        let values = await this.$api.getService(this.layer.service, this.contextId)
          .find({ query: Object.assign({ $distinct: `properties.${property}` }, this.layer.baseQuery) })
        // Sort them to ease searching
        values = values.sort()
        // We don't have label in that case
        properties.field.options = values.map(value => ({ value, label: (_.isNil(value) ? 'NIL' : value) }))
      }
      // Remove label as we add it on top of the operator
      properties.field.helper = ''
      // Load the required component
      const component = kCoreUtils.loadComponent(componentName)
      const filter = {
        key: uid().toString(),
        component,
        componentName,
        operator: (componentName !== 'form/KNumberField' ? '$in' : '$eq'),
        property,
        properties,
        onComponentCreated: (ref) => { if (ref) ref.fill(filter.value) },
        onValueChanged: (field, value) => { filter.value = value }
      }
      return Object.assign(filter, options)
    },
    async build () {
      logger.debug('Building layer filter')
      // Since some properties are injected in form we need to make sure Vue.js has processed props
      // This could be done externally but adding it here we ensure no one will forget it
      await this.$nextTick()
      this.property = this.properties[0]
      const filters = _.get(this.layer, 'filters', [])
      for (let i = 0; i < filters.length; i++) {
        const filter = filters[i]
        // At the present time we get a single property per filter
        const queryKey = _.keys(filter.active)[0]
        // Do not rely on _.get here as the key should use dot notation, e.g. 'properties.xxx'
        const queryValue = filter.active[queryKey]
        const property = _.findKey(this.fields, (value, key) => { return queryKey === `properties.${key}` })
        if (property) {
          // Create a filter for each operator as complex filtering can use multiple keys, e.g.
          // 'properties.xxx': { $gte: y, $lte: z }
          const operators = Object.keys(queryValue)
          for (let j = 0; j < operators.length; j++) {
            const operator = operators[j]
            const value = queryValue[operator]
            const filter = await this.createFilter(property, { operator, value })
            this.filters.push(filter)
          }
        }
      }
    },
    getOperators (filter) {
      let operators = []
      if (filter.componentName === 'form/KNumberField') {
        operators = operators.concat([{
          label: this.$t('KFeaturesFilter.$eq'),
          value: '$eq'
        }, {
          label: this.$t('KFeaturesFilter.$neq'),
          value: '$neq'
        }, {
          label: this.$t('KFeaturesFilter.$gt'),
          value: '$gt'
        }, {
          label: this.$t('KFeaturesFilter.$lt'),
          value: '$lt'
        }])
      } else {
        operators = operators.concat([{
          label: this.$t('KFeaturesFilter.$in'),
          value: '$in'
        }, {
          label: this.$t('KFeaturesFilter.$nin'),
          value: '$nin'
        }])
      }
      return operators
    },
    async onAddFilter (property) {
      const filter = await this.createFilter(property.value)
      this.filters.push(filter)
    },
    onRemoveFilter (filter) {
      // Required to update the array to make it reactive
      this.filters = this.filters.filter(item => item.key !== filter.key)
    },
    async onApply () {
      logger.debug('Applying layer filter', this.filters)
      // Reset filters
      this.layer.filters = []
      // Update filters
      this.filters.forEach(filter => {
        const field = this.fields[filter.property]
        const isNumber = (field.componentName === 'form/KNumberField')
        const value = (isNumber && _.isNumber(filter.value) ? _.toNumber(filter.value) : filter.value)
        this.layer.filters.push({
          label: filter.property,
          description: this.$t(`KFeaturesFilter.${filter.operator}`) + `: ${value}`,
          isActive: true,
          active: { [`properties.${filter.property}`]: { [filter.operator]: value } },
          inactive: {}
        })
      })
      // If saved layer update it in DB
      if (this.layer._id) {
        try {
          await this.$api.getService('catalog', this.contextId).patch(this.layer._id, { filters: this.layer.filters })
        } catch (error) {
          // User error message on operation should be raised by error hook, otherwise this is more a coding error
          logger.error(error)
        }
      }
      // Actual layer update should be triggerred by real-time event
      // but as we might not always use sockets we should perform it explicitely in this case
      if (config.transport !== 'websocket') {
        await this.kActivity.updateLayer(this.layer.name)
      }
      this.closeModal()
    },
    async openModal () {
      // If not injected load it
      if (this.layerName) this.layer = this.kActivity.getLayerByName(this.layerName)
      else this.layer = await this.$api.getService('catalog', this.contextId).get(this.layerId)
      await this.build()
      kCoreMixins.baseModal.methods.openModal.call(this)
    }
  },
  setup (props) {
    return {
      ...kCoreComposables.useCurrentActivity()
    }
  }
}
</script>
