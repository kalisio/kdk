import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KExpandable from '../../../core/client/components/KExpandable.vue'
import KStamp from '../../../core/client/components/KStamp.vue'

describe('KExpandable', () => {
  it('applique la classe collapsed quand isExpanded=false', () => {
    const wrapper = mount(KExpandable, {
      props: { isExpanded: false, minHeight: 50, maxHeight: 200 }
    })
    expect(wrapper.classes()).toContain('k-expandable-collapsed')
    expect(wrapper.classes()).not.toContain('k-expandable-expanded')
  })

  it('applique la classe expanded quand isExpanded=true', () => {
    const wrapper = mount(KExpandable, {
      props: { isExpanded: true, minHeight: 50, maxHeight: 200 }
    })
    expect(wrapper.classes()).toContain('k-expandable-expanded')
    expect(wrapper.classes()).not.toContain('k-expandable-collapsed')
  })

  it('rend le contenu du slot par défaut', () => {
    const wrapper = mount(KExpandable, {
      props: { isExpanded: true, minHeight: 50, maxHeight: 200 },
      slots: { default: '<p class="inner">Contenu</p>' }
    })
    expect(wrapper.find('.inner').exists()).toBe(true)
    expect(wrapper.find('.inner').text()).toBe('Contenu')
  })

  it('change de classe quand isExpanded change', async () => {
    const wrapper = mount(KExpandable, {
      props: { isExpanded: false, minHeight: 50, maxHeight: 200 }
    })
    expect(wrapper.classes()).toContain('k-expandable-collapsed')

    await wrapper.setProps({ isExpanded: true })
    expect(wrapper.classes()).toContain('k-expandable-expanded')
  })
})

describe('KStamp', () => {
  it('affiche l\'icône quand la prop icon est fournie', () => {
    const wrapper = mount(KStamp, {
      props: { icon: 'home', text: 'Accueil' }
    })
    // QIcon est un vrai composant Quasar monté par installQuasarPlugin
    expect(wrapper.findComponent({ name: 'QIcon' }).exists()).toBe(true)
  })

  it('n\'affiche pas d\'icône quand la prop icon est absente', () => {
    const wrapper = mount(KStamp, {
      props: { text: 'Texte seul' }
    })
    expect(wrapper.findComponent({ name: 'QIcon' }).exists()).toBe(false)
  })

  it('affiche le texte fourni', () => {
    const wrapper = mount(KStamp, {
      props: { text: 'Mon texte' }
    })
    expect(wrapper.text()).toContain('Mon texte')
  })

  it('applique la direction verticale par défaut', () => {
    const wrapper = mount(KStamp, {
      props: { text: 'Test' }
    })
    expect(wrapper.find('.column').exists()).toBe(true)
  })

  it('applique la direction horizontale si spécifiée', () => {
    const wrapper = mount(KStamp, {
      props: { text: 'Test', direction: 'horizontal' }
    })
    expect(wrapper.find('.row').exists()).toBe(true)
  })
})
