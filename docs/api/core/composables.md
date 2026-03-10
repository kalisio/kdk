# Composables

## Store

### [useStore](./composables/composables.store.md)

Used to setup a named reactive store backed by Vue's `reactive()`. All stores share a single global registry; calling `useStore` with the same name from multiple components returns the same reactive object.

## Version

### [useVersion](./composables/composables.version.md)

Exposes read-only access to the client and API version information. On first call it fetches the API version from the `Capabilities` singleton.

## User & Session

### [useUser](./composables/composables.user.md)

Provides reactive access to the currently authenticated user (`name`, `description`, `avatar`, `role`) read directly from the global KDK store.

### [useSession](./composables/composables.session.md)

Manages the full client session lifecycle: restoring an existing session on mount, redirecting based on route guards and user abilities, and handling socket disconnection/reconnection events with appropriate UI prompts.

## Context

### [useContext](./composables/composables.context.md)

Manages the current application context (e.g. an organisation or project). Keeps the context in sync with the backend via service events and redirects to a fallback route when the context is deleted.

## Selection

### [useSelection](./composables/composables.selection.md)

Creates or retrieves a named reactive selection store. Supports single/multiple selection modes, optional item filtering, and configurable item comparison.

## Screen & Layout

### [useScreen](./composables/composables.screen.md)

Wraps the Quasar Screen plugin with additional helpers for `dense`/`wide` breakpoints, orientation detection, and fullscreen management.

### [useLayout](./composables/composables.layout.md)

Provides programmatic control over the KDK application layout. Exposes `configureLayout`, `clearLayout`, `setLayoutMode`, and per-placement pane methods for `top`, `left`, `bottom`, and `right`.

## Activity

### [useActivity / useCurrentActivity](./composables/composables.activity.md)

- **`useActivity(name, options)`** — sets up state and configuration stores for a named activity and registers it as the current activity.
- **`useCurrentActivity(options)`** — retrieves the current activity context from anywhere in the component tree.

## Collection

### [useCollection](./composables/composables.collection.md)

Manages a reactive, paginated collection backed by a FeathersJS service using `feathers-reactive`. Supports replace-on-page and append-on-scroll strategies.

### [useCollectionCounter](./composables/composables.collection-counter.md)

Reactively tracks the total number of items in a FeathersJS service collection using a `$limit: 0` query.

### [useCollectionTimeRange](./composables/composables.collection-timerange.md)

Reactively tracks the minimum and maximum values of a time property across a FeathersJS collection.

### [useCollectionFilter / useCollectionFilterQuery](./composables/composables.collection-filter.md)

- **`useCollectionFilter()`** — exposes tag and time filter state from the current activity context.
- **`useCollectionFilterQuery(options)`** — builds a reactive `filterQuery` from active tag and time filter selections.

## Schema

### [useSchema](./composables/composables.schema.md)

Provides JSON Schema loading, optional property filtering, AJV compilation, and localised validation within a Vue component.

## Errors & Messages

### [useErrors](./composables/composables.errors.md)

Sets up a centralised error display handler. Listens to the global `error` event bus, translates messages using i18n, and displays Quasar notifications. Also handles errors embedded in route query parameters.

### [useMessages](./composables/composables.messages.md)

Thin wrapper around the KDK `messages` FeathersJS service for creating messages.

## PWA

### [usePwa](./composables/composables.pwa.md)

Manages the Progressive Web App installation prompt and service worker update lifecycle.

### [useWelcome](./composables/composables.welcome.md)

Displays a welcome prompt dialog automatically after each login and hides it on logout, respecting a user preference stored in `LocalStorage`.
