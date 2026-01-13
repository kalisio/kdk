import { ref } from 'vue'
import { feathers } from '@feathersjs/feathers'
import { rx } from 'feathers-reactive'
import { memory } from '@feathersjs/memory'
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { mountComponent } from '../utils.js'
import { kdkCore, kdkMap } from '../../../client/kdk.client.map.js'
import KGrid from '../../../core/client/components/collection/KGrid.vue'

describe('core:composables', () => {
  let client
  const nbItemsPerPage = ref(2)
  const baseQuery = ref({ $sort: { _id: 1 } })
  const filterQuery = ref({})
  const getService = ref(() => client.getService('messages'))
  
  beforeAll(async () => {
    const service = memory({
      id: '_id',
      store: {
        0: { _id: 1, name: 'xxx' },
        1: { _id: 2, name: 'yyy' },
        2: { _id: 3, name: 'zzz' }
      },
      paginate: { default: 5, max: 5 }
    })
    client = await kdkCore.initializeApi(kdkMap.setupApi)
    client.createService('messages', {
      service,
      hooks: {
        before: {
          // Required as some options like $locale are only supported by server-side services
          all: [kdkCore.hooks.removeServerSideParameters]
        }
      }
    })
  })
  // FIXME: Does not work yet due to dynamic import
  it.skip('refresh collection in paginated mode', async () => {
    const { items, currentPage, refreshCollection } = mountComponent(KGrid, {
      props: {
        getService
      }
    })
    refreshCollection()
    await vi.waitFor(() => {
      expect(items.value).to.deep.equal([{ _id: 1, name: 'xxx' }, { _id: 2, name: 'yyy' }])
    })
  })
  
  afterAll(() => {})
})
