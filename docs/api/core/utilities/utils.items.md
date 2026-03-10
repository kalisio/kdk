# Items

## Overview

The `utils.items.js` module exports `CardSectionProps`, a reusable Vue props definition shared by KDK card section components.

## `CardSectionProps`

A Vue props definition object to be spread into a card section component's `props` option:

```javascript
import { CardSectionProps } from '@kalisio/kdk/core.client'

export default {
  props: { ...CardSectionProps }
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `String` | `''` | Section title displayed in the card header. |
| `item` | `Object` | `null` | The data object this section represents. |
| `actions` | `Array` | `null` | Action definitions to render in the section. |
| `actionsFilter` | `String \| Array` | `null` | Filter applied to the actions list. Can be a comma-separated string or an array of action IDs to include. |
| `hideSeparator` | `Boolean` | `false` | When `true`, hides the section separator line. |
| `hideHeader` | `Boolean` | `false` | When `true`, hides the section header. |
| `dense` | `Boolean` | `false` | Uses compact layout. |
| `context` | `Object` | `null` | Arbitrary context object passed to action handlers. |
