import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KStamp from '../../../../../core/client/components/KStamp.vue'

describe('KStamp', () => {
  it('renders icon when icon prop is provided', () => {
    const wrapper = mount(KStamp, {
      props: { icon: 'home', text: 'Home' }
    })
    expect(wrapper.findComponent({ name: 'QIcon' }).exists()).toBe(true)
  })

  it('does not render icon when icon prop is absent', () => {
    const wrapper = mount(KStamp, {
      props: { text: 'Text only' }
    })
    expect(wrapper.findComponent({ name: 'QIcon' }).exists()).toBe(false)
  })

  it('renders the provided text', () => {
    const wrapper = mount(KStamp, {
      props: { text: 'My text' }
    })
    expect(wrapper.text()).toContain('My text')
  })

  it('applies vertical layout by default', () => {
    const wrapper = mount(KStamp, {
      props: { text: 'Test' }
    })
    expect(wrapper.find('.column').exists()).toBe(true)
  })

  it('applies horizontal layout when direction is horizontal', () => {
    const wrapper = mount(KStamp, {
      props: { text: 'Test', direction: 'horizontal' }
    })
    expect(wrapper.find('.row').exists()).toBe(true)
  })

  it('applies small padding classes on small screens (lt.sm)', () => {
    const wrapper = mount(KStamp, {
      props: { text: 'Test' },
      global: { mocks: { $q: { screen: { lt: { sm: true }, gt: { xs: false } } } } }
    })
    expect(wrapper.find('.q-pl-xs').exists()).toBe(true)
    expect(wrapper.find('.q-pl-sm').exists()).toBe(false)
  })

  it('applies large padding classes on large screens (gt.xs)', () => {
    const wrapper = mount(KStamp, {
      props: { text: 'Test' },
      global: { mocks: { $q: { screen: { lt: { sm: false }, gt: { xs: true } } } } }
    })
    expect(wrapper.find('.q-pl-sm').exists()).toBe(true)
    expect(wrapper.find('.q-pl-xs').exists()).toBe(false)
  })
})
