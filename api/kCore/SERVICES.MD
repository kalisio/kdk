# Services

## Users service

> Available as a global service

### Data model

The data model of a user as used by the API is [detailed here](../architecture/DATAMODEL.MD#user-data-model).

### Hooks

The following [hooks](./HOOKS.MD) are executed on the `users` service:
![User hooks](https://rawgit.com/kalisio/kdk/master/images/User%20Hooks%20Diagram.svg)

## Authorisations service

> Available as a global service

> `create` and `remove` methods are the only one allowed from the client/server side

### Data model

No data model, authorisations are directly stored on target subject(s).

### Hooks

The following [hooks](./HOOKS.MD) are executed on the `authorisations` service:
![Authorisation hooks](https://rawgit.com/kalisio/kdk/master/images/User%20Hooks%20Diagram.svg)

## Tags service

> Available as a global and a contextual service

> `update` method is not available

> `get`, `patch` methods are only allowed from the server side

> clients can only `create`, `remove` and `find` tags

### Data model

The data model of a user as used by the API is [detailed here](../architecture/DATAMODEL.MD#tag-data-model).

### Hooks

The following [hooks](./HOOKS.MD) are executed on the `tags` service:
![Tag hooks](https://rawgit.com/kalisio/kdk/master/images/Tag%20Hooks%20Diagram.svg)

## Storage service

> Available as a global and a contextual service

> `create` and `remove` methods are the only one allowed from the client/server side

### Data model

No data model, data are directly stored on target storage backend (i.e. AWS S3).

### Hooks

The following [hooks](./HOOKS.MD) are executed on the `storage` service:
![Storage hooks](https://rawgit.com/kalisio/kdk/master/images/Storage%20Hooks%20Diagram.svg)

