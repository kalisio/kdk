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
  async function assign (schemaNameOrObject) {
    if (typeof schemaNameOrObject === 'string') {
      logger.debug('loading schema ', schemaNameOrObject)
      const schemaModule = await import(`@schemas/${schemaNameOrObject}.json`)
      schema.value = schemaModule.default
    } else {
      logger.debug('setting schema ', schemaNameOrObject.$id)
      schema.value = schemaNameOrObject
    }
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
    assign,
    validate
  }
}
