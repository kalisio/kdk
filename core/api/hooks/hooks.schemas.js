import makeDebug from 'debug'
import errors from '@feathersjs/errors'
import commonHooks from 'feathers-hooks-common'
import { schema as makeSchema } from '@feathersjs/schema'
import { Schema } from '../../common/schema.js'

const { BadRequest } = errors
const { getItems, replaceItems } = commonHooks
const debug = makeDebug('kdk:core:schemas:hooks')

export function validateData (schema) {
  // Create Feathers wrapper with our AJV instance
  schema = makeSchema(schema, Schema.ajv)

  return async (hook) => {
    if (hook.type !== 'before') {
      throw new Error('The \'validateData\' hook should only be used as a \'before\' hook.')
    }

    let items = getItems(hook)
    const isArray = Array.isArray(items)
    items = (isArray ? items : [items])
    // Perform validation
    items = await Promise.allSettled(items.map((item) => schema.validate(item)))
    // Keep track of validation errors, even if invalid data will be filtered this ensure
    // original data with validation error will be "tagged"
    items.forEach(item => {
      if (item.status === 'rejected') {
        item.validationError = (item.reason.ajv ? new BadRequest(item.reason.message, item.reason.errors) : item.reason)
      }
    })
    // Filter errors/valid data
    const errors = items.filter(item => item.validationError).map(item => item.validationError)
    items = items.filter(item => !item.validationError).map(item => item.value)
    debug(`Validation performed: found ${items.length} valid item(s), found ${errors.length} invalid item(s)`)

    // Raise if no valid data is found
    const hasValidData = (items.length > 0)
    const hasError = (errors.length > 0)
    if (hasError) {
      const firstError = errors[0]
      // Single item case => raise the error
      if (!isArray) throw firstError
      // Multiple items case => raise if no valid data found
      else if (!hasValidData) {
        // Keep track of all errors
        throw new BadRequest(firstError.message, errors)
      }
    }
    replaceItems(hook, isArray ? items : items[0])
    return hook
  }
}
