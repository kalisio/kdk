import _ from 'lodash'
import logger from 'loglevel'
import { ref, readonly } from 'vue'
import { Schema } from '../index.js'
import AjvLocalize from 'ajv-i18n'
import { getLocale } from '../utils/utils.locale.js'

const locale = getLocale()

export function useSchema () {
  // Data
  const validator = ref(null)
  const schema = ref(null)

  // Functions
  async function compile (schemaNameOrObject, propertiesFilter) {
    if (typeof schemaNameOrObject === 'string') {
      // load the schema file
      logger.trace('[KDK] Loading schema ', schemaNameOrObject)
      const schemaModule = await import(`@schemas/${schemaNameOrObject}.json`)
      schema.value = _.cloneDeep(schemaModule.default)
    } else {
      // clone the schema object
      logger.trace('setting schema ', schemaNameOrObject.$id)
      schema.value = _.cloneDeep(schemaNameOrObject)
    }
    // filter ther schema
    if (propertiesFilter) {
      let properties = propertiesFilter
      if (typeof propertiesFilter === 'string') properties = _.split(propertiesFilter, ',')
      logger.trace('[KDK] Filtering schema with ', properties)
      _.forOwn(schema.value.properties, (value, key) => {
        if (!properties.includes(key)) delete schema.value.properties[key]
      })
      // updated the schema id
      schema.value.$id += properties.join()
      // filter the required properties
      schema.value.required = _.intersection(schema.value.required, properties)
    }
    // compile the schema
    logger.trace('[KDK] Compiling schema ', schema.value.$id)
    validator.value = Schema.register(schema.value)
  }
  function validate (values) {
    if (!validator.value) {
      logger.error('[KDK] schema \'validator\' not instantiated')
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
