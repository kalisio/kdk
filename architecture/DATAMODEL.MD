# Data model-oriented view of the architecture

> According to the [Feathers philosophy](https://docs.feathersjs.com/guides/about/philosophy.html) each data model is manipulated using a [service interface](https://docs.feathersjs.com/api/services.html) to perform [CRUD operations](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) of the [persistence layer](https://docs.feathersjs.com/api/databases/common.html). So this data model-oriented view is a service-oriented view in the same manner.

Because data models internally rely on [JSON](http://www.json.org/) they are by nature hierarchical. In the following diagrams each nested JSON object is represented as a smaller *bubble* in a bigger *bubble* (the nesting/parent object), the data model instance being the root JSON object or the *biggest* bubble. The name of the bubble is the name of the nesting object property owing the nested object.

## User data model

The common properties of a user are described by the following data model:

![User data model](https://cdn.rawgit.com/kaelia-tech/kDocs/dd539860d68c90689b3b773cba20a2f53fae23cf/images/User%20Data%20Model%20Diagram.svg)

The details of each property are the following:
* **email** : user e-mail used as an internal unique ID

## Organization data model

The common properties of an organization are described by the following data model:

![Organization data model](https://cdn.rawgit.com/kaelia-tech/kDocs/6fe6c318fab3f6db2af68a6e83ef56a0efacaa06/images/Organization%20Data%20Model%20Diagram.svg)

This data model is manipulated through the [Organization API](https://kaelia-tech.gitbooks.io/kDocs/api/ORGANIZATION.html).

The details of each property are the following:
* **name**: the name of the organization used as an internal unique ID

## Group data model

The properties of a group object are described by the following data model:

![Group data model](https://cdn.rawgit.com/kaelia-tech/kDocs/b1b2d612dcea10ef9f9efcd445dc3f73def21b52/images/Group%20Data%20Model%20Diagram.svg)

This data model is manipulated through the [Organization API](https://kaelia-tech.gitbooks.io/kDocs/api/ORGANIZATION.html#group-api).
