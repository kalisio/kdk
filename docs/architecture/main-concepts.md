# Main concepts

## Organisation model

Organisations are the basic elements that permit to create and configure teams (i.e. **groups** of users) and invite others to join and share content. Organisations are shared workspaces where users can collaborate using a set of services only available **within the context** of the organisation.

### Data segregation

KDK implements an extreme solution to segregate data at the source: using different databases. This means that dedicated databases   (respectively services) are created to hold (respectively to manage) the contextual assets when organisations are made available, and simply destroyed when they are not anymore.

> Under the hood the [feathers-mongodb-management](https://github.com/feathersjs-ecosystem/feathers-mongodb-management) module is used to dynamically create/remove a database per organisation whenever required

Using the KDK you can dynamically declare services to access organisation assets stored in this segregated DB.

### Permissions

Organisation owners can manage member access to an organisation with a pre-defined set of permissions based on [Attribute Based Access Control](https://en.wikipedia.org/wiki/Attribute-based_access_control) (ABAC), which allows to enforce authorization decisions based on any attribute accessible to the application and not just the user's role. Similarly, resource owners can manage member access to a given resource (e.g. a **group**).

All permissions are stored along with the user so that they are always available once authenticated. They are organised by resource types (what we call *scopes*). The **authorisation service** allow to:
1. add, respectively remove, a set of **permissions** (e.g. being a owner or a manager)
2. for a subject (i.e. a **user** in most case but it could be generalized)
3. on a resource (e.g. an **organisation** or a **group**).

> Under the hood the [CASL](https://stalniy.github.io/casl/) module is used to manage the permissions

## Domain model

The **domain model** is a set of high-level abstractions that describes selected aspects of a sphere of activity, it is a representation of meaningful real-world concepts pertinent to the domain that are modeled in the software. The concepts include the data involved in the business and rules the business uses in relation to that data.

The class diagram used to represent the domain model in the [Unified Modeling Language](https://en.wikipedia.org/wiki/Unified_Modeling_Language) (UML) is presented afterwards. The Kalisio domain model is implemented as a hybridation between [objects](https://en.wikipedia.org/wiki/Object-oriented_programming) and [cross-cutting concerns](https://en.wikipedia.org/wiki/Aspect-oriented_software_development) within a layer that uses a lower-level layer for [persistence](./DATAMODEL.MD) and *publishes* an [API](../api/README.MD) to a higher-level layer to gain access to the data and behavior of the model. 

![Domain model](https://rawgit.com/kalisio/kdk/master/images/Domain%20Model%20Diagram.svg)

To get into the details of this model look at the [persisted data model](./DATAMODEL.MD) and the provided [API](../api/README.MD).

