# Services

## Users

### [users](./services/users.md)

Manages user accounts including profile data, password hashing, password policy enforcement, and ability cache updates. Emits a `logout` event on removal.

## Account

### [account](./services/account.md)

Powered by [feathers-authentication-management](https://github.com/feathersjs-ecosystem/feathers-authentication-management). Handles email verification, password reset, and identity change workflows with transactional email notifications.

## Authorisations

### [authorisations](./services/authorisations.md)

Manages role-based permissions by associating resources with subjects. Uses an LRU cache for computed CASL abilities and patches subject scopes on create/remove.

## Mailer

### [mailer](./services/mailer.md)

Powered by [feathers-mailer](https://github.com/feathersjs-ecosystem/feathers-mailer). Proxies transactional email delivery through an SMTP server. Server-side only.

## Push

### [push](./services/push.md)

Powered by [feathers-webpush](https://github.com/kalisio/feathers-webpush). Manages Web Push subscriptions and dispatches push notifications. Automatically cleans up expired subscriptions after each notification.

## Storage

### [storage](./services/storage.md)

Powered by [feathers-s3](https://github.com/kalisio/feathers-s3). Provides S3-backed object storage for blobs and resource attachments. Available as a global and contextual service.

## Import-Export

### [import-export](./services/import-export.md)

Powered by [feathers-import-export](https://github.com/kalisio/feathers-import-export). Enables bulk data import and export via S3. Only `create` is allowed from the client side.

## Databases

### [databases](./services/databases.md)

Powered by [feathers-mongodb-management](https://github.com/feathersjs-ecosystem/feathers-mongodb-management). Proxies MongoDB administrative operations (databases, collections, users). Server-side only.

## Tags

### [tags](./services/tags.md)

Manages contextual tags with fuzzy and diacritic-insensitive search. Enforces name uniqueness and propagates tag updates to all tagged resources via `reflectTagUpdate`.

## Configurations

### [configurations](./services/configurations.md)

Stores named configuration objects (`{ name, value }`) for client-editable application settings. Available as a global and contextual service.

## Messages

### [messages](./services/messages.md)

Manages contextual messages with full-text fuzzy search across title, body, and author. Timestamps are set and maintained automatically.

## Local settings

### [local-settings](./services/local-settings.md)

Client-side service that bridges Feathers service interface with `localStorage` and the [global store](./application.md#store). Must be instantiated at application level.
