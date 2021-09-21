# Testing your app

The **KDK** relies on a [Mocha](https://mochajs.org/) testing framework and  the [Chai](https://www.chaijs.com/) assertion library. 

## API


## Client

In addition to **Mocha** and **Chai**, the **KDK** provides helper functions to test your UI using [Puppeteer](https://github.com/puppeteer/puppeteer).

### Key concepts

The **KDK** provides you with some capabilities to easily:

* test your UI components: the **Runner class** allows you to manage a **Puppereer** browser as well as the default page attached to this browser. In addition, it provides a useful inteface to override permissions, set items in local storage, catch warnings and error messages from the console, take screenshots and compare them to some reference images. 

* deal with your app's API: the **Api class** allows you to access the differents services exposed by the API.

* structure your project test structure: the **KDK** assumes that a directory has been assigned to each **test suite** in order to store test data. These directories, are stored in a more general `data` directory and must be named with the **test suite** name. If you have any screenshot references then then they must stored in a decidacted sub directory named `screenrefs`.

```bash
test
|_ data 
|   |_ suite#1
|   |_ suite#2
|       |_ screenrefs
|   |_ suite#3
|       |_ screenrefs
|_ suite1.test.js
|_ suite2.test.js
|_ suite3.test.js
```

When running the test data are generally generated in order to be compared to the static test data. The **Runner** creates a `run` directory where it stores for the browser (e.g. chrome, firefox) the data for each **test suite**. For instance:

```bash
test
|_run
|   |_ chrome
|       |_ suite#1
|       |_ suite#2
|       |_ suite#3
```

::: tip 
The **Runner** clears its corresponding **test suite** run directory each time you run it.
::: 

### Core

#### Runner

In pratice, a **Runner** instance has to be created in each **test suite**. You should declare the **Runner** in the **before** hook as well as starting. Starting the **Runner** creates the **Puppeteer Browser** and the default page. Obviously, you should stop the **Runner** which causes the Puppeteer Browser to be closed in the **after** hook.

```js
import { core } from '@kalisio/kdk/test.client'

const suite = 'my-suite'

describe(suite, () => {
  let runner
  let page

  before(async () => {
    runner = new core.Runner(suite, { browser: { args: ['--lang=fr'] })
    page = await runner.start()
  })

  it('my-test', async () => {
    ....
  })

  after(async () => {
    await runner.stop()
  })
})
```

### Map



