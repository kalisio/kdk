import chai from 'chai'
import chailint from 'chai-lint'
import core, { kdk, hooks } from '../../../core/api/index.js'

const { util, expect } = chai

describe('core:import-export', () => {
  let app, server, port, usersService, storageService, importExportService

  before(async () => {
    chailint(chai, util)
    app = kdk()
    // Register log hook
    app.hooks({ error: { all: hooks.log } })
    port = app.get('port')
    await app.db.connect()
    await app.db.instance.dropDatabase()
  })

  it('registers the services', async () => {
    await app.configure(core)
    // Ensure the users service exist
    usersService = app.getService('users')
    expect(usersService).toExist()
    // Ensure the storage service exist
    storageService = app.getService('storage')
    expect(storageService).toExist()
    // Ensure the expoter service exist
    importExportService = app.getService('import-export')
    expect(importExportService).toExist()
    // Now app is configured launch the server
    server = await app.listen(port)
    await new Promise(resolve => server.once('listening', () => resolve()))
  })
  // Let enough time to process
    .timeout(10000)

  it('create a user collection', () => {
    const users = []
    for (let i = 0; i < 11; i++) {
      users.push({
        email: `kalisio${i}@kalisio.xyz`,
        password: 'Pass;word1',
        description: 'Description for kalisio$[i}',
        name: `user${i}`
      })
    }
    return usersService._create(users, { noVerificationEmail: true })
  })
  // Let enough time to process
    .timeout(50000)

  /*  it('export users collection in json', async () => {
    await exporterService.create({
      serviceName: 'users',
      batchSize: 2
    })
  })

  it('export users collection in csv', async () => {
    await exporterService.create({
      serviceName: 'users',
      batchSize: 2,
      outputFormat: 'csv'
    })
  })

  it('export users collection in zipped json', async () => {
    await exporterService.create({
      serviceName: 'users',
      batchSize: 2,
      zipOutput: true
    })
  })

  it('export users collection in zipped csv', async () => {
    await exporterService.create({
      serviceName: 'users',
      batchSize: 2,
      outputFormat: 'csv',
      zipOutput: true
    })
  })
  */

  // Cleanup
  after(async () => {
    if (server) await server.close()
    await app.db.instance.dropDatabase()
    await app.db.disconnect()
  })
})
