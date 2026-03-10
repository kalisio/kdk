# Users service

::: tip
Available as a global service
:::

## Overview

Manages user accounts, including creation, profile updates, and password management. Emits a `logout` event when a user is removed. Integrates with the password policy and abilities system.

## Data model

The data model of a user as used by the API is [detailed here](../../../architecture/data-model-view.md#user-data-model).

## Hooks

The following [hooks](../hooks.md) are executed on the `users` service:

```mermaid
graph TB
  beforeAll{none before all}
  afterAll{after all}
  afterAll --> hook1("discard('password')")
  hook1 -- Sensitive fields removed --> hook2("discard('previousPasswords')")
  hook2 -- Previous passwords removed --> hook3(discardAuthenticationProviders)
  hook3 -- Auth providers removed --> DONE(((done)))
  beforeAll --> FIND[FIND]
  FIND --> afterAll
  beforeAll --> GET[GET]
  GET --> afterAll
  beforeAll --> hook4("serialize('profile')")
  hook4 -- Email/Name set in profile --> hook5("serialize('clearPassword')")
  hook5 -- Clear password saved --> hook6(hashPassword)
  hook6 -- Password hashed --> hook7(enforcePasswordPolicy)
  hook7 -- Clear password validated --> hook8("discard('clearPassword')")
  hook8 -- Clear password removed --> CREATE[CREATE]
  CREATE --> hook9(updateAbilities)
  hook9 -- Abilities initialized in cache --> afterAll
  beforeAll --> hook10(populatePreviousObject)
  hook10 -- Previous user as params --> hook11(storePreviousPassword)
  hook11 -- Previous password list updated --> UPDATE[UPDATE]
  UPDATE --> hook12(updateAbilities)
  hook12 --> afterAll
  beforeAll --> hook13(populatePreviousObject)
  hook13 -- Previous user as params --> hook14(storePreviousPassword)
  hook14 -- Previous password list updated --> PATCH[PATCH]
  PATCH --> hook15(updateAbilities)
  hook15 --> hook16(sendNewSubscriptionEmail)
  hook16 -- Email sent if new subscription --> afterAll
  beforeAll --> REMOVE[REMOVE]
  REMOVE --> afterAll
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9,hook10,hook11,hook12,hook13,hook14,hook15,hook16 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
```

::: tip
The `discard`, `hashPassword`, `serialize`, `populatePreviousObject`, and `storePreviousPassword` hooks are only applied when the relevant features (local authentication, password policy) are enabled.
:::

::: tip
The `discard('password')` and related hooks in `after.all` are only applied when the request comes from an external provider (i.e. a client request), keeping password fields accessible internally.
:::
