import _ from 'lodash'
import { createQuerablePromise } from '../utils'
import { Events } from '../events'

const schemaProxyMixin = {
  props: {
    schemaJson: {
      type: String,
      default: ''
    },
    schemaProperties: {
      type: [String, Array],
      default: () => []
    }
  },
  data () {
    return {
      schema: null
    }
  },
  methods: {
    getSchema () {
      return this.schema
    },
    getSchemaId () {
      return this.schema ? this.schema.$id : ''
    },
    filterSchema () {
      // We can filter properties in schema
      const properties = this.schema.properties
      // Define the properties filter
      let proopertiesFilter = (typeof this.schemaProperties === 'string' ? _.split(this.schemaProperties, ',') : this.schemaProperties)
      if (typeof proopertiesFilter === 'string') propertiesFilter = [propertiesFilter]
      if (proopertiesFilter.length > 0) {
        Object.keys(properties).forEach(property => {
          if (!proopertiesFilter.includes(property)) delete properties[property]
        })
        const suffixId = '-' + proopertiesFilter.join()
        this.schema.$id += suffixId
        this.schema.required = _.intersection(this.schema.required, proopertiesFilter)
      }
    },
    async loadSchemaFromResource (schemaName) {
      try {
        this.schema = await this.$load(schemaName, 'schema')
        // FIXME: not yet sure why this is now required, might be related to
        // https://forum.vuejs.org/t/solved-using-standalone-version-but-getting-failed-to-mount-component-template-or-render-function-not-defined/19569/2
        if (this.schema.default) this.schema = this.schema.default
        this.schema = _.cloneDeep(this.schema)
        // Apply filtering
        this.filterSchema()
        return this.schema
      } catch (error) {
        Events.$emit('error', error)
        throw error
      }
    },
    async loadSchemaFromJson (json) {
      try {
        this.schema = JSON.parse(json)
        // Apply filtering
        this.filterSchema()
        return this.schema
      } catch (error) {
        Events.$emit('error', error)
        throw error
      }
    },
    loadSchema (schemaName) {
      // Create a new mixin promise if required
      // In the JSON schema file we use a $id like 'http:/www.kalisio.xyz/schemas/service.operation-perspective.json#'
      const schemaChanged = schemaName && !this.getSchemaId().includes(schemaName + '.json')
      if (!this.schemaPromise || schemaChanged) {
        // We need to load the schema now
        this.schemaPromise = createQuerablePromise(this.schemaJson
          ? this.loadSchemaFromJson(this.schemaJson)
          : this.loadSchemaFromResource(schemaName))
      }
      return this.schemaPromise
    }
  }
}

export default schemaProxyMixin
