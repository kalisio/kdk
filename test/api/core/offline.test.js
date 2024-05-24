import chai from 'chai'
import chailint from 'chai-lint'
import feathers from '@feathersjs/feathers'
import { memory } from '@feathersjs/memory'
import { makeServiceSnapshot } from '../../../core/common/index.js'
const { util, expect } = chai

describe('core:offline', () => {
  let app

  before(async () => {
    chailint(chai, util)
    app = feathers()
  })

  it('makes a snapshot of a service', async () => {
    const service = memory({
      store: {
        0: { name: 'xxx' },
        1: { name: 'yyy' },
        2: { name: 'zzz' }
      },
      paginate: { default: 1, max: 2 }
    })
    app.use('service', service)
    // First without offline service, simply get items
    let items = await makeServiceSnapshot(app.service('service'), { baseQuery: { $limit: 2 } })
    expect(items.length).to.equal(3)
    // Then with offline service
    const offlineService = memory({
      multi: true
    })
    app.use('offlineService', offlineService)
    await makeServiceSnapshot(app.service('service'), { baseQuery: { $limit: 2 }, offlineService: app.service('offlineService') })
    items = await offlineService.find({})
    expect(items.length).to.equal(3)
    // Last by adding a hook to change the result data path
    app.service('service').hooks({
      after: {
        find: (hook) => {
          hook.result.items = hook.result.data
          delete hook.result.data
        }
      }
    })
    await makeServiceSnapshot(app.service('service'), { baseQuery: { $limit: 2 }, offlineService: app.service('offlineService'), dataPath: 'items' })
    items = await offlineService.find({})
    expect(items.length).to.equal(3)
  })

  // Cleanup
  after(async () => {

  })
})
