# Data model-oriented view of the architecture

> According to the [Feathers philosophy](https://docs.feathersjs.com/guides/about/philosophy.html) each data model is manipulated using a [service interface](https://docs.feathersjs.com/api/services.html) to perform [CRUD operations](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) of the [persistence layer](https://docs.feathersjs.com/api/databases/common.html). So this data model-oriented view is a service-oriented view in the same manner.

Because data models internally rely on [JSON](http://www.json.org/) they are by nature hierarchical. In the following diagrams each nested JSON object is represented as a smaller *bubble* in a bigger *bubble* (the nesting/parent object), the data model instance being the root JSON object or the *biggest* bubble. The name of the bubble is the name of the nesting object property owing the nested object.

Data models are dynamic by nature, allowing any plugin to add custom fields whenever required using [hooks](https://docs.feathersjs.com/api/hooks.html). Each data model includes an implicit [ObjectID](https://mongodb.github.io/node-mongodb-native/api-bson-generated/objectid.html) `_id` field provided by the database. 

## User data model

The common properties of a user are described by the following data model:

![User data model](https://rawgit.com/kalisio/kdk/master/images/User%20Data%20Model%20Diagram.svg)

The details of each property are the following:
* **email** : user e-mail used as an internal unique ID
* **password** : hashed user password
* **locale** : user locale when registering
* **previousPasswords** : hashed user password history if [password policy has been enabled](../guides/BASICS.MD#configuring)
* **profile** : user profile information including name
* **provider** : user profile information for associated provider, e.g. `google`
* **scope** : user permissions for associated scope, e.g. `groups`
* **tags** : user affected tags if any
* **devices** : user mobile devices if any, each time the user uses a new device it is registered

## Organization data model

The common properties of an organization are described by the following data model:

![Organization data model](https://rawgit.com/kalisio/kdk/master/images/Organization%20Data%20Model%20Diagram.svg)

This data model is manipulated through the [Organization API](../api/kTeam/SERVICES.MD).

The details of each property are the following:
* **name**: the name of the organisation
* **topics**: the ARN of associated SNS topics for each platform used to publish messages to organisation' members

> the organization ObjectID is used as the internal DB name

## Group data model

The properties of a group object are described by the following data model:

![Group data model](https://rawgit.com/kalisio/kdk/master/images/Group%20Data%20Model%20Diagram.svg)

This data model is manipulated through the [Group API](../api/kTeam/SERVICES.MD).

The details of each property are the following:
* **name**: the name of the group
* **description**: the description of the group
* **topics**: the ARN of associated SNS topics for each platform used to publish messages to group' members

## Tag data model

The properties of a tag object are described by the following data model:

![Tag data model](https://rawgit.com/kalisio/kdk/master/images/Tag%20Data%20Model%20Diagram.svg)

This data model is manipulated through the [Tag API](../api/kCore/SERVICES.MD).

The details of each property are the following:
* **scope**: the scope of the tag (i.e. category), e.g. `skill`
* **value**: the value of the tag, e.g. `developer`
* **count**: the number of tagged objects
* **context**: the ID of the associated context object providing this tag if any (e.g. the organisation)
* **topics**: the ARN of associated SNS topics for each platform used to publish messages to tagged objects
