# User

## Overview

`useUser()` provides reactive access to the currently authenticated user, read directly from the global KDK store (`user` path). All returned values update automatically when the user logs in, logs out, or their profile is patched.

## Usage

```javascript
import { useUser } from '@kalisio/kdk/core.client'

const { User, name, description, avatar, role } = useUser()
```

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `User` | `Ref<Object \| null>` | The raw user object from the global store, or `null` when no user is authenticated. |
| `name` | `ComputedRef<string>` | The display name, resolved in order from `profile.name`, `profile.username`, then `email`. Empty string if none is found. |
| `description` | `ComputedRef<string>` | The value of `profile.description`, or an empty string. |
| `avatar` | `ComputedRef<Object>` | The full `profile` object, used as input to avatar components. Empty object when no user is authenticated. |
| `role` | `ComputedRef<string \| undefined>` | The user's primary role. If `permissions` is a string it is returned directly; if it is an array the first element is returned. `undefined` when no permissions are set. |
