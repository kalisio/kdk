import path, { dirname } from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import dauria from 'dauria'
import request from 'superagent'
import chai from 'chai'
import chailint from 'chai-lint'
import core, { kdk, hooks } from '../../../core/api/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { getBase64DataURI } = dauria
const { util, expect } = chai

describe('core:storage', () => {
  let app, server, port, baseUrl, userService, userObject, storageService, storageObject
  const content = Buffer.from('some buffered data')
  const contentType = 'text/plain'
  const contentUri = getBase64DataURI(content, contentType)
  const id = 'buffer.txt'
  const file = 'logo.png'

  before(async () => {
    chailint(chai, util)
    app = kdk()
    // Register log hook
    app.hooks({ error: { all: hooks.log } })
    port = app.get('port')
    baseUrl = `http://localhost:${port}${app.get('apiPath')}`
    await app.db.connect()
    await app.db.instance.dropDatabase()
  })

  it('registers the storage service', async () => {
    await app.configure(core)
    userService = app.getService('users')
    expect(userService).toExist()
    storageService = app.getService('storage')
    expect(storageService).toExist()
    // Now app is configured launch the server
    server = await app.listen(port)
    await new Promise(resolve => server.once('listening', () => resolve()))
  })

  it('creates an object in storage', () => {
    return storageService.create({ id, uri: contentUri }).then(object => {
      storageObject = object
      expect(storageObject._id).to.equal(`${id}`)
      expect(storageObject.size).to.equal(content.length)
    })
  })
  // Let enough time to process
    .timeout(10000)

  it('gets an object from storage', () => {
    return storageService.get(id)
      .then(object => {
        storageObject = object
        expect(storageObject.uri).to.equal(contentUri)
        expect(storageObject.size).to.equal(content.length)
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('removes an object from storage', (done) => {
    storageService.remove(id).then(object => {
      return storageService.get(id)
    })
      .catch(error => {
        expect(error).toExist()
        done()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('creates an object in storage using multipart form data', () => {
    const filePath = path.join(__dirname, 'data', file)
    return request
      .post(`${baseUrl}/storage`)
      .field('id', file)
      .attach('file', filePath)
      .then(response => {
        storageObject = response.body
        expect(storageObject._id).to.equal(`${file}`)
        expect(storageObject.size).to.equal(fs.statSync(filePath).size)
        return storageService.remove(file)
      })
  })
  // Let enough time to process
    .timeout(10000)

  it('creates an attachment on a resource', () => {
    return userService.create({ email: 'test@test.org', password: 'Pass;word1', name: 'test-user' })
      .then(user => {
        userObject = user
        return storageService.create({ id, uri: contentUri, resource: userObject._id.toString(), resourcesService: 'users' })
      })
      .then(object => {
        storageObject = object
        expect(storageObject._id).to.equal(`${id}`)
        expect(storageObject.size).to.equal(content.length)
        return userService.find({ query: { 'profile.name': 'test-user' } })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
        userObject = users.data[0]
        expect(userObject.attachments).toExist()
        expect(userObject.attachments.length > 0).beTrue()
        expect(userObject.attachments[0]._id).to.equal(storageObject._id)
      })
  })
  // Let enough time to process
    .timeout(10000)

  it('removes an attachment from a resource', () => {
    return storageService.remove(id, { query: { resource: userObject._id.toString(), resourcesService: 'users' } })
      .then(object => {
        storageObject = object
        expect(storageObject._id).to.equal(`${id}`)
        return userService.find({ query: { 'profile.name': 'test-user' } })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
        userObject = users.data[0]
        expect(userObject.attachments).toExist()
        expect(userObject.attachments.length === 0).beTrue()
        return userService.remove(userObject._id)
      })
  })
  // Let enough time to process
    .timeout(10000)

  // Cleanup
  after(async () => {
    if (server) await server.close()
    await app.db.instance.dropDatabase()
    await app.db.disconnect()
  })
})
