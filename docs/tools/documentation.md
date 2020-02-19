# Documentation

## Generating the doc

The approach we have adopted rely on: 
* [VuePress](https://vuepress.vuejs.org/) to generate the static web site
* the **VuePress** plugin [pwa](https://vuepress.vuejs.org/plugin/official/plugin-pwa.html) to enable the site to be refreshed when the content changed 
* our own [theme](https://github.com/kalisio/vuepress-theme-kalisio). This theme overides the **VuePress** default theme in adding the Kalisio logo instead of the Adds.

### Install VuePress

You first need to add the dependencies in the project:

```bash
$yarn add -D vuepress
$yarn add -D http://github.com/kalisio/vuepress-theme-kalisio#1.3.0
```

And then add the documentation generation scripts to the `package.json` file:

```json
"scripts": {
  "docs:dev": "vuepress dev docs",
  "docs:build": "vuepress build docs"
}
```

Create the following directory structure to store the **VuePress** stuff:

```
docs/
|_ .vuepress/
|    |_ public/
|    |    |_ manifest.json
|    |_ config.js
|_ assets/
|_ package.json
|_ README.md
|....
```

* `.vuepress` stores the **VuePress** configuration.
* `assets` stores the resources (images, diagrams...) you want to use in your documentation. 
* `README.md` is the entry point of your documentation. 
* `package.json` is the Node.js entry point to build the documentation. The file must have the following content:

<<< @/package.json

::: tip
The structure follows the **VuePress** directory structure and more information can be found [here](https://vuepress.vuejs.org/guide/directory-structure.html)
:::

### Configure VuePress

Edit the `config.js` to configure **VuePress**. We usually have this kind of configuration:

<<< @/.vuepress/config.js

### Write the documentation

Here are few tips to know when writing the documentation:
* Pages structure: the pages should match the navigation structure you have defined in the `config.js` file.
* Handling assets: you can simply refer to the asset using relative URLs. Please refer to the [Asset Handling](https://vuepress.vuejs.org/guide/assets.html#relative-urls) page to know more.
* Take advantage of [Markdown extensions](https://vuepress.vuejs.org/guide/markdown.html#header-anchors)

### Deploy the documentation to the gh-pages

Add the following lines to your `.travis.yml` file:

```yaml
  - stage: DOCS
    language: node_js
    node_js:
    - '8'
    install: true
    script:
    - cd docs && yarn install && yarn build
    deploy:
      provider: pages
      local-dir: docs/.vuepress/dist
      skip-cleanup: true
      github-token: $GITHUB_TOKEN  
      keep-history: true
      on:
        branch: master
```

::: tip
You must set the secure variable `GITHUB_TOKEN` in your Travis CI project settings
:::


## Working with diagrams

We use two distinct tools to work with diagrams:
* [draw.io](http://draw.io)] a complete editor to create well known diagrams
* [mermaid](https://github.com/knsv/mermaid) which allows you to generate diagrams from a simple text definition. We mainly use mermaid to create the hooks diagrams.

To be able to include the diagrams within the documentation, we adopted the following methodology:

### Draw.io

1. make it with [draw.io](http://draw.io) and store it in this folder
2. export it as SVG/PNG in the root **assets** folder
3. reference it in the documentation using a link like this `![My legend](https://raw.githubusercontent.com/kalisio/kdk/master/images/my-diagram.png)`

### mermaid

1. install the [mermaid CLI](https://github.com/mermaidjs/mermaid.cli)
2. start from the [hooks diagram template file](./hooks-diagram-template.mmd)
3. output the SVG/PNG file in the root **assets** folder using `mmdc -i ./my-hooks-diagram.mmd -t neutral -b transparent -o my-hooks-diagram.svg`
4. reference it in the documentation using a link like this `![My legend](https://raw.githubusercontent.com/kalisio/kdk/master/images/my-diagram.png)`

The template looks like this:
![Hooks Diagram Template](../assets/hooks-diagram-template.png)