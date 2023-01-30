import _ from 'lodash'
import logger from 'loglevel'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import ajvKeywords from 'ajv-keywords'

const defaultOptions = {
  allErrors: true,
  strict: false,
  $data: true,
  keywords: ['field']
}

export const Schema = {
  initialize (options) {
    logger.debug(`initializing Ajv with ${JSON.stringify(options || defaultOptions, null, 4)}`)
    this.ajv = new Ajv(options || defaultOptions)
    ajvKeywords(this.ajv)
    addFormats(this.ajv)
 },
 register (schema) {
  if (!this.ajv) throw new Error('Schema must be initialized first')
  if (!schema.$id) throw new Error('the schema must have an `$id` property')
  logger.debug(`registering schema ${schema.$id}`)
  return this.ajv.getSchema(schema.$id) || this.ajv.compile(schema)
 },
 addKeyword (keyword) {
  if (!this.ajv) throw new Error('Schema must be initialized first')
  this.ajv.addKeyword(keyword)
 },
 getKeyword (keyword) {
  if (!this.ajv) throw new Error('Schema must be initialized first')
  return this.ajv.getKeyword(keyword)
 },
 removeKeyword (keyword) {
  if (!this.ajv) throw new Error('Schema must be initialized first')
  this.ajv.removeKeyword(keyword)
 }
}