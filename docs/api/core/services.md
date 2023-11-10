# Services

## Users service

::: tip
Available as a global service
:::

### Data model

The data model of a user as used by the API is [detailed here](../../architecture/data-model-view.md#user-data-model).

### Hooks

The following [hooks](./hooks.md) are executed on the `users` service:

```mermaid
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
```

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

```mermaid
graph TB
  before{none before all}
  after{none after all}
  before --> UPDATE[UPDATE]
  UPDATE -- If new device --> CREATE
  UPDATE -- If existing device --> UPDATE_DEVICE[[UPDATE DEVICE<br/>-pusher service-]]
  UPDATE_DEVICE --> after
  before --> hook1("disallow('external')")
  hook1 --> CREATE[CREATE]
  CREATE --> CREATE_DEVICE[[CREATE DEVICE<br/>-pusher service-]]
  CREATE_DEVICE --> PATCH_USER[[PATCH USER<br/>-users service-]]
  PATCH_USER --> after
  before --> REMOVE[REMOVE]
  REMOVE --> REMOVE_DEVICE[[REMOVE DEVICE<br/>-pusher service-]]
  REMOVE_DEVICE -->  PATCH_USER[[PATCH USER<br/>-users service-]]
  PATCH_USER --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE,CREATE_DEVICE,REMOVE_DEVICE,UPDATE_DEVICE,PATCH_USER operationClass
```

## Mailer service

::: tip
Available as a global service
:::

This service is powered by [feathers-mailer](https://github.com/feathersjs-ecosystem/feathers-mailer). It acts as a proxy to send emails through an SMTP server.

::: warning
Service methods are only allowed from the server side. `create` is the sole available method used to send an email.
:::

::: warning DEPRECATION NOTICE
The email account can authorise connection by email/password on [https://myaccount.google.com/lesssecureapps](https://myaccount.google.com/lesssecureapps). Before that the domain admin should allow him to manage this setting (*Admin Console > Security > General > Less secure apps settings*). To avoid changing it for all users first create a group, add the user to the group and let the group manage less secure apps setting.
:::

On 15 february 2021 Gmail API requires OAuth2 authentication to send emails. The simplest solution is to create a [service account](https://medium.com/@imre_7961/nodemailer-with-g-suite-oauth2-4c86049f778a) and to [delegate the domain-wide authority to the service account](https://developers.google.com/identity/protocols/oauth2/service-account) with scope `https://mail.google.com`.

### Hooks

The following [hooks](./hooks.md) are executed on the `databases` service:

```mermaid
graph TB
  before{"disallow('external')"}
  after{none after all}
  before --> CREATE[CREATE]
  CREATE --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,CREATE,REMOVE operationClass
```

## Pusher service

::: tip
Available as a global service
:::

This service relies on [sns-mobile](https://github.com/kalisio/sns-mobile), which has a [nice tutorial](http://evanshortiss.com/development/mobile/2014/02/22/sns-push-notifications-using-nodejs.html), to manage the link between [AWS SNS](https://aws.amazon.com/sns) and internal resource objects in order to send push notifications to users.

To get an API access/secret key you need to create a new user in IAM with a role giving access to SNS like `AmazonSNSFullAccess` but in production [you should control access more precisely](http://docs.aws.amazon.com/sns/latest/dg/UsingIAMwithSNS.html).

Since 2017 Google Cloud Messaging (GCM) has become Firebase Cloud Messaging (FCM), to generate an API key follow [this issue](https://stackoverflow.com/questions/39417797/amazon-sns-platform-credentials-are-invalid-when-re-entering-a-gcm-api-key-th) and enter the server key when creating the SNS application on AWS. Although you use the Firebase console you should also see the created API through the Google Cloud console.

::: warning
`create` and `remove` methods are the only one allowed from the server side
:::

### Data model

This service helps (un)registering devices to/from SNS and create/remove SNS topics. This service also helps associating a *resource* object (e.g. a group) with a SNS *topic* to provide push notifications to the users associated with the resource. SNS ARNs are directly stored on the target resource(s) in the `topics` property.

::: tip
The service is designed to possibly manage a different topic per platform (e.g. ANDROID / IOS), although at the present time the same topic is used by all platforms because by default SNS topics are cross-platforms.
:::

For instance the topics associated to a group will result in the following structure on the group object:
```js
{
    _id: ObjectId('5f568ba1fc54a1002fe6fe37'),
    name: 'Centre de Castelnaudary',
    topics: {
        ANDROID: 'arn:aws:sns:eu-west-1:xxx',
        IOS: 'arn:aws:sns:eu-west-1:xxx'
    }
}
```

Last but not least, This service helps publishing messages to SNS devices or topics.

As a consequence, the `create`/`remove` operations have to be called with an `action` property indicating the target SNS operations among `device`, `topic`, `subscriptions` and `message`. The payload varies according to the selected target operation:
* `device`:
  * **device** as data: device object with SNS ARN and/or registration ID (i.e. token) for APNS or Firebase
* `topic`:
  * **pushObject** as params: target resource owing the topic
  * **pushService** as params: target resource service
  * **topicField** as data/query: target property to store the topic
* `subscriptions`
  * **pushObject** as params: target resource owing the topic
  * **users** as params: target subject(s) to subscribe to topic
  * **topicField** as data/query: target property to store the topic
* `message`
  * **pushObject** as params: target resource owing the topic if topic
  * **pushService** as params: target resource service
  * **message** as data: message payload

### Hooks

The following [hooks](./hooks.md) are executed on the `pusher` service:

```mermaid
graph TB
  before{"disallow('external')"}
  after{none after all}
  before -- Resource as data/params --> hook1(populatePushObject)
  hook1 -- Resource as params --> CREATE[CREATE]
  CREATE -- If user device --> CREATE_ENDPOINT[CREATE ENDPOINT]
  CREATE -- If resource topic --> CREATE_TOPIC[CREATE TOPIC]
  CREATE -- If subscriptions --> SUBSCRIBE[SUBSCRIBE]
  CREATE -- If message<br/>-device or topic- --> PUBLISH[PUBLISH]
  CREATE_ENDPOINT --> after
  CREATE_TOPIC --> PATCH[[PATCH RESOURCE<br/>-resource service-]]
  PATCH --> after
  SUBSCRIBE --> after
  PUBLISH --> after
  before -- Resource id as query/params --> hook2(populatePushObject)
  hook2 -- Resource as params --> REMOVE[REMOVE]
  REMOVE -- If user device --> REMOVE_ENDPOINT[REMOVE ENDPOINT]
  REMOVE -- If resource topic --> REMOVE_TOPIC[REMOVE TOPIC]
  REMOVE -- If subscriptions --> UNSUBSCRIBE[UNSUBSCRIBE]
  REMOVE_ENDPOINT --> after
  REMOVE_TOPIC --> PATCH[[PATCH RESOURCE<br/>-resource service-]]
  PATCH --> after
  UNSUBSCRIBE --> after
  before --> UPDATE[UPDATE]
  UPDATE -- If device --> UPDATE_ENDPOINT[UPDATE ENDPOINT]
  UPDATE_ENDPOINT --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
  classDef snsOperationClass fill:#63c5da,stroke:#333,stroke-width:2px
  class CREATE_ENDPOINT,CREATE_TOPIC,SUBSCRIBE,PUBLISH,REMOVE_ENDPOINT,REMOVE_TOPIC,UNSUBSCRIBE,UPDATE_ENDPOINT snsOperationClass
```

## Account service

::: tip
Available as a global service
:::

This service is powered by [feathers-authentication-management](https://github.com/feathersjs-ecosystem/feathers-authentication-management).

### Data model

This service consists in associating verification tokens to users so that they can safely reset their password or change their email, please refer to [feathers-authentication-management docs](https://github.com/feathersjs-ecosystem/feathers-authentication-management).

### Hooks

The following [hooks](./hooks.md) are executed on the `account` service:

```mermaid
graph TB
  before{none before all}
  after{none after all}
  before -- If reset/change password --> hook1(populateAccountUser)
  hook1 --> hook2(enforcePasswordPolicy)
  hook2 --> CREATE[CREATE]
  CREATE --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
```

### Testing

To make test run we need two gmail accounts:
* `email-notifications@kalisio.com` used as email sender
* `test@kalisio.com` used as user test email

> When testing identity change we also use the `test@kalisio.xyz` address as user test email. However to avoid creating a new account in Google you can simply add an alias for this address to the `test@kalisio.com` account.

The first email account is used by the [mailer service](./services.md#mailer-service) to send email notifications. The second email account requires OAuth2 authentication to be able to read emails using the GMail API. The simplest way is by creating a service account for a JWT-based authentication. Interesting issue to make all the configuration work can be found [here](https://stackoverflow.com/a/29328258), notably you have to delegate domain-wide authority to the service account in order to authorize your app to access user data on behalf of users and authorise the client ID of the service account with scopes `https://mail.google.com/,https://www.googleapis.com/auth/gmail.readonly`.

Standard OAuth2 with refresh token might also be used as detailed [here](https://medium.com/@pandeysoni/nodemailer-service-in-node-js-using-smtp-and-xoauth2-7c638a39a37e) and [here](https://medium.com/@pandeysoni/nodemailer-service-in-node-js-using-smtp-and-xoauth2-7c638a39a37e).

Details on how to use Google APIs from Node.js [here](https://github.com/google/google-api-nodejs-client#authorizing-and-authenticating).

> Some anti-virus or firewalls softwares intercept HTTPS traffic, decrypting it, and then encrypting it using a self-signed certificate causing a "*Self-Signed Certificate in Certificate Chain*" error. If so deactivate the SSL analysys in your software, [this might help](https://github.com/CawaMS/StorageExplorerTroubleshootingGuide/blob/master/se-troubleshooting-guide.md).


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
```js
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

```mermaid
graph TB
  before{none before all}
  after{none after all}
  before -- Subject service as data/params<br/>Resource as data/params --> hook1(populateSubjects)
  hook1 -- Authorisation subjects as params --> hook2(populateResource)
  hook2 -- Authorisation resource as params --> CREATE[CREATE]
  CREATE --> PATCH[[PATCH SUBJECT<br/>-subject service-]]
  PATCH --> after
  before -- Subject service as query/params<br/>Resource id as query/params --> hook3(populateSubjects)
  hook3 -- Authorisation subjects as params --> hook4(populateResource)
  hook4 -- Authorisation resource as params --> REMOVE[REMOVE]
  REMOVE --> PATCH[[PATCH SUBJECT<br/>-subject service-]]
  PATCH --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
```

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

```mermaid
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
```

## Storage service

::: tip
Available as a global and a contextual service
:::

::: warning
From the client side and even if most of the methods are available, we higly recomment to use the helper functions provide by the storage singleton.
:::

Blobs can be created directly using this service or through "attachment" to a target resource (e.g. a user).

This service relies on [feathers-s3](https://github.com/kalisio/feathers-s3)

### Data model

No data model, data are directly stored on target storage backend.

### Hooks

The following [hooks](./hooks.md) are executed on the `storage` service:

```mermaid
graph TB
  before{none before all}
  after{none after all}
  before --> FIND[FIND]
  FIND --> after
  before --> GET[GET]
  GET --> after  
  before --> CREATE[CREATE]
  CREATE --> after
  before --> hook5(disallow)
  hook5 --> UPDATE[UPDATE]
  UPDATE --> after
  before --> hook6(disallow)
  hook6 --> PATCH[PATCH]
  PATCH --> after
  before --> REMOVE[REMOVE]
  REMOVE --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
```

## Import-Export service

::: tip
Available as a global service
:::

::: warning
`create` methods are the only one allowed from the client side
:::

This service relies on [feathers-import-export](https://github.com/kalisio/feathers-import-export) library.

::: info
The `import-export` service instanciantes its own **S3** service to avoid mixing temporary objects with the objects you want to manage with the [Storage service](#storage-service)
:::

### Data model

No data model, data are directly stored on a storage backend (i.e. AWS S3).

### Hooks

```mermaid
graph TB
  before{none before all}
  after{none after all}
  before --> hook1(disallow)
  hook1 ---> FIND[FIND]
  FIND --> after
  before --> hook2(disallow)
  hook2 ---> GET[GET]
  GET --> after  
  before --> CREATE[CREATE]
  CREATE --> after
  before --> hook3(disallow)
  hook3 --> UPDATE[UPDATE]
  UPDATE --> after
  before --> hook4(disallow)
  hook4 --> PATCH[PATCH]
  PATCH --> after
  before --> hook5(disallow)
  hook5 ---> REMOVE[REMOVE]
  REMOVE --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
```

::: tip
For performance issues, we do not recommend to install after/before hooks to trasnform the data before importing/exporting. You can install your own [transaformation functions](https://github.com/kalisio/feathers-import-export#transform-function).
:::

## Databases service

::: tip
Available as a global service
:::

This service is powered by [feathers-mongodb-management](https://github.com/feathersjs-ecosystem/feathers-mongodb-management). It acts as a proxy to perform MongoDB operations like creating databases, collections or users.

::: warning
Service methods are only allowed from the server side
:::

### Hooks

The following [hooks](./hooks.md) are executed on the `databases` service:

```mermaid
graph TB
  before{"disallow('external')"}
  after{none after all}
  before --> FIND[FIND]
  FIND --> after
  before --> CREATE[CREATE]
  CREATE --> after
  before --> REMOVE[REMOVE]
  REMOVE --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,CREATE,REMOVE operationClass
```

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
```js
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

```mermaid
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
  hook1 -- Updated authorization<br/>scopes on members --> after
  before --> PATCH[PATCH]
  PATCH --> hook2("updateOrgResource('groups')")
  hook2 -- Updated authorization<br/>scopes on members --> after
  before --> REMOVE[REMOVE]
  REMOVE --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
```

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
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://www.kalisio.xyz/schemas/settings.update.json#",
  "title": "schemas.UPDATE_SETTINGS_TITLE",
  "type": "object",
  "properties": {
    "x": {
      "type": "string", 
      "field": {
        "component": "form/KTextField",
        "helper": "schemas.X_FIELD_LABEL"
      }
    }
  },
  "required": ["x"]
}

```