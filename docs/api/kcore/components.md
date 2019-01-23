# Components

## Activity

An **activity** is the entry point used in applications for interacting with the user using business specific components. It usually represents a single screen with a user interface. For example, an email app might have one activity that shows a list of new emails, another activity to compose an email, and another activity for reading emails. Although the activities work together to form a cohesive user experience in the email app, each one is independent of the others as much as possible. As such, you should be able to start any one of these activities within the application or from an external application by activating a given [route](https://router.vuejs.org/) (i.e. link/URL).

There is no generic activity component within the core module because activities are usually business/domain-specific components (you might find a lot of them in others modules or in applications). However, it facilitates the interactions between activities and application as you will see hereafter.

## Layout

The basic application layout rely on [Material Design](https://material.io/), as illustred in our [Akt'n'Map](https://github.com/kalisio/aktnmap) application, and is the following:

![Akt'n'Map layout](../../assets/aktnmap-layout.png)

The layout is flexible enough to only use part of it like e.g. the [Kano](https://github.com/kalisio/kano) application which is a map-centered UI with the following layout:

![Kano layout](../../assets/kano-layout.png)

The **k-layout** component based on [QLayout](https://quasar-framework.org/components/layout.html) contains the elements that wrap application's content:
* **k-app-bar**: application bar shown on top of the page - can be overriden using the *header* slot
* **k-side-nav** : a left side navigation panel (which is shown alongside page content on wide screens) - can be overriden using the *left* slot
* **k-right-panel** : a right side panel (which can be shown alongside page content on wide screens) - can be overriden using the *right* slot
* **k-tab-bar**: a navigation with [QTabs](https://quasar-framework.org/components/tabs.html) - can be overriden using the *navigation* slot
* **k-fab**: an action button based on a [Quasar Floating Action Button](https://v0-14.quasar-framework.org/components/floating-action-button.html) at the bottom right corner of the page
* **k-search-bar**: a global search bar
* the embedded content of the page (i.e. the **Activity**) as a [router-view](https://router.vuejs.org/api/#router-view)

::: tip
The application layout is usually wrapped using the **k-home** component that simply load it depending on the authentication state of the user.
:::

Some layout components are fixed for the entire application lifecycle, as such they read their own setup from the [application configuration](../../guides/basics/step-by-step.md#frontend-side): layout, home, side navigation.

Some components are more dynamic and support to be updated depending on the current activity of the user: application bar, tab bar search bar, right panel, FAB. In this case the configuration is read from the [global store](./application.md#store) and any change watched to keep the components in sync.

## Collections

Most activities are used to list, search, edit (i.e. update) and remove data model items. To avoid a lot of boilerplate code the KDK provides you with built-in components to manage item collections either as list or grid as shown below:

![Item collections](../../assets/item-collections.png)

### List

### Grid


## Forms and editors





