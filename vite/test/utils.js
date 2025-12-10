import { mount } from '@vue/test-utils'

// Create a dummy component that uses a composable
export function mountComposable(fn) {
  let composable
  const TestComponent = {
    setup() {
      composable = fn()
      return () => {}
    }
  }
  // Mount it to trigger lifecycle hooks
  const wrapper = mount(TestComponent)
  return composable
}

// Create a component that uses a composable
export function mountComponent(component, options = {}) {
  const wrapper = mount(component, options)
  return wrapper.componentVM
}
