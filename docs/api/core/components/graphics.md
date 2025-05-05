# Graphics

The `graphics` folder contains reusable components for rendering a variety of graphical elements.

## `KIcon`

The `KIcon` component is a wrapper around [Quasar Icon](https://quasar.dev/vue-components/icon/) that enables displaying a primary icon with an optional stacked overlay icon. This is useful for creating composite or symbolic icons by layering one icon on top of another.

### Props

| Prop   | Type               | Default     | Description                                                                       |
| ------ | ------------------ | ----------- | --------------------------------------------------------------------------------- |
| `icon` | `String \| Object` | `undefined` | Main icon name (as string) or an object describing the main icon and its overlay. |

### Usage

* An icon using a name:

```html
<KIcon icon='las la-home' />
```
* And the same icon with a red slash through it:

```html
<KIcon
  :icon="{
    name: 'las la-home',
    overlay: {
      name: 'las la-slash',
      color: 'red',
      rotation: 90
    }
  }"
/>
```