<template>
  <k-modal ref="modal" :title="title" :toolbar="toolbar" :buttons="[]" >
    <div slot="modal-content">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item v-for="filter in filters" :key="filter.key" class="col-12">
          <q-item-section>
            <component
              :is="filter.componentKey"
              :ref="filter.key"
              :properties="filter.properties"
              :display="{ icon: true, label: true, labelWidth: 3 }"
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
    },
    featureActions: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  computed: {
    title () {
      return this.$t('KFeaturesFilter.TITLE', { layer: this.layer.name })
    },
    fields () {
      return _.get(this.layer, 'schema.content.properties', {})
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
      toolbar: [{ id: 'close', icon: 'las la-times', tooltip: 'CLOSE', handler: () => this.close() }],
      filters: [],
      property: null
    }
  },
  methods: {
    createFilter (property, options = {}) {
      // Retrieve schema descriptor
      const properties = this.fields[property]
      const componentKey = _.kebabCase(properties.field.component)
      // Load the required component if not previously loaded
      if (!this.$options.components[componentKey]) {
        this.$options.components[componentKey] = this.$load(properties.field.component)
      }
      const filter = {
        key: uid().toString(),
        componentKey,
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
      _.forOwn(this.layer.baseQuery, (queryValue, queryKey) => {
        const property = _.findKey(this.fields, (value, key) => { return queryKey === `properties.${key}` })
        if (property) this.filters.push(this.createFilter(property, { value: queryValue }))
      })
      // Set the refs to be resolved
      if (this.filters.length) {
        this.setRefs(this.filters.map(filter => filter.key))
        await this.loadRefs()
      }
      // Then fill the fields
      this.filters.forEach(filter => this.$refs[filter.key][0].fill(filter.value))
      logger.debug('Built layer filter', this.filters)
    },
    onAddFilter (property) {
      this.filters.push(this.createFilter(property.value))
    },
    onRemoveFilter (filter) {
      // Required to update the array to make it reactive
      this.filters = this.filters.filter(item => item.key !== filter.key)
    },
    async onApply () {
      logger.debug('Applying layer filter', this.filters)
      // Manage removed filters
      _.forOwn(this.layer.baseQuery, (queryValue, queryKey) => {
        const property = _.findKey(this.fields, (value, key) => { return queryKey === `properties.${key}` })
        if (property && !_.find(this.filters, { property })) delete this.layer.baseQuery[queryKey]
      })
      // Manage updated filters or newly added filters
      this.filters.forEach(filter => {
        this.layer.baseQuery[`properties.${filter.property}`] = filter.value
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
      this.$refs.modal.open()
      await this.build()
    },
    close () {
      this.$refs.modal.close()
      this.$emit('closed')
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
