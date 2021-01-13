# Services

## Users service

::: tip
Available as a global service
:::

### Data model

The data model of a user as used by the API is [detailed here](../../architecture/data-model-view.md#user-data-model).

### Hooks

The following [hooks](./hooks.md) are executed on the `users` service:

<mermaid>
graph TB
  beforeAll{none before all}
  afterAll{after all}
  afterAll --> hook1("discard('passwords')")
  hook1 -- Email/Name extracted from profile --> hook2("serialize('profile')")
  beforeAll --> FIND[FIND]
  FIND --> afterAll
  beforeAll --> GET[GET]
  GET --> afterAll
  beforeAll --> hook3("serialize('OAuth2 profile')")
  hook3 -- Email/Name extracted from provider --> hook4("serialize('profile')")
  hook4 -- Email/Name set in profile --> hook5("serialize('clearPassword')")
  hook5 -- Clear password saved --> hook6("hashPassword")
  hook6 -- Password hashed --> hook7("enforcePasswordPolicy")
  hook7 -- Clear password validated --> hook8("discard('clearPassword')")
  hook8 -- Clear password removed --> CREATE[CREATE]
  CREATE --> hook9(updateAbilities)
  hook9 -- Abilities initialized in cache --> afterAll
  beforeAll --> hook10(populatePreviousObject)
  hook10 -- Previous user as params --> hook11(storePreviousPassword)
  hook11 -- Previous password list updated --> UPDATE[UPDATE]
  UPDATE --> afterAll
  beforeAll --> hook12(populatePreviousObject)
  hook12 -- Previous user as params --> hook13(storePreviousPassword)
  hook13 -- Previous password list updated --> PATCH[PATCH]
  PATCH --> afterAll
  beforeAll --> REMOVE[REMOVE]
  REMOVE --> afterAll
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9,hook10,hook11,hook12,hook13 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
</mermaid>

## Devices service

::: tip
Available as a global service
:::

::: warning
`update` and `remove` methods are the only ones allowed from the client side
`create` method is only allowed from the server side
:::

`create` (respectively `remove`) creates (respectively removes) the device to/from the notification system (APNS or Firebase).
`update` updates the device registration ID or create it if not yet created.

### Data model

The data model of a device as used by the API is [detailed here](../../architecture/data-model-view.md#device-data-model).

::: tip
Devices are store in the `devices` property of the user they belong to.
:::

### Hooks

The following [hooks](./hooks.md) are executed on the `devices` service:

<mermaid>
graph TB
  before{none before all}
  after{none after all}
  before --> UPDATE[UPDATE]
  UPDATE --> after
  before --> hook1("disallow('external')")
  hook1 --> CREATE[CREATE]
  CREATE --> after
  before --> REMOVE[REMOVE]
  REMOVE --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
</mermaid>

## Authorisations service

::: tip
Available as a global service
:::

::: warning
`create` and `remove` methods are the only one allowed from the client/server side
:::

### Data model

An authorisation consists in associating a *resource* object (e.g. a group) with a *subject* object (e.g. a user) according to a *permission* (i.e. a role or a right). The resource object information and the permission are directly stored on the target subject(s) in a property called the *scope* of the authorisation (e.g. `groups` to store all groups a user belongs to). 

For instance the groups a user belongs to with different roles will result in the following structure on the user:
```
groups: [
  {
      _id: ObjectId('5f568ba1fc54a1002fe6fe37'),
      name: 'Centre de Castelnaudary',
      context: '5f55f4169f6d47002f05f4ac',
      permissions: 'owner'
      ...
  },
  {
      _id: ObjectId('5f64a3791a1714002f68437d'),
      name: 'Kalisio',
      context: '5f532d439f6d47002f04f07e',
      permissions: 'manager'
      ...
  },
  {
      _id: ObjectId('5f65e34a75b663003095f52e'),
      name: 'LTD',
      context: '5f65d98084f9d5003039b55b',
      permissions: 'member'
      ...
  }
]
```

### Hooks

The following [hooks](./hooks.md) are executed on the `authorisations` service:

<mermaid>
graph TB
  before{none before all}
  after{none after all}
  before -- Subject service as data/params<br/>Resource as data/params --> hook1(populateSubjects)
  hook1 -- Authorisation subjects as params --> hook2(populateResource)
  hook2 -- Authorisation resource as params --> CREATE[CREATE]
  CREATE --> after
  before -- Subject service as query/params<br/>Resource id as query/params --> hook3(populateSubjects)
  hook3 -- Authorisation subjects as params --> hook4(populateResource)
  hook4 -- Authorisation resource as params --> REMOVE[REMOVE]
  REMOVE --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
</mermaid>

## Tags service

::: tip
Available as a global and a contextual service
:::

Tags can be created directly using this service or by "tagging" a target resource (e.g. a user). As a consequence, `create`/`remove` operations can include a target resource as input data/ID.

Due to this behaviour tags are created/removed by value, not by ID. To avoid duplication when tagging multiple resources with the same tag, the service manages a reference count on tag objects and they are automatically created/removed accordingly.

::: warning
`remove` method can be called with a resource ID 
:::

### Data model

The data model of a tag as used by the API is [detailed here](../../architecture/data-model-view.md#tag-data-model).

### Hooks

The following [hooks](./hooks.md) are executed on the `tags` service:

<mermaid>
graph TB
  before{none before all}
  after{none after all}
  before --> FIND[FIND]
  FIND --> after
  before --> GET[GET]
  GET --> after
  before -- Optional resource as data/params --> hook2(populateTagResource)
  hook2 -- Tag resource as params --> hook3(addTagIfNew)
  hook3 -- Created or patched tag<br/>by recursive call --> CREATE[CREATE]
  CREATE --> hook4(tagResource)
  hook4 -- Updated resource --> after
  before --> UPDATE[UPDATE]
  UPDATE --> hook5("updateOrgResource('tags')")
  hook5 -- Updated tagged members --> after
  before --> PATCH[PATCH]
  PATCH --> hook6("updateOrgResource('tags')")
  hook6 -- Updated tagged members --> after
  before -- Optional resource as query/params --> hook7(populateTagResource)
  hook7 -- Tag resource as params --> hook8(removeTagIfUnused)
  hook8 -- Removed or patched tag<br/>by recursive call --> REMOVE[REMOVE]
  REMOVE --> hook9(untagResource)
  hook9 -- Updated resource --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
</mermaid>

## Storage service

::: tip
Available as a global and a contextual service
:::

::: warning
`get`, `create` and `remove` methods are the only one allowed from the client/server side
:::

Blobs can be created directly using this service or through "attachment" to a target resource (e.g. a user).

This service heavily relies on [feathers-blob](https://github.com/feathersjs-ecosystem/feathers-blob) and [multer](https://github.com/expressjs/multer) for handling [multipart/form-data](https://docs.feathersjs.com/guides/advanced/file-uploading.html#feathers-blob-with-multipart-support).

### Data model

No data model, data are directly stored on target storage backend (i.e. AWS S3).

### Hooks

The following [hooks](./hooks.md) are executed on the `storage` service:

<mermaid>
graph TB
  before{none before all}
  after{none after all}
  before --> hook1(disallow)
  hook1 --> FIND[FIND]
  FIND --> after
  before --> GET[GET]
  GET --> after
  before -- Optional resource as data/params --> hook2(populateAttachmentResource)
  hook2 -- Attachment resource as params --> CREATE[CREATE]
  CREATE -- Blob created --> hook3(attachToResource)
  hook3 -- Updated resource --> hook4("discard('uri')")
  hook4 --> after
  before --> hook5(disallow)
  hook5 --> UPDATE[UPDATE]
  UPDATE --> after
  before --> hook6(disallow)
  hook6 --> PATCH[PATCH]
  PATCH --> after
  before -- Optional resource as query/params --> hook7(populateAttachmentResource)
  hook7 -- Attachment resource as params --> REMOVE[REMOVE]
  REMOVE -- Blob removed --> hook8(detachFromResource)
  hook8 -- Updated resource --> hook9("discard('uri')")
  hook9 --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
</mermaid>

## Organisations service

::: tip
Available as a global service
:::

This service exhibits the following methods in addition to standard CRUD operations:
* **createOrganisationServices**: creates all registered services for an organisation
* **removeOrganisationServices**: removes registered services for an organisation
* **registerOrganisationServicesHook(hook)**: register a function to create additional services per organisation
* **unregisterOrganisationServicesHook(hook)**: unregister a previously registered function

A hook function has the following structure:
```
{
  createOrganisationServices: function(organisation, db)
  removeOrganisationServices: function(organisation, db)
}
```

::: tip
By default the following services are created for an organisation: [members](./services.md#members-service), [tags](./services.md#tags-service), [groups](./services.md#groups-service), [storage](./services.md#storage-service).
:::

### Data model

The data model of an organisation as used by the API is [detailed here](../../architecture/data-model-view.md#organisation-data-model).

### Hooks

No specific [hooks](./hooks.md) are executed on the `organisations` service.

## Members service

::: tip
Available as a contextual service
:::

This service is a proxy to the [users service](./service.md#users-service) available at the organisation level in order to filter users belonging to it.

### Data model

The data model of a member as used by the API is a the one of a [user](../../architecture/data-model-view.md#user-data-model).

### Hooks

No specific [hooks](./hooks.md) are executed on the `members` service.

## Groups service

::: tip
Available as a contextual service
:::

### Data model

The data model of a group as used by the API is [detailed here](../../architecture/data-model-view.md#group-data-model).

### Hooks

The following [hooks](./hooks.md) are executed on the `groups` service:

<mermaid>
graph TB
  before{none before all}
  after{none after all}
  before --> FIND[FIND]
  FIND --> after
  before --> GET[GET]
  GET --> after
  before --> CREATE[CREATE]
  CREATE --> after
  before --> UPDATE[UPDATE]
  UPDATE --> hook1("updateOrgResource('groups')")
  hook1 -- Updated authorization scopes on members --> after
  before --> PATCH[PATCH]
  PATCH --> hook2("updateOrgResource('groups')")
  hook2 -- Updated authorization scopes on members --> after
  before --> REMOVE[REMOVE]
  REMOVE --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
</mermaid>

## Local settings service

This **client-side** service allows to restore/save persistent settings to/from the [global store](./application.md#store) from/to [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

::: warning
`get` and `patch` methods are the only one allowed, `id` parameter is ignored and methods will always target the whole settings object
:::

::: warning
This service has to be instanciated at application level, none provided by default
:::

To create your own service use the following code:
```js
import { Store, LocalSettingsService } from '@kalisio/kdk/core.client'

// Setup defaults in global store
Store.set('app-settings', { x: y, ... })
// Create a service targeting only settings in store
const settingsService = api.createService('settings', {
  service: LocalSettingsService,
  propertyMapping: {
    x: 'app-settings.x',
    ...
  }
})
// Restore previous settings from local storage if any
settingsService.restoreSettings()
```

::: tip
Because settings are available through a service interface you can edit it using the [editor system](./components.md#editors). The `propertyMapping` will be used to match form field names and corresponding global store properties.
:::

For instance the following schema can be used to edit the previous sample:
```json
{
  "$schema": "http://json-schema.org/draft-06/schema#",
  "$id": "http://www.kalisio.xyz/schemas/settings.update.json#",
  "title": "schemas.UPDATE_SETTINGS_TITLE",
  "type": "object",
  "properties": {
    "x": {
      "type": "string", 
      "field": {
        "component": "form/KTextField",
        "helper": "schemas.X_FIELD_HELPER"
      }
    }
  },
  "required": ["x"]
}

```