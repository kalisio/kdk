import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import KChip from '../../../../../../core/client/components/KChip.vue'

vi.mock('../../../../../../core/client/i18n.js', () => ({
  i18n: { tie: (str) => str, t: (str) => str }
}))

vi.mock('../../../../../../core/client/document.js', () => ({
  Document: { sanitizeHtml: (str) => str }
}))

vi.mock('../../../../../../core/client/utils/index.js', () => ({
  getHtmlColor: (color) => color,
  getContrastColor: () => 'white'
}))

describe('KChip (browser)', () => {
  it('renders label when provided', async () => {
    const screen = render(KChip, { props: { label: 'Hello' } })
    await expect.element(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('hides label when hideLabel is true', () => {
    const screen = render(KChip, { props: { label: 'Hello', hideLabel: true } })
    expect(screen.container.querySelector('.ellipsis')).toBeNull()
  })

  it('renders icon when icon prop is provided', () => {
    const screen = render(KChip, { props: { label: 'Test', icon: 'home' } })
    // Quasar QChip renders icon inside a q-icon element
    expect(screen.container.querySelector('.q-icon')).not.toBeNull()
  })

  it('hides icon when hideIcon is true', () => {
    const screen = render(KChip, { props: { label: 'Test', icon: 'home', hideIcon: true } })
    // When hideIcon, no icon is passed to QChip — no q-icon rendered for the icon slot
    const chip = screen.container.querySelector('.q-chip')
    expect(chip.querySelector('.q-chip__icon--left')).toBeNull()
  })

  it('applies q-pl-sm (not q-pl-xs) when dense=false and icon is present', () => {
    const screen = render(KChip, { props: { label: 'Test', icon: 'home', dense: false } })
    const label = screen.container.querySelector('.ellipsis')
    expect(label.classList.contains('q-pl-sm')).toBe(true)
    expect(label.classList.contains('q-pl-xs')).toBe(false)
  })

  it('applies q-pl-xs (not q-pl-sm) when dense=true and icon is present', () => {
    const screen = render(KChip, { props: { label: 'Test', icon: 'home', dense: true } })
    const label = screen.container.querySelector('.ellipsis')
    expect(label.classList.contains('q-pl-xs')).toBe(true)
    expect(label.classList.contains('q-pl-sm')).toBe(false)
  })

  it('applies no padding class when not dense and no icon', () => {
    const screen = render(KChip, { props: { label: 'Test', dense: false } })
    const label = screen.container.querySelector('.ellipsis')
    expect(label.classList.contains('q-pl-sm')).toBe(false)
    expect(label.classList.contains('q-pl-xs')).toBe(false)
  })

  it('applies no padding class when dense=true and no icon', () => {
    const screen = render(KChip, { props: { label: 'Test', dense: true } })
    const label = screen.container.querySelector('.ellipsis')
    expect(label.classList.contains('q-pl-sm')).toBe(false)
    expect(label.classList.contains('q-pl-xs')).toBe(false)
  })

  it('switches from q-pl-sm to q-pl-xs when dense prop changes to true', async () => {
    const screen = render(KChip, { props: { label: 'Test', icon: 'home', dense: false } })
    expect(screen.container.querySelector('.ellipsis').classList.contains('q-pl-sm')).toBe(true)
    await screen.rerender({ dense: true })
    expect(screen.container.querySelector('.ellipsis').classList.contains('q-pl-xs')).toBe(true)
    expect(screen.container.querySelector('.ellipsis').classList.contains('q-pl-sm')).toBe(false)
  })

  it('emits click event when chip is clicked', async () => {
    const screen = render(KChip, { props: { label: 'Test', clickable: true } })
    await screen.locator.locator('.q-chip').click()
    expect(screen.emitted('click')).toBeTruthy()
  })

  it('emits remove event when removable chip remove button is clicked', async () => {
    const screen = render(KChip, { props: { label: 'Test', removable: true } })
    await screen.locator.locator('.q-chip__icon--remove').click()
    expect(screen.emitted('remove')).toBeTruthy()
  })
})
