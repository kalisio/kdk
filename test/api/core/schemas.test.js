import path, { dirname } from 'path'
import fs from 'fs-extra'
import chai from 'chai'
import chailint from 'chai-lint'
import { memory } from '@feathersjs/memory'
import core, { kdk, hooks, declareService } from '../../../core/api/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { util, expect } = chai

describe('core:schemas', () => {
  let app, server, service

  const schemaPath = path.join(__dirname, 'data', 'schema.json')
  const schema = fs.readJsonSync(schemaPath)
  const invalidObjects = fs.readJsonSync(path.join(__dirname, 'data', 'invalid-objects.json'))
  const validObjects = fs.readJsonSync(path.join(__dirname, 'data', 'valid-objects.json'))

  before(async () => {
    chailint(chai, util)

    app = kdk()
    // Register log hook
    app.hooks({ error: { all: hooks.log } })
    await app.db.connect()
    await app.db.instance.dropDatabase()
  })

  it('registers the services', async () => {
    await app.configure(core)
    // Create default service to store data
    service = declareService('service', app, memory({ multi: true, operators: ['$exists'] }))
    service.hooks({
      before: {
        create: (hook) => hooks.validateData(schema)(hook)
      }
    })
  })
  // Let enough time to process
    .timeout(10000)

  it('feed invalid objects', async () => {
    for (let i = 0; i < invalidObjects.length; i++) {
      const object = invalidObjects[i]
      try {
        await service.create(object)
      } catch (error) {
        expect(error).toExist()
        console.log(error.data)
        expect(error.name).to.equal('BadRequest')
      }
    }
    const result = await service.find({ query: {}, paginate: false })
    expect(result.length === 0).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('feed valid objects', async () => {
    try {
      await service.create(validObjects)
    } catch (error) {
      // Log any error to help debug tests
      // console.log(error.data)
      // Should not be possible
      expect(error).beUndefined()
    }
    const result = await service.find({ query: {}, paginate: false })
    expect(result.length === 2).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  // Cleanup
  after(async () => {
    if (server) await server.close()
    await app.db.instance.dropDatabase()
    await app.db.disconnect()
  })
})
