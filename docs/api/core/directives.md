# Directives

::: tip
The **Directives** provided by the **KDK** must be registered by each application within the corresponding `kdk.js` [boot file](https://quasar.dev/quasar-cli-vite/boot-files#anatomy-of-a-boot-file).
```js
// Register global directives
app.directive('hover', kdkCoreDirectives.vHover)
```
:::

## v-hover

`v-hover` is a lightweight directive that allows you to react when an element either becomes hovered or unhovered.

```html
<div v-hover="{ enter: enterCallback, leave: leaveCallback }">
  ....
</div>
```