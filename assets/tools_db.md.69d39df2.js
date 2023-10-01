import{_ as e,o,c as a,Q as t}from"./chunks/framework.70a39c86.js";const _=JSON.parse('{"title":"Database tools","description":"","frontmatter":{},"headers":[],"relativePath":"tools/db.md","filePath":"tools/db.md"}'),r={name:"tools/db.md"},s=t('<h1 id="database-tools" tabindex="-1">Database tools <a class="header-anchor" href="#database-tools" aria-label="Permalink to &quot;Database tools&quot;">​</a></h1><h2 id="mongodb" tabindex="-1"><a href="https://www.mongodb.com/" target="_blank" rel="noreferrer">MongoDB</a> <a class="header-anchor" href="#mongodb" aria-label="Permalink to &quot;[MongoDB](https://www.mongodb.com/)&quot;">​</a></h2><h3 id="gui" tabindex="-1">GUI <a class="header-anchor" href="#gui" aria-label="Permalink to &quot;GUI&quot;">​</a></h3><p>As it offers a similar user experience than Mongo Atlas we prefer to use <a href="https://www.mongodb.com/try/download/compass" target="_blank" rel="noreferrer">Compass</a>.</p><p>We previously also used <a href="https://robomongo.org/" target="_blank" rel="noreferrer">Robo 3T</a>.</p><h3 id="useful-commands" tabindex="-1">Useful commands <a class="header-anchor" href="#useful-commands" aria-label="Permalink to &quot;Useful commands&quot;">​</a></h3><p>Export a given collection from a given DB using a query in a JSON file: <code>mongoexport -d krawler-test -c world_cities_csv -q &quot;{ &#39;properties.country&#39;: &#39;France&#39; }&quot; --jsonArray --out file.json</code></p><p>Export a given collection from a given DB using a query in a CSV file: <code>mongoexport -d krawler-test -c world_cities_csv -q &quot;{ &#39;properties.country&#39;: &#39;France&#39; }&quot; --type csv --fields properties.country,properties.pop --out file.csv</code></p>',8),n=[s];function l(i,c,d,p,u,m){return o(),a("div",null,n)}const f=e(r,[["render",l]]);export{_ as __pageData,f as default};