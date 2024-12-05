### ** Work In Progress **


# Create a new service
Start creating a folder with service name in ``/services`` and create your service inside

>
> By convention the name of the file will be formated like : serviceName.service.js

You can also create a hook file to define custom hook for the service as the same format


This service file contain all your custom method

```
export default async function (name, app, options) {
  return {
    async createMessage (message) {
      await this.create(message)
    },
    
    async otherMethod () {
      ...
    },
  }
}
```



## Create data model
Create your model in ``/src/models`` formated like ``serviceName/model.mongodb.js``

Example:
```
export default function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('message')
  options.Model.createIndex({ createdAt: -1 })
  options.Model.createIndex({ description: 1 }, { name: 'description-en', collation: { locale: 'en', strength: 1 } })
  options.Model.createIndex({ description: 1 }, { name: 'description-fr', collation: { locale: 'fr', strength: 1 } })
}

```


## Configure your new service

In the service.js file import and declare your service

``` 
import path from 'path'
import { fileURLToPath } from 'url'
import kdkCore from '@kalisio/kdk/core.api.js'

//For autoloading service and model in service setup
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const modelsPath = path.join(__dirname, 'models')
const servicesPath = path.join(__dirname, 'services')

export default async function () {
  const app = this
  
  try {
    // Set up services  
    const messageService = await app.createService('message', {
      modelsPath,
      servicesPath,
      methods: ['find', 'get', 'create', 'update', 'patch', 'remove', 'createMessage'],
      events: ['event-closed', 'event-reopened']
    })

    messageService.on('createMessage', async event => {
      await eventsService.createMessage(event)
    })

    await app.configure(kdkCore)

  } catch (error) {
    app.logger.error(error.message)
  }
}

```


## Structure example :
```
├── src
│  ├── models
│  │  ├── messages.model.mongodb.js
│  ├── services
│  │  ├── messages
│  │  │  ├── messages.hooks.js
│  │  │  ├── messages.service.js
│  ├── service.js
  ...    
```
