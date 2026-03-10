# Project

## Overview

`useProject(options)` manages a map project loaded from the `projects` FeathersJS service. It can track the project ID from the current route query parameter or load it manually, and keeps the local project reference in sync with real-time service events.

> Watches route changes to track the `project` query parameter when `options.route` is `true`.

## Usage

```javascript
import { useProject } from '@kalisio/kdk/map.client'

// Load project from route query (?project=<id>)
const { project, loadProject, hasProject, catalogProjectQuery } = useProject()

// Load project manually
const { loadProject } = useProject({ route: false })
await loadProject({ name: 'My Project' })
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `options.route` | `boolean` | `true` | When `true`, reads and watches the `project` query parameter from the current route. |
| `options.context` | `string` | `''` | Context ID for the `projects` service (used for contextual/multi-tenant services). |
| `options.updateActivity` | `boolean` | `true` | When `true`, calls `setActivityProject` on the current activity whenever the project is loaded or updated. |
| `options.planetApi` | `Object` | `api` | The [client API](../core/application.md#client-setup) instance used to retrieve project data. |

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `project` | `Ref<Object \| null>` | The currently loaded project object, or `null` if none is loaded. |
| `projectId` | `Ref<string \| null>` | The ID of the project to be loaded (from route or manually set). |
| `projectQuery` | `ComputedRef<Object>` | Query `{ project: projectId }` when a project ID is set, otherwise `{}`. |
| `catalogProjectQuery` | `ComputedRef<Object>` | Query to filter catalog layers belonging to the current project. Empty `{}` when no project is loaded. |
| `hasProject()` | `Function` | Returns `true` if either `projectId` or `project` is set. |
| `isProjectLoaded()` | `Function` | Returns `true` if the project has been loaded (i.e. `project.value` is not null). |
| `loadProject(query?)` | `async Function` | Loads the project from the service. Accepts an optional extra query object. When no `projectId` is set and a `query` is provided, finds the first matching project. Populates project layers and views by default. |

## Lifecycle

- **`beforeMount`**: Refreshes the project ID from the route and subscribes to `patched`, `updated`, and `removed` events on the `projects` service.
- **`beforeUnmount`**: Unsubscribes from service events.
- When the project is remotely updated (`patched`/`updated`), the local `project` ref is refreshed and the activity project is updated.
- When the project is remotely removed, `project` and `projectId` are cleared and the `project` query parameter is removed from the route (if `options.route` is `true`).
