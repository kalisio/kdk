import path, { dirname } from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import chai from 'chai'
import chailint from 'chai-lint'
import { Blob } from 'buffer'
import core, { kdk, hooks } from '../../../core/api/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { util, expect } = chai

describe('core:storage', () => {
  let app, server, port, baseUrl, userService, userObject, storageService, storageObject, jwt
  const content = Buffer.from('some buffered data')
  const type = 'text/plain'
  const id = 'buffer.txt'
  const file = 'logo.png'
  const fileType = 'image/png'
  const filePath = path.join(__dirname, 'data', file)
  const fileContent = fs.readFileSync(filePath)
  const blob = new Blob([fileContent], { type: fileType })

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
  // Let enough time to process
    .timeout(5000)

  it('creates and authenticate a user', async () => {
    userObject = await userService.create({ email: 'test@test.org', password: 'Pass;word1', name: 'test-user' })
    const response = await request
      .post(`${baseUrl}/authentication`)
      .send({ email: 'test@test.org', password: 'Pass;word1', strategy: 'local' })
    expect(response.body.accessToken).toExist()
    jwt = response.body.accessToken
  })
  // Let enough time to process
    .timeout(5000)

  it('creates an object in storage', async () => {
    return storageService.putObject({ id, buffer: content, type }).then(object => {
      storageObject = object
      expect(storageObject._id).to.equal(`${id}`)
    })
  })
  // Let enough time to process
    .timeout(10000)

  it('gets an object from storage', () => {
    return storageService.get(id)
      .then(object => {
        storageObject = object
        expect(storageService.atob(storageObject.buffer).toString()).to.equal(content.toString())
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('gets an object from storage with middleware', async () => {
    const response = await request
      .get(`${baseUrl}/storage-objects/${id}`)
      .query({ jwt })
    expect(response.text).to.equal(content.toString())
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

  it('uploads a file in storage', async () => {
    const { UploadId } = await storageService.createMultipartUpload({ id: file, type: fileType })
    // A single part will be sufficient
    const { ETag } = await storageService.uploadPart({
      id: file,
      buffer: await blob.slice(0, 1024 * 1024 * 5).arrayBuffer(),
      type: blob.type,
      PartNumber: 1,
      UploadId
    })
    await storageService.completeMultipartUpload({ id: file, UploadId, parts: [{ PartNumber: 1, ETag }] })
  })
  // Let enough time to process
    .timeout(10000)

  it('gets a file from storage', () => {
    return storageService.get(file)
      .then(object => {
        storageObject = object
        expect(storageService.atob(storageObject.buffer).toString()).to.equal(fileContent.toString())
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('gets a file from storage with middleware', async () => {
    const response = await request
      .get(`${baseUrl}/storage-objects/${file}`)
      .query({ jwt })
    expect(response.body.toString()).to.equal(fileContent.toString())
  })
  // Let enough time to process
    .timeout(5000)

  it('removes a file from storage', (done) => {
    storageService.remove(file).then(object => {
      return storageService.get(file)
    })
      .catch(error => {
        expect(error).toExist()
        done()
      })
  })
  // Let enough time to process
    .timeout(5000)

  // Cleanup
  after(async () => {
    await userService.remove(userObject._id)
    if (server) await server.close()
    await app.db.instance.dropDatabase()
    await app.db.disconnect()
  })
})
