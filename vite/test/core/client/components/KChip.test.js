import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import KChip from '../../../../../core/client/components/KChip.vue'

vi.mock('../../../../../core/client/i18n.js', () => ({
  i18n: { tie: (str) => str, t: (str) => str }
}))

vi.mock('../../../../../core/client/document.js', () => ({
  Document: { sanitizeHtml: (str) => str }
}))

vi.mock('../../../../../core/client/utils/index.js', () => ({
  getHtmlColor: (color) => color,
  getContrastColor: () => 'white'
}))

describe('KChip', () => {
  it('renders label when provided', () => {
    const wrapper = mount(KChip, { props: { label: 'Hello' } })
    expect(wrapper.text()).toContain('Hello')
  })

  it('hides label when hideLabel is true', () => {
    const wrapper = mount(KChip, { props: { label: 'Hello', hideLabel: true } })
    expect(wrapper.find('.ellipsis').exists()).toBe(false)
  })

  it('renders icon when icon prop is provided', () => {
    const wrapper = mount(KChip, { props: { label: 'Test', icon: 'home' } })
    const chip = wrapper.findComponent({ name: 'QChip' })
    expect(chip.props('icon')).toBe('home')
  })

  it('hides icon when hideIcon is true', () => {
    const wrapper = mount(KChip, { props: { label: 'Test', icon: 'home', hideIcon: true } })
    const chip = wrapper.findComponent({ name: 'QChip' })
    expect(chip.props('icon')).toBeUndefined()
  })

  // --- Breakpoint classes based on dense prop ---

  it('applies q-pl-sm (not q-pl-xs) when dense=false and icon is present', () => {
    const wrapper = mount(KChip, { props: { label: 'Test', icon: 'home', dense: false } })
    const label = wrapper.find('.ellipsis')
    expect(label.classes()).toContain('q-pl-sm')
    expect(label.classes()).not.toContain('q-pl-xs')
  })

  it('applies q-pl-xs (not q-pl-sm) when dense=true and icon is present', () => {
    const wrapper = mount(KChip, { props: { label: 'Test', icon: 'home', dense: true } })
    const label = wrapper.find('.ellipsis')
    expect(label.classes()).toContain('q-pl-xs')
    expect(label.classes()).not.toContain('q-pl-sm')
  })

  it('applies no padding class when not dense and no icon', () => {
    const wrapper = mount(KChip, { props: { label: 'Test', dense: false } })
    const label = wrapper.find('.ellipsis')
    expect(label.classes()).not.toContain('q-pl-sm')
    expect(label.classes()).not.toContain('q-pl-xs')
  })

  it('applies no padding class when dense=true and no icon', () => {
    const wrapper = mount(KChip, { props: { label: 'Test', dense: true } })
    const label = wrapper.find('.ellipsis')
    expect(label.classes()).not.toContain('q-pl-sm')
    expect(label.classes()).not.toContain('q-pl-xs')
  })

  it('switches from q-pl-sm to q-pl-xs when dense prop changes to true', async () => {
    const wrapper = mount(KChip, { props: { label: 'Test', icon: 'home', dense: false } })
    expect(wrapper.find('.ellipsis').classes()).toContain('q-pl-sm')

    await wrapper.setProps({ dense: true })
    expect(wrapper.find('.ellipsis').classes()).toContain('q-pl-xs')
    expect(wrapper.find('.ellipsis').classes()).not.toContain('q-pl-sm')
  })

  it('switches from q-pl-xs to q-pl-sm when dense prop changes to false', async () => {
    const wrapper = mount(KChip, { props: { label: 'Test', icon: 'home', dense: true } })
    expect(wrapper.find('.ellipsis').classes()).toContain('q-pl-xs')

    await wrapper.setProps({ dense: false })
    expect(wrapper.find('.ellipsis').classes()).toContain('q-pl-sm')
    expect(wrapper.find('.ellipsis').classes()).not.toContain('q-pl-xs')
  })

  // --- Events ---

  it('emits click event when clicked', async () => {
    const wrapper = mount(KChip, { props: { label: 'Test', clickable: true } })
    await wrapper.findComponent({ name: 'QChip' }).trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('emits remove event when removable chip is removed', async () => {
    const wrapper = mount(KChip, { props: { label: 'Test', removable: true } })
    wrapper.findComponent({ name: 'QChip' }).vm.$emit('remove')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('remove')).toBeTruthy()
  })
})
