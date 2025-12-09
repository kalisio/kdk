import { ref } from 'vue'
import { feathers } from '@feathersjs/feathers'
import { rx } from 'feathers-reactive'
import { memory } from '@feathersjs/memory'
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { kdkCore, kdkMap } from '../../../client/kdk.client.map.js'

describe('core:composables', () => {
  let client
  const nbItemsPerPage = ref(2)
  const baseQuery = ref({ $sort: { _id: 1 } })
  const filterQuery = ref({})
  const getService = ref(() => client.service('/messages'))

  beforeAll(() => {
    client = feathers()
      .configure(rx({ idField: '_id' }))
    const service = memory({
      id: '_id',
      store: {
        0: { _id: 1, name: 'xxx' },
        1: { _id: 2, name: 'yyy' },
        2: { _id: 3, name: 'zzz' }
      },
      paginate: { default: 5, max: 5 }
    })
    client.use('/messages', service).hooks({
      before: {
        // Required as some options like $locale are only supported by server-side services
        all: [kdkCore.hooks.removeServerSideParameters]
      }
    })
  })

  it('refresh collection in paginated mode', async () => {
    const { items, currentPage, refreshCollection } = kdkCore.composables.useCollection({
      nbItemsPerPage, baseQuery, filterQuery, getService
    })
    refreshCollection()
    await vi.waitFor(() => {
      expect(items.value).to.deep.equal([{ _id: 1, name: 'xxx' }, { _id: 2, name: 'yyy' }])
    })
    currentPage.value++
    refreshCollection()
    await vi.waitFor(() => {
      expect(items.value).to.deep.equal([{ _id: 3, name: 'zzz' }])
    })
    filterQuery.value = { name: 'yyy' }
    await vi.waitFor(() => {
      expect(items.value).to.deep.equal([{ _id: 2, name: 'yyy' }])
    })
  })

  it('refresh collection in append mode', async () => {
    // Reset any filter
    filterQuery.value = {}
    const { items, currentPage, refreshCollection } = kdkCore.composables.useCollection({
      nbItemsPerPage, baseQuery, filterQuery, getService, appendItems: ref(true)
    })
    refreshCollection()
    await vi.waitFor(() => {
      expect(items.value).to.deep.equal([{ _id: 1, name: 'xxx' }, { _id: 2, name: 'yyy' }])
    })
    currentPage.value++
    refreshCollection()
    await vi.waitFor(() => {
      expect(items.value).to.deep.equal([{ _id: 1, name: 'xxx' }, { _id: 2, name: 'yyy' }, { _id: 3, name: 'zzz' }])
    })
    filterQuery.value = { name: 'yyy' }
    await vi.waitFor(() => {
      expect(items.value).to.deep.equal([{ _id: 2, name: 'yyy' }])
    })
  })

  afterAll(() => {})
})
