# Standard Diagrams

To generate them:
1. make it with [draw.io](http://draw.io) and store it in this folder
2. export it as SVG in the root **images** folder
3. reference it in the documentation using a link like this `![My legend](https://raw.githubusercontent.com/kalisio/kdk/master/images/my-diagram.svg)`

# Hooks Diagrams

To generate them:
1. intall the [mermaid CLI](https://github.com/mermaidjs/mermaid.cli)
2. start from the [hooks diagram template file](./hooks-diagram-template.mmd)
3. output the SVG file in the root **images** folder using `mmdc -i ./my-hooks-diagram.mmd -t neutral -b transparent -o my-hooks-diagram.svg`
4. reference it in the documentation using a link like this `![My legend](https://raw.githubusercontent.com/kalisio/kdk/master/images/my-diagram.svg)`

The template looks like this:
![Hooks Diagram Template](https://raw.githubusercontent.com/kalisio/kdk/master/images/hooks-diagram-template.png)
