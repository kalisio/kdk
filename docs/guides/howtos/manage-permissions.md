# Manage permissions

The way users are authorized to access GUI or related service operations in your app can be managed using the KDK [isomorphic permissions system](../api/core/application.md#permissions).
Start creating a `permissions.js` file in a `common` folder in your app that will be imported by [application hooks](https://feathersjs.com/api/hooks.html#application-hooks) file either on the client or the server side.
```
├── api
│  ├── src
│  │  ├── app.hooks.js
├── common
│  ├── permissions.js
├── src
│  ├── app.hooks.js
  ...    
```

## Define the permissions

If your app relies on [Role Based Access Control](https://en.wikipedia.org/wiki/Role-based_access_control) (RBAC) you can for instance define permissions based on a `permissions` property associated with your user and containing one or more roles among those available in your app as illustrated by the following content example of your `permissions.js` file:
```js
import { permissions } from '@kalisio/kdk/core.common.js'

export const Roles = {
  user: 0,
  administrator: 1
}

// Hook computing base abilities for a given user
export function defineUserAbilities (subject, can, cannot, app) {
  if (subject && subject._id) {
    if (subject.permissions) {
      const roles = (Array.isArray(subject.permissions) ? subject.permissions : [subject.permissions])
      roles.forEach(role => {
        // Define access to services for all users
        can('service', 'xxx')
        can('read', 'articles')
        ...
        // Then administrator rights
        if (Roles[role] >= Roles.administrator) {
          // An admin can manage generic situations/layers
          can('all', 'articles')
          ...
        }
      })
    }
  }
}
```

## Register the permissions

Now your permissions function is defined you have to register it into the KDK permissions system and add the `authorise` hook in the `api/src/app.hooks.js` file, where application hooks running for every service are defined, in order to check permissions on each service operation:
```js
import { permissions as corePermissions, hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import * as permissions from '../../common/permissions.mjs'

// Default rules for all users
corePermissions.defineAbilities.registerHook(corePermissions.defineUserAbilities)
// Then rules for app
corePermissions.defineAbilities.registerHook(permissions.defineUserAbilities)

export default {
  before: {
    all: [coreHooks.authorise],
    ...
  },
  after: {
    ...
  },
  error: {
    ...
  }
}
```

Similarly, register your permissions function in the application hooks defined in the `src/app.hooks.js` on the client side:
```js
// Application hooks that run for every service
import { permissions as corePermissions } from '@kalisio/kdk/core.client'
import * as permissions from '../common/permissions.mjs'

// Default rules for all users
corePermissions.defineAbilities.registerHook(corePermissions.defineUserAbilities)
// Then rules for app
corePermissions.defineAbilities.registerHook(permissions.defineUserAbilities)
```

## Check for permissions

Although the `authorise` hook will automatically do the job on the server side for service operations, you might want to manually check for permissions, notably on the client side to know if a given feature or component action should be accessible to the user. You can simply do this on your [API client](http://localhost:5173/kdk/api/core/application.html#client-setup) by calling the `can()` method like `api.can('update', 'articles')`.

Sometimes, a permission cannot be related to a service operation, you can create a specific action for this, e.g.
```js
// In your permissions function
export function defineUserAbilities (subject, can, cannot, app) {
	...
	if (role >= Roles.administrator) {
	  can('access-admin-tools')
	}
}
// In one of your component
if (api.can('access-admin-tools')) ...
```