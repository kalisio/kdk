import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import KForm from '../../../../../../core/client/components/form/KForm.vue'

// Mock i18n used by the baseField mixin (in KDatetimeField)
vi.mock('../../../../../../core/client/i18n.js', () => ({
  i18n: { tie: (str) => str, t: (str) => str }
}))

// Mock Time to avoid Store/config initialization (used by KDatetimeField → KDateTime)
vi.mock('../../../../../../core/client/time.js', () => ({
  Time: {
    initialize: vi.fn(),
    convertToLocal: vi.fn(() => null)
  }
}))

// Mock utils/index.js to provide a synchronous loadComponent stub.
// A direct dynamic import inside the factory would create a circular dependency:
// factory → KDatetimeField → mixins → mixin.base-item.js → utils/index.js.
// Instead, we define an inline stub component using only Vue primitives.
vi.mock('../../../../../../core/client/utils/index.js', async () => {
  const { defineComponent, ref, markRaw } = await import('vue')

  // Minimal field component that satisfies KForm's field reference contract
  const FieldStub = markRaw(defineComponent({
    name: 'KDatetimeField',
    props: {
      properties: { type: Object, required: true },
      readOnly: { type: Boolean, default: false },
      values: { type: Object, default: null }
    },
    setup (props) {
      const model = ref(new Date().toISOString())
      return {
        value: () => model.value,
        fill: (v) => { model.value = v },
        clear: () => { model.value = new Date().toISOString() },
        validate: () => {},
        invalidate: () => {},
        isEmpty: () => false
      }
    },
    template: '<div class="field-stub"></div>'
  }))

  return {
    loadComponent: (_name) => FieldStub,
    // Stub barrel exports used by other mixins in the import chain
    createQuerablePromise: () => Promise.resolve(),
    loadSchema: vi.fn(),
    bindContent: () => ({}),
    filterContent: () => ({})
  }
})

// Schema with a single KDatetimeField property (passed as object to avoid @schemas/ alias)
const dateSchema = {
  $id: 'test-kdatetimefield-form',
  type: 'object',
  properties: {
    date: {
      type: 'string',
      description: 'Date',
      field: { component: 'form/KDatetimeField' }
    }
  }
}

describe('KForm (integration)', () => {
  it('emits form-ready after mounting with a valid schema', async () => {
    const wrapper = mount(KForm, {
      props: { schema: dateSchema },
      global: {
        // Stub portal components that do not work correctly in jsdom
        stubs: { QPopupProxy: true, QDate: true, QTime: true }
      }
    })
    await flushPromises()
    expect(wrapper.emitted('form-ready')).toBeTruthy()
  })

  it('renders the KDatetimeField inside the form', async () => {
    const wrapper = mount(KForm, {
      props: { schema: dateSchema },
      global: { stubs: { QPopupProxy: true, QDate: true, QTime: true } }
    })
    await flushPromises()
    // The form should contain a QForm and the rendered field stub
    expect(wrapper.findComponent({ name: 'QForm' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'KDatetimeField' }).exists()).toBe(true)
  })

  it('isReady is true after form-ready is emitted', async () => {
    const wrapper = mount(KForm, {
      props: { schema: dateSchema },
      global: { stubs: { QPopupProxy: true, QDate: true, QTime: true } }
    })
    await flushPromises()
    expect(wrapper.vm.isReady).toBe(true)
  })

  it('validate() returns isValid true when field has a value', async () => {
    const wrapper = mount(KForm, {
      props: { schema: dateSchema },
      global: { stubs: { QPopupProxy: true, QDate: true, QTime: true } }
    })
    await flushPromises()
    // The FieldStub exposes isEmpty() = false, so value is considered present
    const { isValid } = wrapper.vm.validate()
    expect(isValid).toBe(true)
  })

  it('values() returns an object with the date field', async () => {
    const wrapper = mount(KForm, {
      props: { schema: dateSchema },
      global: { stubs: { QPopupProxy: true, QDate: true, QTime: true } }
    })
    await flushPromises()
    const values = wrapper.vm.values()
    expect(values).toHaveProperty('date')
  })

  it('fill() populates the form with provided values', async () => {
    const isoDate = '2024-06-15T10:30:00.000Z'
    const wrapper = mount(KForm, {
      props: { schema: dateSchema },
      global: { stubs: { QPopupProxy: true, QDate: true, QTime: true } }
    })
    await flushPromises()
    wrapper.vm.fill({ date: isoDate })
    const values = wrapper.vm.values()
    expect(values.date).toBe(isoDate)
  })
})
