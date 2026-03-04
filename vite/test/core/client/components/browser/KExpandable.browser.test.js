import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import KExpandable from '../../../../../../core/client/components/KExpandable.vue'

// KExpandable has no Quasar deps and no external mocks needed — ideal for browser mode.
// render() from vitest-browser-vue wraps VTU mount() and returns:
//   { container (DOM), locator (Playwright), emitted(), rerender(), getByText(), ... }

describe('KExpandable (browser)', () => {
  it('applies collapsed class when isExpanded is false', () => {
    const screen = render(KExpandable, {
      props: { isExpanded: false, minHeight: 50, maxHeight: 200 }
    })
    const root = screen.container.firstChild
    expect(root.classList.contains('k-expandable-collapsed')).toBe(true)
    expect(root.classList.contains('k-expandable-expanded')).toBe(false)
  })

  it('applies expanded class when isExpanded is true', () => {
    const screen = render(KExpandable, {
      props: { isExpanded: true, minHeight: 50, maxHeight: 200 }
    })
    const root = screen.container.firstChild
    expect(root.classList.contains('k-expandable-expanded')).toBe(true)
    expect(root.classList.contains('k-expandable-collapsed')).toBe(false)
  })

  it('renders default slot content in the DOM', async () => {
    const screen = render(KExpandable, {
      props: { isExpanded: true, minHeight: 50, maxHeight: 200 },
      slots: { default: '<p class="inner">Content</p>' }
    })
    await expect.element(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.container.querySelector('.inner')).not.toBeNull()
  })

  it('switches class when isExpanded prop changes', async () => {
    const screen = render(KExpandable, {
      props: { isExpanded: false, minHeight: 50, maxHeight: 200 }
    })
    expect(screen.container.firstChild.classList.contains('k-expandable-collapsed')).toBe(true)
    await screen.rerender({ isExpanded: true })
    expect(screen.container.firstChild.classList.contains('k-expandable-expanded')).toBe(true)
    expect(screen.container.firstChild.classList.contains('k-expandable-collapsed')).toBe(false)
  })
})
