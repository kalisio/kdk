import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import KStamp from '../../../../../../core/client/components/KStamp.vue'

// KStamp uses Quasar (QIcon) and $tie (i18n) — both mocked via global.mocks.
// $q.screen is injected to control responsive class behavior.
const baseMocks = { $tie: (str) => str, $t: (str) => str }

describe('KStamp (browser)', () => {
  it('renders icon when icon prop is provided', () => {
    const screen = render(KStamp, {
      props: { icon: 'home', text: 'Home' },
      global: { mocks: baseMocks }
    })
    expect(screen.container.querySelector('.q-icon')).not.toBeNull()
  })

  it('does not render icon when icon prop is absent', () => {
    const screen = render(KStamp, {
      props: { text: 'Text only' },
      global: { mocks: baseMocks }
    })
    expect(screen.container.querySelector('.q-icon')).toBeNull()
  })

  it('renders the provided text', async () => {
    const screen = render(KStamp, {
      props: { text: 'My text' },
      global: { mocks: baseMocks }
    })
    await expect.element(screen.getByText('My text')).toBeInTheDocument()
  })

  it('applies vertical layout by default', () => {
    const screen = render(KStamp, {
      props: { text: 'Test' },
      global: { mocks: baseMocks }
    })
    expect(screen.container.querySelector('.column')).not.toBeNull()
  })

  it('applies horizontal layout when direction is horizontal', () => {
    const screen = render(KStamp, {
      props: { text: 'Test', direction: 'horizontal' },
      global: { mocks: baseMocks }
    })
    expect(screen.container.querySelector('.row')).not.toBeNull()
  })

  it('applies small padding classes on small screens (lt.sm)', () => {
    const screen = render(KStamp, {
      props: { text: 'Test' },
      global: { mocks: { ...baseMocks, $q: { screen: { lt: { sm: true }, gt: { xs: false } } } } }
    })
    expect(screen.container.querySelector('.q-pl-xs')).not.toBeNull()
    expect(screen.container.querySelector('.q-pl-sm')).toBeNull()
  })

  it('applies large padding classes on large screens (gt.xs)', () => {
    const screen = render(KStamp, {
      props: { text: 'Test' },
      global: { mocks: { ...baseMocks, $q: { screen: { lt: { sm: false }, gt: { xs: true } } } } }
    })
    expect(screen.container.querySelector('.q-pl-sm')).not.toBeNull()
    expect(screen.container.querySelector('.q-pl-xs')).toBeNull()
  })
})
