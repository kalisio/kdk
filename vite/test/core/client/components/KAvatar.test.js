import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import KAvatar from '../../../../../core/client/components/KAvatar.vue'

// Mock Storage to avoid feathers-s3 / API dependencies
vi.mock('../../../../../core/client/storage.js', () => ({
  Storage: {
    initialize: vi.fn(),
    getObjectUrl: vi.fn().mockResolvedValue('http://mocked-url/avatar.jpg')
  }
}))

describe('KAvatar', () => {
  it('renders a QAvatar with QImg when subject has avatar.uri', async () => {
    const wrapper = mount(KAvatar, {
      props: { subject: { name: 'Alice', avatar: { uri: 'http://example.com/photo.jpg' } } }
    })
    await flushPromises()
    expect(wrapper.findComponent({ name: 'QAvatar' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'QImg' }).exists()).toBe(true)
  })

  it('renders a QAvatar with icon when subject has icon field', async () => {
    const wrapper = mount(KAvatar, {
      props: { subject: { name: 'Bob', icon: { name: 'home', color: 'primary' } } }
    })
    await flushPromises()
    const avatar = wrapper.findComponent({ name: 'QAvatar' })
    expect(avatar.exists()).toBe(true)
    expect(avatar.props('icon')).toBeTruthy()
  })

  it('renders a QAvatar with initials when subject has only a name', async () => {
    const wrapper = mount(KAvatar, {
      props: { subject: { name: 'John Doe' } }
    })
    await flushPromises()
    expect(wrapper.findComponent({ name: 'QAvatar' }).exists()).toBe(true)
    expect(wrapper.text()).toContain('JD')
  })

  it('renders nothing when subject is empty', async () => {
    const wrapper = mount(KAvatar, {
      props: { subject: {} }
    })
    await flushPromises()
    expect(wrapper.findComponent({ name: 'QAvatar' }).exists()).toBe(false)
  })

  it('applies the size prop to QAvatar', async () => {
    const wrapper = mount(KAvatar, {
      props: { subject: { name: 'Alice' }, size: 'xl' }
    })
    await flushPromises()
    const avatar = wrapper.findComponent({ name: 'QAvatar' })
    expect(avatar.props('size')).toBe('xl')
  })
})
