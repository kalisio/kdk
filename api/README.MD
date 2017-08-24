# API

These sections detail the external (i.e. REST/Websocket) as well as the internal (ie Classes/Functions) [API](https://en.wikipedia.org/wiki/Application_programming_interface) of Weacast.

> **All dates/times in Kalisio are managed as [moment](https://momentjs.com) objects and expressed in [UTC](https://en.wikipedia.org/wiki/Coordinated_Universal_Time).**

* kCore
  * [Services](/api/kCore/SERVICES.MD)
  * [Application](/api/kCore/APPLICATION.MD)
  * [Hooks](/api/kCore/HOOKS.MD)
  * Client
    * [Components](/api/kCore/COMPONENTS.MD)
    * [Mixins](/api/kCore/MIXINS.MD)
* kTeam
  * [Services](/api/kTeam/SERVICES.MD)
  * [Hooks](/api/kTeam/HOOKS.MD)
  * Client
    * [Components](/api/kTeam/COMPONENTS.MD)
    * [Mixins](/api/kTeam/MIXINS.MD)
  
## Testing

You will find [here](./Kalisio.postman_collection.json) a collection of ready-to-go REST requests to test the API with the great [POSTMAN](https://www.getpostman.com/) tool. Simply download it and import it in your POSTMAN installation.

You should do the following:
1. make your Kalisio installation run (the collection is configured for default dev port `8080` but you can easily switch to `8081` for production mode for instance or any other)
2. use the authenticate request with a registered user e-mail/password to retrieve an authorization token
3. set this token in the header of other requests in order to be authorized to perform the request
4. renew your token when expired (step 2)
