import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KExpandable from '../../../../../core/client/components/KExpandable.vue'

describe('KExpandable', () => {
  it('applies collapsed class when isExpanded is false', () => {
    const wrapper = mount(KExpandable, {
      props: { isExpanded: false, minHeight: 50, maxHeight: 200 }
    })
    expect(wrapper.classes()).toContain('k-expandable-collapsed')
    expect(wrapper.classes()).not.toContain('k-expandable-expanded')
  })

  it('applies expanded class when isExpanded is true', () => {
    const wrapper = mount(KExpandable, {
      props: { isExpanded: true, minHeight: 50, maxHeight: 200 }
    })
    expect(wrapper.classes()).toContain('k-expandable-expanded')
    expect(wrapper.classes()).not.toContain('k-expandable-collapsed')
  })

  it('renders default slot content', () => {
    const wrapper = mount(KExpandable, {
      props: { isExpanded: true, minHeight: 50, maxHeight: 200 },
      slots: { default: '<p class="inner">Content</p>' }
    })
    expect(wrapper.find('.inner').exists()).toBe(true)
    expect(wrapper.find('.inner').text()).toBe('Content')
  })

  it('switches class when isExpanded prop changes', async () => {
    const wrapper = mount(KExpandable, {
      props: { isExpanded: false, minHeight: 50, maxHeight: 200 }
    })
    expect(wrapper.classes()).toContain('k-expandable-collapsed')
    await wrapper.setProps({ isExpanded: true })
    expect(wrapper.classes()).toContain('k-expandable-expanded')
  })
})
