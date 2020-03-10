/*
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { kalisio, hooks } from '@kalisio/kdk-core'
// import map from '../src'
import distribution from '@kalisio/feathers-distributed'

describe('kMap:daptiles', () => {
    let app, server, port, baseUrl, daptilesService

    before(() => {
        chailint(chai, util)
        app = kalisio()
        // Distribute services
        //app.configure(distribution(app.get('distribution').app))
        // Register log hook
        app.hooks({ error: { all: hooks.log } })
        port = app.get('port')
        baseUrl = `http://localhost:${port}${app.get('apiPath')}`
        return app.db.connect()
    })

    it('registers the daptiles service', (done) => {
        app.configure(core)
        // app.configure(map)
        daptilesService = app.getService('daptiles')
        expect(daptilesService).toExist()

        // Now app is configured launch the server
        server = app.listen(port)
        server.once('listening', _ => done())
    })

    // Cleanup
    after(async () => {
        if (server) await server.close()
        // daptileService.removeAllListeners()
        // await daptileService.Model.drop()
  })
})
*/
