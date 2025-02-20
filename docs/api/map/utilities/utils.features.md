# Features utilities

This module provides helper functions to manage recurring tasks on features, like binding and unbinding event listeners to track real-time events on features services and update layers accordingly.

## Functions

### `listenToFeaturesServiceEventsForLayer(layer, options, listeners)`

Binds event listeners to a given layer's service events and stores them in the returned object.

> Rely on [listenToServiceEvents](../../core/utilities/utils.services.md)

#### Parameters

- `layer` (Object) - The layer to listen for service events.
- `options` (Object) - Event handlers to be executed when an event occurs. This object may contain:
  - `context` (String | Object | null) - Service context if any.
  - `created` (Function | null) - Handler for feature creation events.
  - `updated` (Function | null) - Handler for feature update events.
  - `patched` (Function | null) - Handler for feature patch events.
  - `removed` (Function | null) - Handler for feature removal events.
  - `all` (Function | null) - Handler for all events if no specific defined.
- `listeners` (Object) - Object to store the registered event listeners.

#### Returns

- `listeners` (Object) - The registered event listeners.

#### Example Usage

```javascript
const layer = { service: 'features', _id: 'layer-1' };
const listeners = {};

const registeredListeners = listenToFeaturesServiceEventsForLayer(layer, {
  created: (feature, layer) => console.log(`Feature created in layer ${layer._id}:`, feature),
  updated: (feature, layer) => console.log(`Feature updated in layer ${layer._id}:`, feature),
  removed: (feature, layer) => console.log(`Feature removed in layer ${layer._id}:`, feature),
}, listeners);
```

---

### `unlistenToFeaturesServiceEventsForLayer(layer, listeners)`

Unbinds previously registered event listeners from a given layer's service events.

> Rely on [unlistenToServiceEvents](../../core/utilities/utils.services.md)

#### Parameters

- `layer` (Object) - The layer to remove service event listeners from.
- `listeners` (Object) - The object containing registered event listeners.

#### Example Usage

```javascript
unlistenToFeaturesServiceEventsForLayer(layer, registeredListeners);
```

