# Directives

::: tip
The **Directives** provided by the **KDK** must be registered by each application within the corresponding `kdk.js` [boot file](https://quasar.dev/quasar-cli-vite/boot-files#anatomy-of-a-boot-file). For instance:

```js
// Register global directives
app.directive('hover', kdkCoreDirectives.vHover)
```
:::

## v-drop-file

Vue directive for drag & drop file handling with a visual overlay, validation, and a callback.

### Usage

```html
<div v-drop-file="options" />
```

```js
// Minimal
const options = {
  dropCallback: async (content) => { /* handle file */ }
}

// Full
const options = {
  dropCallback: async (content) => { ... },
  mimeTypes:    ['image/png', 'application/pdf'],
  maxFiles:     3,
  maxFileSize:  5_000_000,
  maxTotalSize: 10_000_000,
  fontSize:     '2rem',
  enabled:      true
}
```

### Options

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `dropCallback` | `Function` | ✅ | — | Called for each accepted file after reading. Receives the content parsed by `Reader`. |
| `mimeTypes` | `string[]` | — | all | List of accepted MIME types. e.g. `['image/png', 'text/csv']`. If omitted, all types are accepted. |
| `maxFiles` | `number` | — | — | Maximum number of files droppable at once. Shows an error message if exceeded. |
| `maxFileSize` | `number` | — | — | Max size per file in bytes. Files exceeding the limit are skipped with a notification. |
| `maxTotalSize` | `number` | — | — | Max combined size of all dropped files in bytes. Only checked when multiple files are dropped. |
| `fontSize` | `string` | — | `'2rem'` | Font size of the overlay text. |
| `enabled` | `boolean` | — | `true` | Enables or disables the directive dynamically. |

### Overlay behaviour

| Situation | Color | Message |
|---|---|---|
| All files accepted | 🟢 positive | "Drop N file(s)" |
| Some files rejected | 🟡 warning | "Some files are not supported" |
| All files rejected | 🔴 negative | "N file(s) not supported" |
| Too many files | 🔴 negative | "Max number of files reached" |

### Notes

- The target element is automatically set to `position: relative`.
- The overlay is injected as a direct child — avoid using this directive on elements with `overflow: hidden`.
- `dropCallback` is required. If missing or not a function, an error is logged and the directive does nothing.
- The directive is reactive: updating the binding value (e.g. toggling `enabled`) is handled via the `updated` hook.
- Event listeners are properly cleaned up in `beforeUnmount`.


## v-hover

Vue directive for hover event handling. Automatically disabled on touch devices.

### Usage

```html
<div v-hover="{ enter, over, leave }" />
```

```js
const enter = () => console.log('mouse entered')
const over  = () => console.log('mouse over')
const leave = () => console.log('mouse left')
```

### Options

| Property | Type | Required | Description |
|---|---|---|---|
| `enter` | `Function` | — | Triggered once when the mouse enters the element (`mouseenter`). |
| `over` | `Function` | — | Triggered continuously as the mouse moves over the element (`mouseover`). |
| `leave` | `Function` | — | Triggered when the mouse leaves the element (`mouseleave`). |

All three callbacks are optional and default to a no-op.

### Notes

- Does nothing on touch devices (`Platform.touch === true`) — no listeners are attached.
- Event listeners are properly cleaned up in `beforeUnmount`.


## v-safe-html

Vue directive for safely rendering HTML content. Sanitizes the value via `Document.sanitizeHtml` before injecting it into the DOM, preventing XSS attacks.

Use this instead of `v-html` whenever the content comes from user input or an external source.

### Usage

```html
<div v-safe-html="rawHtml" />
```

```js
const rawHtml = '<b>Hello</b> <script>xss()</script>'
// renders: <b>Hello</b>
```

### Notes

- Sanitization is applied on both `mounted` and `updated`, so the content stays safe when the binding value changes.
- Sanitization options are configured in `Document.sanitizeHtml` — refer to its documentation to adjust allowed tags and attributes.
