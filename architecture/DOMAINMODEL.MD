# Main concepts

## Organization model

**TODO**

# Domain model

The **domain model** is a set of high-level abstractions that describes selected aspects of a sphere of activity, it is a representation of meaningful real-world concepts pertinent to the domain that are modeled in the software. The concepts include the data involved in the business and rules the business uses in relation to that data.

The class diagram used to represent the domain model in the [Unified Modeling Language](https://en.wikipedia.org/wiki/Unified_Modeling_Language) (UML) is presented afterwards. The Kaelia domain model is implemented as a hybridation between [objects](https://en.wikipedia.org/wiki/Object-oriented_programming) and [cross-cutting concerns](https://en.wikipedia.org/wiki/Aspect-oriented_software_development) within a layer that uses a lower-level layer for [persistence](./DATAMODEL.MD) and *publishes* an [API](../api/README.MD) to a higher-level layer to gain access to the data and behavior of the model. 

![Domain model](https://cdn.rawgit.com/kaelia-tech/kDocs/a42079d56e205877c4e1b83c9ad5b5f270116fbe/images/Domain%20Model%20Diagram.svg)

To get into the details of this model look at the [persisted data model](./DATAMODEL.MD) and the provided [API](../api/README.MD).

