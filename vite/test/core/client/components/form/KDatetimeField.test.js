import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import KDatetimeField from '../../../../../../core/client/components/form/KDatetimeField.vue'

// Mock i18n used by the baseField mixin
vi.mock('../../../../../../core/client/i18n.js', () => ({
  i18n: { tie: (str) => str, t: (str) => str }
}))

// Mock Time to avoid Store/config initialization
vi.mock('../../../../../../core/client/time.js', () => ({
  Time: {
    initialize: vi.fn(),
    convertToLocal: vi.fn(() => null)
  }
}))

const baseProperties = {
  name: 'date',
  field: { component: 'form/KDatetimeField', label: 'Date' }
}

describe('KDatetimeField', () => {
  it('renders in read-only mode as a div', () => {
    const wrapper = shallowMount(KDatetimeField, {
      props: { properties: baseProperties, readOnly: true }
    })
    // readOnly renders a plain div, not q-field
    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'QField' }).exists()).toBe(false)
  })

  it('renders in edit mode with a QField', () => {
    const wrapper = shallowMount(KDatetimeField, {
      props: { properties: baseProperties }
    })
    expect(wrapper.findComponent({ name: 'QField' }).exists()).toBe(true)
  })

  it('shows the label from properties.field.label', () => {
    const wrapper = shallowMount(KDatetimeField, {
      props: { properties: { ...baseProperties, field: { ...baseProperties.field, label: 'My Date' } } }
    })
    const field = wrapper.findComponent({ name: 'QField' })
    expect(field.props('label')).toBe('My Date')
  })

  it('is disabled when properties.field.disabled is true', () => {
    const wrapper = shallowMount(KDatetimeField, {
      props: { properties: { ...baseProperties, field: { ...baseProperties.field, disabled: true } } }
    })
    const field = wrapper.findComponent({ name: 'QField' })
    expect(field.props('disable')).toBe(true)
  })

  it('fills the model when fill() is called', async () => {
    const isoDate = '2024-06-15T10:30:00.000Z'
    const wrapper = shallowMount(KDatetimeField, {
      props: { properties: baseProperties }
    })
    await wrapper.vm.fill(isoDate)
    expect(wrapper.vm.value()).toBe(isoDate)
  })

  it('clears the model when clear() is called', async () => {
    const isoDate = '2024-06-15T10:30:00.000Z'
    const wrapper = shallowMount(KDatetimeField, {
      props: { properties: baseProperties }
    })
    await wrapper.vm.fill(isoDate)
    await wrapper.vm.clear()
    // After clear, the model is reset to emptyModel() (current ISO timestamp), not the filled value
    expect(wrapper.vm.value()).not.toBe(isoDate)
    expect(wrapper.vm.value()).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('emits field-changed when onChanged is called', async () => {
    const wrapper = shallowMount(KDatetimeField, {
      props: { properties: baseProperties }
    })
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0][0]).toBe('date')
  })
})
