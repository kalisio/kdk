import chai from 'chai'
import chailint from 'chai-lint'
import core, { kdk, hooks } from '../../../core/api/index.js'
// We now rely on mailer stub which is faster
// Integration testing with real email account shouuld be restricted to apps

const { util, expect } = chai

describe('core:exporter', () => {
  let app, server, port, userService, exporterService

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
    // Ensure the user service exist
    userService = app.getService('users')
    expect(userService).toExist()
    // Ensure the expoter service exist
    exporterService = app.getService('exporter')
    expect(exporterService).toExist()
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
        name: `user${i}`
      })
    }
    return userService._create(users, { noVerificationEmail: true })
  })
  // Let enough time to process
    .timeout(50000)

  it('export users collection in json', async () => {
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

  // Cleanup
  after(async () => {
    if (server) await server.close()
    await app.db.instance.dropDatabase()
    await app.db.disconnect()
  })
})
