import _ from 'lodash'
import moment from 'moment'
import makeDebug from 'debug'
import mongodb from 'mongodb'
import errors from '@feathersjs/errors'

const { MongoClient, ObjectID } = mongodb
const debug = makeDebug('kdk:core:db')

// This ensure moment objects are correctly serialized in MongoDB
Object.getPrototypeOf(moment()).toBSON = function () {
  return this.toDate()
}

export function isObjectID (id) {
  return id && (typeof id.toHexString === 'function') && (typeof id.getTimestamp === 'function')
}

export function idToString (id) {
  return (typeof id === 'object'
    ? (ObjectID.isValid(id)
        ? id.toString()
        : idToString(id._id))
    : id)
}

export function createObjectID (id) {
  // This ensure it works even if id is already an ObjectID
  if (isObjectID(id)) return id
  // Take care that numbers could be a valid object ID
  else if ((typeof id === 'number') || !ObjectID.isValid(id)) return null
  else {
    const objectId = new ObjectID(id)
    // It appears that ObjectID.isValid is not reliable in some driver versions, see eg https://jira.mongodb.org/browse/NODE-3760
    // So that we use an additional check here
    return (objectId.toString() === id ? objectId : null)
  }
}

// Utility function used to convert from string to MongoDB IDs as required eg by queries
// It only processes _id properties or operators (eg $ne, $in) to be converted
// If you have others properties to be converted use toObjectIDs
export function objectifyIDs (object) {
  // Avoid destructuring already transformed Date, ObjectID or arrays
  if (_.isPlainObject(object)) {
    _.forOwn(object, (value, key) => {
      // Process current attributes or recurse
      // Take care to nested fields like 'field._id'
      if (key === '_id' || key.endsWith('._id') || key === '$ne') {
        if (typeof value === 'string') {
          const id = createObjectID(value)
          if (id) {
            object[key] = id
          }
          debug('Objectify ID ' + key, id)
        } else if (Array.isArray(value)) {
          debug('Objectify ID array ' + key)
          object[key] = value.map(id => createObjectID(id)).filter(id => id)
        } else objectifyIDs(value)
      } else if (['$in', '$nin'].includes(key)) {
        debug('Objectify ID array ' + key)
        const ids = value.map(id => createObjectID(id)).filter(id => id)
        // Take care that $in/$nin can be used for others types than Object IDs so conversion might fail
        if (ids.length > 0) object[key] = ids
      } else if ((key === '$or') || (key === '$and')) {
        value.forEach(entry => objectifyIDs(entry))
      } else {
        if (!Array.isArray(value)) objectifyIDs(value)
        else value.forEach(entry => objectifyIDs(entry))
      }
    })
  }
  return object
}

// Utility function used to convert a fixed set of properties on a given object from string to MongoDB IDs
export function toObjectIDs (object, properties) {
  properties.forEach(property => {
    const value = _.get(object, property)
    if (Array.isArray(value)) {
      const ids = value.map(id => createObjectID(id)).filter(id => id)
      if (ids.length > 0) _.set(object, property, ids)
    } else {
      const id = createObjectID(value)
      if (id) _.set(object, property, id)
    }
  })
}

export class Database {
  constructor (app) {
    try {
      this.app = app
      this._adapter = app.get('db').adapter
    } catch (error) {
      throw new errors.GeneralError('Cannot find database adapter configuration in application')
    }
    this._collections = new Map()
  }

  get adapter () {
    return this._adapter
  }

  async connect () {
    // Default implementation
    return null
  }

  async disconnect () {
    // Default implementation
  }

  async healthcheck () {
    // Default implementation
    return false
  }

  static create (app) {
    switch (this.adapter) {
      case 'mongodb':
      default:
        return new MongoDatabase(app)
    }
  }
}

export class MongoDatabase extends Database {
  constructor (app) {
    super(app)
    try {
      // Primary DB
      this._dbUrl = app.get('db').url
      // Secondaries if any
      this._secondaries = app.get('db').secondaries || {}
    } catch (error) {
      throw new errors.GeneralError('Cannot find database connection settings in application')
    }
  }

  connectionDb (url) {
    // Extract database name from url. Need to remove the connections options if any
    let dbName
    const indexOfDBName = url.lastIndexOf('/') + 1
    const indexOfOptions = url.indexOf('?')
    if (indexOfOptions === -1) dbName = url.substring(indexOfDBName)
    else dbName = url.substring(indexOfDBName, indexOfOptions)

    return dbName
  }

  async connect () {
    try {
      // Connect to primary
      this._client = await MongoClient.connect(this._dbUrl)
      this._db = await this._client.db(this.connectionDb(this._dbUrl))
      debug('Connected to primary DB ' + this.adapter)
      // Then secondaries if any
      this._clients = {}
      this._dbs = {}
      if (this._secondaries) {
        const dbNames = _.keys(this._secondaries)
        for (let i = 0; i < dbNames.length; i++) {
          const dbName = dbNames[i]
          const dbUrl = this._secondaries[dbName]
          this._clients[dbName] = await MongoClient.connect(dbUrl)
          this._dbs[dbName] = await this._clients[dbName].db(this.connectionDb(dbUrl))
        }
        if (dbNames.length > 0) debug('Connected to secondaries DB ' + this.adapter)
      }
      return this._db
    } catch (error) {
      this.app.logger.error('Could not connect to ' + this.adapter + ' database(s), please check your configuration', error)
      throw error
    }
  }

  async disconnect () {
    try {
      await this._client.close()
      debug('Disconnected from primary DB ' + this.adapter)
      this._client = null
      this._db = null
      if (this._secondaries) {
        const dbNames = _.keys(this._secondaries)
        const clients = _.values(this._clients)
        for (let i = 0; i < clients.length; i++) {
          await clients[i].close()
        }
        this._clients = {}
        this._dbs = {}
        if (dbNames.length > 0) debug('Disconnected from secondaries DB ' + this.adapter)
      }
    } catch (error) {
      this.app.logger.error('Could not disconnect from ' + this.adapter + ' database(s)', error)
      throw error
    }
  }

  async healthcheck () {
    try {
      await this.instance.admin().ping()
      if (this._secondaries) {
        const dbNames = _.keys(this._secondaries)
        for (let i = 0; i < dbNames.length; i++) {
          const dbName = dbNames[i]
          await this._dbs[dbName].admin().ping()
        }
      }
      return true
    } catch (error) {
      this.app.logger.error('Healthcheck from ' + this.adapter + ' database(s) failed', error)
      return false
    }
  }

  get client () {
    return this._client
  }

  get instance () {
    return this._db
  }

  db (dbName) {
    return (dbName ? this._dbs[dbName] : this._db)
  }

  collection (name, dbName) {
    if (!this._collections.has(name)) {
      // Get collection from secondary or primary DB
      this._collections.set(name, this.db(dbName).collection(name))
    }
    return this._collections.get(name)
  }
}
