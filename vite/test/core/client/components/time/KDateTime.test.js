import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import KDateTime from '../../../../../../core/client/components/time/KDateTime.vue'

// Mock the Time singleton to avoid Store/config/moment-timezone initialization
vi.mock('../../../../../../core/client/time.js', () => ({
  Time: {
    initialize: vi.fn(),
    convertToLocal: vi.fn((iso) => iso ? { format: (mask) => iso.substring(0, mask.length) } : null)
  }
}))

// Mock i18n used by KDate and KTime child components
vi.mock('../../../../../../core/client/i18n.js', () => ({
  i18n: { tie: (str) => str, t: (str) => str }
}))

describe('KDateTime', () => {
  it('renders without error when modelValue is null', () => {
    const wrapper = shallowMount(KDateTime)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the separator between date and time', () => {
    const wrapper = shallowMount(KDateTime, {
      props: { separator: '|' }
    })
    expect(wrapper.text()).toContain('|')
  })

  it('does not render separator when separator prop is falsy', () => {
    const wrapper = shallowMount(KDateTime, {
      props: { separator: '' }
    })
    expect(wrapper.text()).not.toContain('-')
  })

  it('applies dense gutter class when dense prop is true', () => {
    const wrapper = shallowMount(KDateTime, {
      props: { dense: true }
    })
    expect(wrapper.classes()).toContain('q-gutter-x-xs')
  })

  it('does not apply dense gutter class by default', () => {
    const wrapper = shallowMount(KDateTime)
    expect(wrapper.classes()).not.toContain('q-gutter-x-xs')
  })

  it('renders a KDate and a KTime sub-component', () => {
    const wrapper = shallowMount(KDateTime)
    // shallowMount stubs child components — verify stubs are present
    expect(wrapper.findComponent({ name: 'KDate' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'KTime' }).exists()).toBe(true)
  })
})
