# Actions

## Overview

The `utils.actions.js` module exports `actionProps`, a reusable Vue props definition object shared by all KDK action components (buttons, FAB actions, tabs, items, etc.).

## `actionProps`

A Vue props definition object to be spread into a component's `props` option:

```javascript
import { actionProps } from '@kalisio/kdk/core.client'

export default {
  props: { ...actionProps }
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `String` | *(required)* | Unique identifier for the action. |
| `label` | `String` | `null` | Display label. |
| `icon` | `String` | `undefined` | Icon class or name. |
| `iconRight` | `Boolean` | `false` | When `true`, the icon is placed to the right of the label. |
| `color` | `String` | `'grey-9'` | Quasar color name. |
| `size` | `String` | `'md'` | Size token (`'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'`). |
| `flat` | `Boolean` | `true` | Renders as a flat (no background) button. |
| `outline` | `Boolean` | `false` | Renders with an outline border. |
| `badge` | `Object` | `null` | Badge configuration object passed to Quasar `QBadge`. |
| `tooltip` | `String` | `''` | Tooltip text shown on hover. |
| `disabled` | `Boolean \| Function` | `false` | Disables the action. Can be a function returning a boolean. |
| `toggled` | `Boolean` | `false` | Whether the action is in a toggled/active state. |
| `toggle` | `Object` | `{}` | Toggle appearance configuration (e.g. `{ icon, color }`). |
| `stack` | `Boolean` | `false` | Stacks icon above label. |
| `loading` | `Boolean` | `false` | Shows a loading spinner. |
| `propagate` | `Boolean` | `true` | Whether click events propagate to parent elements. |
| `context` | `Object` | `null` | Arbitrary context object passed to the handler. |
| `handler` | `Function` | `null` | Click handler function. |
| `closePopup` | `Boolean \| Number \| String` | `false` | Closes a parent popup on click. A number specifies how many levels to close. |
| `dialog` | `Object` | `null` | Quasar dialog configuration to open on click. |
| `route` | `Object` | `null` | Vue Router route to navigate to on click. |
| `url` | `String` | `null` | URL to open in a new tab on click. |
| `renderer` | `String` | `'button'` | How the action is rendered. One of `'button'`, `'form-button'`, `'item'`, `'fab'`, `'fab-action'`, `'tab'`. |
