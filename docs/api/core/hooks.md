# Hooks

## Query

### [hooks.query](./hooks/hooks.query.md)

Transforms and marshals query parameters before they reach the database adapter. Includes `marshallComparisonQuery`, `marshallTimeQuery`, `marshallSortQuery`, `marshallCollationQuery`, `marshallHttpQuery`, `aggregationQuery`, `populateObject`, `populateObjects` (and their `unpopulate` counterparts), and `diacriticSearch`.

## Model

### [hooks.model](./hooks/hooks.model.md)

Transforms data model items: type conversion (`processTimes`, `convertObjectIDs`, `convertDates`, `convertToJson`, `convertToString`), property moving (`serialize`), uniqueness enforcement (`checkUnique`), soft-delete (`setAsDeleted`), TTL (`setExpireAfter`), previous object capture (`populatePreviousObject`), field protection (`preventChanges`), and MongoDB `distinct` support.

## Service

### [hooks.service](./hooks/hooks.service.md)

Controls service-level behaviour: `skipEvents` to suppress real-time events, `rateLimit` for token-bucket request throttling, and `countLimit` for resource quota enforcement.

## Authentication

### [hooks.authentication](./hooks/hooks.authentication.md)

Authentication-related hooks: `hashPassword` (re-exported from `@feathersjs/authentication-local`) and `discardAuthenticationProviders` to strip third-party OAuth fields from responses.

## Authorisations

### [hooks.authorisations](./hooks/hooks.authorisations.md)

CASL-based access control: `populateSubjects`, `populateResource` (and their `unpopulate` counterparts), `authorise` (app-level access check with query constraint injection), `preventEscalation`, `updateAbilities` (ability cache refresh), and `createJWT`.

## Users

### [hooks.users](./hooks/hooks.users.md)

User-specific hooks: `onlyMe` and `isNotMe` access guards, `enforcePasswordPolicy`, `storePreviousPassword`, `generatePassword`, `sendVerificationEmail`, `addVerification`, and `removeVerification`.

## Tags

### [hooks.tags](./hooks/hooks.tags.md)

`reflectTagUpdate` — propagates tag name, color, or removal changes to all resources that reference the tag.

## Push

### [hooks.push](./hooks/hooks.push.md)

`disallowExternalPush` predicate and `sendNewSubscriptionEmail` — sends a security alert email when a push subscription from a new device fingerprint is detected.

## Storage

### [hooks.storage](./hooks/hooks.storage.md)

`removeAttachments` — removes S3-backed attachments (and their thumbnails) from the storage service when a resource is deleted.

## Logger

### [hooks.logger](./hooks/hooks.logger.md)

`log` — app-level hook that logs hook execution details at `debug` level and errors at `error` level, with full data/params/result in development mode.

## Schemas

### [hooks.schemas](./hooks/hooks.schemas.md)

`validateData` — validates `hook.data` items against a JSON Schema using AJV, filtering invalid items and throwing `BadRequest` on failure.
