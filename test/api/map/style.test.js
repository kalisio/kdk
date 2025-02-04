import chai from 'chai'
import chailint from 'chai-lint'
import core, { kdk } from '../../../core/api/index.js'
import map, { hooks } from '../../../map/api/index.js'

const { util, expect } = chai

describe('map:styles', () => {
  let app, server, stylesService

  before(async () => {
    chailint(chai, util)

    app = kdk()
    // Register log hook
    app.hooks({ error: { all: hooks.log } })
    await app.db.connect()
    await app.db.instance.dropDatabase()
  })

  it('is ES module compatible', () => {
    expect(typeof core).to.equal('function')
  })

  it('registers the services', async () => {
    await app.configure(map)
    stylesService = app.getService('styles')
    expect(stylesService).toExist()
  })
  // Let enough time to process
    .timeout(10000)


  it('create / read styles', async () => {
    const createdStyle = await stylesService.create({ name: 'test-style-1' })
    const foundedStyle = await stylesService.find({ query: { '_id': createdStyle._id } })
    expect(foundedStyle.data.length > 0).beTrue()
  })

  // Cleanup
  after(async () => {
    if (server) await server.close()
    await app.db.instance.dropDatabase()
    await app.db.disconnect()
  })
})
