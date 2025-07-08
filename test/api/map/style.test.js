import chai from 'chai'
import chailint from 'chai-lint'
import core, { kdk } from '../../../core/api/index.js'
import map, { hooks } from '../../../map/api/index.js'

const { util, expect } = chai

describe('map:styles', () => {
  let app, server, port, usersService, stylesService, tagsService

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
    await app.configure(map)
    stylesService = app.getService('styles')
    expect(stylesService).toExist()
    server = await app.listen(port)
    await new Promise(resolve => server.once('listening', () => resolve()))
  })
  // Let enough time to process
    .timeout(10000)

  it('create style', async () => {
    const style = await stylesService.create({ name: 'style' })
    const response = await stylesService.find({ query: { name: 'style' } })
    expect(response.data.length > 0).beTrue()
    expect(response.data[0]._id.toString()).to.equal(style._id.toString())
  })
    .timeout(10000)

  it('ensure style name uniqueness', async () => {
    // Can't create name
    let doublonStyle
    try {
      doublonStyle = await stylesService.create({ name: 'style' })
    } catch (error) {
      expect(error).toExist()
      // expect(error.name).to.equal('Conflict')
      // expect(error.data.translation.key).to.equal('OBJECT_ID_ALREADY_TAKEN')
    }
    expect(doublonStyle).beUndefined()
  })
    .timeout(10000)

  it('create and update tag', async () => {
    const tag = await tagsService.create({ service: 'styles', property: 'tags', value: 'emissary', description: 'My description', color: '#F05F40' })
    const style = await stylesService.create({ name: 'style2', tags: [{ value: 'emissary', description: 'My description', color: '#F05F40' }] })
    const response = await stylesService.find({ query: { name: 'style2' } })
    expect(response.data.length > 0).beTrue()
    expect(response.data[0]._id.toString()).to.equal(style._id.toString())
    expect(response.data[0].tags.length).to.equal(1)
    expect(response.data[0].tags[0].value).to.equal('emissary')

    // Update tag
    const updatedTag = await tagsService.patch(tag._id, { color: '#FF0000' })
    expect(updatedTag.color).to.equal('#FF0000')
    const updatedStyle = await stylesService.get(style._id)
    expect(updatedStyle.tags.length).to.equal(1)
    expect(updatedStyle.tags[0].color).to.equal('#FF0000')
  })

  it('delete tag', async () => {
    const tag = await tagsService.find({ query: { value: 'emissary' } })
    expect(tag.data.length > 0).beTrue()
    const deletedTag = await tagsService.remove(tag.data[0]._id)
    expect(deletedTag._id.toString()).to.equal(tag.data[0]._id.toString())
    const style = await stylesService.find({ query: { name: 'style2' } })
    expect(style.data.length > 0).beTrue()
    expect(style.data[0].tags.length).to.equal(0)
  })

  // Cleanup
  after(async () => {
    if (server) await server.close()
    await app.db.instance.dropDatabase()
    await app.db.disconnect()
  })
})
