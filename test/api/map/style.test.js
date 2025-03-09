import chai from 'chai'
import chailint from 'chai-lint'
import core, { kdk } from '../../../core/api/index.js'
import map, { hooks } from '../../../map/api/index.js'

const { util, expect } = chai

describe('map:styles', () => {
  let app, server, port, usersService, stylesService

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

  // Cleanup
  after(async () => {
    if (server) await server.close()
    await app.db.instance.dropDatabase()
    await app.db.disconnect()
  })
})
