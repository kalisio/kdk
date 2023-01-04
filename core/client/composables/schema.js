import _ from 'lodash'
import logger from 'loglevel'
import { ref, readonly } from 'vue'
import Ajv from 'ajv'
import AjvLocalize from 'ajv-i18n'
import { getLocale } from '../utils.js'
import draft6MetaSchema from 'ajv/lib/refs/json-schema-draft-06.json'

const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
  $data: true
})
ajv.addMetaSchema(draft6MetaSchema)
const locale = getLocale()

export function useSchema () {
  // Data
  const validator = ref(null)
  const schema = ref(null)

  // Function
  async function compile (schemaNameOrObject, propertiesFilter) {
    if (typeof schemaNameOrObject === 'string') {
      // load the schema file
      logger.debug('loading schema ', schemaNameOrObject)
      const schemaModule = await import(`@schemas/${schemaNameOrObject}.json`)
      schema.value = schemaModule.default
    } else {
      // clone the schema object
      logger.debug('setting schema ', schemaNameOrObject.$id)
      schema.value = _.cloneDeep(schemaNameOrObject)
    }
    // filter ther schema
    if (propertiesFilter) {
      let properties = propertiesFilter
      if (typeof propertiesFilter === 'string') properties = _.split(propertiesFilter, ',')
      logger.debug('filtering schema with ', properties)
      _.forOwn(schema.value.properties, (value, key) => {
        if (!properties.includes(key)) delete schema.value.properties[key]
      })
      // updated the schema id
      schema.value.$id += properties.join()
      // filter the required properties
      schema.value.required = _.intersection(schema.value.required, properties)
    }
    // compile the schema
    logger.debug('compiling schema ', schema.value.$id)
    validator.value = ajv.getSchema(schema.value.$id) || ajv.compile(schema.value)
  }
  function validate (values) {
    if (!validator.value) {
      logger.error('validator not instantiated')
      return
    }
    const result = validator.value(values)
    if (!result) {
      if (AjvLocalize[locale]) {
        AjvLocalize[locale](validator.value.errors)
      }
    }
    return { isValid: result, errors: validator.value.errors }
  }

  // Expose
  return {
    schema: readonly(schema),
    compile,
    validate
  }
}
