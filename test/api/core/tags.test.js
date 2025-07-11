import chai from 'chai'
import chailint from 'chai-lint'
import core, { kdk, hooks } from '../../../core/api/index.js'

const { util, expect } = chai

describe('core:tags', () => {
  let app, server, port, usersService, tagsService

  before(async () => {
    chailint(chai, util)

    app = kdk()
    // Register log hook
    app.hooks({ error: { all: hooks.log } })
    port = app.get('port')
    await app.db.connect()
  })

  it('registers the services', async () => {
    await app.configure(core)
    usersService = app.getService('users')
    expect(usersService).toExist()
    tagsService = app.getService('tags')
    expect(tagsService).toExist()
    server = await app.listen(port)
    await new Promise(resolve => server.once('listening', () => resolve()))
  })
  // Let enough time to process
    .timeout(10000)

  it('create tag', async () => {
    const style = await tagsService.create({ service: 'styles', property: 'tags', value: 'emissary', description: 'My description', color: '#F05F40' })
    const response = await tagsService.find({ query: { value: 'emissary' } })
    expect(response.data.length > 0).beTrue()
    expect(response.data[0]._id.toString()).to.equal(style._id.toString())
  })
    .timeout(10000)

  it('update tag', async () => {
    const tag = await tagsService.find({ query: { value: 'emissary' } })
    expect(tag.data.length > 0).beTrue()
    const updatedTag = await tagsService.patch(tag.data[0]._id, { color: '#FF0000' })
    expect(updatedTag.color).to.equal('#FF0000')
  })
    .timeout(10000)

  it('delete tag', async () => {
    const tag = await tagsService.find({ query: { value: 'emissary' } })
    expect(tag.data.length > 0).beTrue()
    const deletedTag = await tagsService.remove(tag.data[0]._id)
    expect(deletedTag._id.toString()).to.equal(tag.data[0]._id.toString())
  })
    .timeout(10000)

  // Cleanup
  after(async () => {
    if (server) await server.close()
    await app.db.instance.dropDatabase()
    await app.db.disconnect()
  })
})
