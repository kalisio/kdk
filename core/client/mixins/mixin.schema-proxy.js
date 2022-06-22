import _ from 'lodash'
import { createQuerablePromise, loadSchema } from '../utils.js'
import { Events } from '../events.js'

export const schemaProxy = {
  props: {
    schemaJson: {
      type: String,
      default: ''
    },
    schemaFunction: {
      type: Function,
      default: null
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
      return _.get(this.schema, '$id', '')
    },
    filterSchema () {
      // We can filter properties in schema
      const properties = this.schema.properties
      // Define the properties filter, could be either a joined list (eg query string) or an array
      let propertiesFilter = (typeof this.schemaProperties === 'string' ? _.split(this.schemaProperties, ',') : this.schemaProperties)
      if (typeof propertiesFilter === 'string') propertiesFilter = [propertiesFilter]
      if (propertiesFilter.length > 0) {
        Object.keys(properties).forEach(property => {
          if (!propertiesFilter.includes(property)) delete properties[property]
        })
        // Update schema ID so that a filtered schema is not similar to a complete one
        this.schema.$id += propertiesFilter.join()
        // Filter as well required properties
        this.schema.required = _.intersection(this.schema.required, propertiesFilter)
      }
    },
    async loadSchemaFromResource (schemaName) {
      try {
        this.schema = await loadSchema(schemaName)
        this.schema = _.cloneDeep(this.schema)
        // Apply filtering
        this.filterSchema()
        return this.schema
      } catch (error) {
        Events.emit('error', error)
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
        Events.emit('error', error)
        throw error
      }
    },
    async loadSchemaFromFunction (f) {
      try {
        this.schema = await f()
        // Apply filtering
        this.filterSchema()
        return this.schema
      } catch (error) {
        Events.emit('error', error)
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
          : (this.schemaFunction
            ? this.loadSchemaFromFunction(this.schemaFunction)
            : this.loadSchemaFromResource(schemaName)))
      }
      return this.schemaPromise
    }
  }
}
