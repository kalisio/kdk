<template>
  <k-modal ref="modal"
    id="feature-filter-modal"
    :title="title">
    <div slot="modal-content">
      <q-list dense class="row items-center justify-around">
        <q-item v-for="filter in filters" :key="filter.key" class="col-12">
          <q-item-section avatar v-if="filter.operator">
            <q-select v-model="filter.operator" :label="filter.property" stack-label :options="getOperators(filter)" emit-value map-options/>
          </q-item-section>
          <q-item-section>
            <component
              :is="filter.componentKey"
              :ref="filter.key"
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
      <div class="row justify-end" style="padding: 12px">
        <q-btn id="apply-button" color="primary" flat :label="$t('APPLY')" @click="onApply"/>
      </div>
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { uid } from 'quasar'
import { mixins as kCoreMixins } from '../../../core/client'

export default {
  name: 'k-features-filter',
  components: {
  },
  mixins: [
    kCoreMixins.baseModal,
    kCoreMixins.refsResolver()
  ],
  props: {
    layer: {
      type: Object,
      required: true
    },
    contextId: {
      type: String,
      default: ''
    }
  },
  computed: {
    title () {
      return this.$t('KFeaturesFilter.TITLE', { layer: this.layer.name })
    },
    fields () {
      // Avoid modifying the layer schema as we might update it internally
      return _.cloneDeep(_.get(this.layer, 'schema.content.properties', {}))
    },
    properties () {
      const properties = []
      _.forOwn(this.fields, (value, key) => {
        // Use helper or ID
        properties.push({
          label: _.get(value, 'field.helper', key),
          value: key
        })
      })
      return properties
    }
  },
  data () {
    return {
      filters: [],
      property: null
    }
  },
  methods: {
    async createFilter (property, options = {}) {
      // Retrieve schema descriptor
      const properties = this.fields[property]
      let component = properties.field.component
      // We previously directly used the component type from the schema
      // but now we prefer to switch to a select field in order to:
      // - be able to select multiple target values at once
      // - provide list of possible values for discrete types
      if (component !== 'form/KNumberField') {
        component = 'form/KSelectField'
        properties.field.multiple = true
        properties.field.chips = true
        // Get available values
        const values = await this.$api.getService('features', this.contextId)
          .find({ query: Object.assign({ $distinct: `properties.${property}` }, this.layer.baseQuery) })
        // We don't have label in that case
        properties.field.options = values.map(value => ({ value, label: value }))
      }
      // Remove label as we add it on top of the operator
      properties.field.helper = ''
      const componentKey = _.kebabCase(component)
      // Load the required component if not previously loaded
      if (!this.$options.components[componentKey]) {
        this.$options.components[componentKey] = this.$load(component)
      }
      const filter = {
        key: uid().toString(),
        component,
        componentKey,
        operator: (component !== 'form/KNumberField' ? '$in' : '$eq'),
        property,
        properties,
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
      const queryKeys = Object.keys(this.layer.baseQuery)
      for (let i = 0; i < queryKeys.length; i++) {
        const queryKey = queryKeys[i]
        // Do not rely on _.get here as the key should use dot notation, e.g. 'properties.xxx'
        const queryValue = this.layer.baseQuery[queryKey]
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
      // Set the refs to be resolved
      if (this.filters.length) {
        this.setRefs(this.filters.map(filter => filter.key))
        await this.loadRefs()
      }
      // Then fill the fields
      this.filters.forEach(filter => this.$refs[filter.key][0].fill(filter.value))
      logger.debug('Built layer filter', this.filters)
    },
    getOperators (filter) {
      let operators = []
      if (filter.component === 'form/KNumberField') {
        operators = operators.concat([{
          label: this.$i18n.t('KFeaturesFilter.EQUAL'),
          value: '$eq'
        }, {
          label: this.$i18n.t('KFeaturesFilter.NOT_EQUAL'),
          value: '$neq'
        }, {
          label: this.$i18n.t('KFeaturesFilter.GREATER_THAN'),
          value: '$gt'
        }, {
          label: this.$i18n.t('KFeaturesFilter.LOWER_THAN'),
          value: '$lt'
        }])
      } else {
        operators = operators.concat([{
          label: this.$i18n.t('KFeaturesFilter.IN'),
          value: '$in'
        }, {
          label: this.$i18n.t('KFeaturesFilter.NOT_IN'),
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
      _.forOwn(this.layer.baseQuery, (queryValue, queryKey) => {
        const field = _.findKey(this.fields, (value, key) => { return queryKey === `properties.${key}` })
        // Do not rely on _.unset here as the key should use dot notation, e.g. 'properties.xxx'
        if (field) delete this.layer.baseQuery[queryKey]
      })
      // Update filters
      this.filters.forEach(filter => {
        const field = this.fields[filter.property]
        const isNumber = (field.component === 'form/KNumberField')
        const value = (isNumber && _.isNumber(filter.value) ? _.toNumber(filter.value) : filter.value)
        // Do not rely on _.get here as the key should use dot notation, e.g. 'properties.xxx'
        const queryFilter = this.layer.baseQuery[`properties.${filter.property}`] || {}
        this.layer.baseQuery[`properties.${filter.property}`] = _.merge(queryFilter, { [filter.operator]: value })
      })
      // Update icon to reflect there is a filter on
      if (this.filters.length) {
        this.layer.badge = {
          color: 'primary',
          transparent: true,
          icon: { name: 'las la-filter', size: '12px' }
        }
      } else {
        delete this.layer.badge
      }
      this.$emit('applied')
    },
    async open () {
      this.setRefs(['modal'])
      await this.loadRefs()
      this.openModal()
      await this.build()
    }
  },
  created () {
    // laod the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
  },
  beforeDestroy () {

  }
}
</script>
