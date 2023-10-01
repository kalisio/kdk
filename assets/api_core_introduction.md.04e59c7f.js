import{_ as s,o as n,c as a,Q as e}from"./chunks/framework.70a39c86.js";const m=JSON.parse('{"title":"Overview","description":"","frontmatter":{},"headers":[],"relativePath":"api/core/introduction.md","filePath":"api/core/introduction.md"}'),o={name:"api/core/introduction.md"},t=e(`<h1 id="overview" tabindex="-1">Overview <a class="header-anchor" href="#overview" aria-label="Permalink to &quot;Overview&quot;">​</a></h1><p>The core module includes basic features to create a backend <a href="./application.html">application</a> and related <a href="./services.html">services</a> for e.g. <a href="./services.html#users-service">users management</a>, <a href="./services.html#database-service">database</a>, <a href="./services.html#storage-service">storage</a> management, ...</p><p>The core module also includes basic features to create a frontend application: services access layer (mainly based on <a href="./mixins.html">mixins</a>), <a href="./components.html">authentication components</a>, <a href="./components.html#layout">application layout</a>, <a href="./components.html#collections">item collection components</a>, <a href="./components.html#forms-and-editors">form and editor components</a>.</p><h2 id="utilities" tabindex="-1">Utilities <a class="header-anchor" href="#utilities" aria-label="Permalink to &quot;Utilities&quot;">​</a></h2><h3 id="functions" tabindex="-1">Functions <a class="header-anchor" href="#functions" aria-label="Permalink to &quot;Functions&quot;">​</a></h3><p>Here are a set of utility functions:</p><ul><li><strong>createQuerablePromise (promiseOrExecutor)</strong> modify a Promise by adding some status functions (<code>isFulfilled, isPending, isRejected</code>)</li><li><strong>getPaletteFromColor (color)</strong> convert from hexadecimal color value to color name in basic <a href="https://quasar.dev/style/color-palette" target="_blank" rel="noreferrer">Quasar palette</a></li><li><strong>getColorFromPalette (color)</strong> convert from color name in basic <a href="https://quasar.dev/style/color-palette" target="_blank" rel="noreferrer">Quasar palette</a> to color hexadecimal value</li><li><strong>getLocale ()</strong> find the current user&#39;s locale</li><li><strong>isEmailValid (email)</strong> emails validator</li><li><strong>isObjectID (id)</strong> ObjectID validator</li><li><strong>getIconName (object, path = &#39;icon.name&#39;)</strong> extract icon name from a given icon property on a given target object</li><li><strong>dotify (object)</strong> transform nested object to dot notation</li></ul><h3 id="store-objects" tabindex="-1">Store objects <a class="header-anchor" href="#store-objects" aria-label="Permalink to &quot;Store objects&quot;">​</a></h3><p>The <a href="./../core/application.html#store">global store</a> contains the following defaults objects:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">topPane</span><span style="color:#E1E4E8;">: { </span><span style="color:#B392F0;">content</span><span style="color:#E1E4E8;">: [current pane content], </span><span style="color:#B392F0;">mode</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;current pane mode&#39;</span><span style="color:#E1E4E8;">, </span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">: { curent content filter }, </span><span style="color:#B392F0;">visible</span><span style="color:#E1E4E8;">: current visibility state }</span></span>
<span class="line"><span style="color:#B392F0;">rightPane</span><span style="color:#E1E4E8;">: { </span><span style="color:#B392F0;">content</span><span style="color:#E1E4E8;">: [current pane content], </span><span style="color:#B392F0;">mode</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;current pane mode&#39;</span><span style="color:#E1E4E8;">, </span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">: { curent content filter }, </span><span style="color:#B392F0;">visible</span><span style="color:#E1E4E8;">: current visibility state }</span></span>
<span class="line"><span style="color:#B392F0;">bottomPane</span><span style="color:#E1E4E8;">: { </span><span style="color:#B392F0;">content</span><span style="color:#E1E4E8;">: [current pane content], </span><span style="color:#B392F0;">mode</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;current pane mode&#39;</span><span style="color:#E1E4E8;">, </span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">: { curent content filter }, </span><span style="color:#B392F0;">visible</span><span style="color:#E1E4E8;">: current visibility state }</span></span>
<span class="line"><span style="color:#B392F0;">page</span><span style="color:#E1E4E8;">: { </span><span style="color:#B392F0;">content</span><span style="color:#E1E4E8;">: [current page content], </span><span style="color:#B392F0;">mode</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;current pane mode&#39;</span><span style="color:#E1E4E8;">, </span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">: { curent content filter } }</span></span>
<span class="line"><span style="color:#B392F0;">window</span><span style="color:#E1E4E8;">: { </span><span style="color:#B392F0;">current</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;current widget&#39;</span><span style="color:#E1E4E8;">, </span><span style="color:#B392F0;">widgets</span><span style="color:#E1E4E8;">: [available widgets], </span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">: { curent widgets filter } }</span></span>
<span class="line"><span style="color:#B392F0;">fab</span><span style="color:#E1E4E8;">: { </span><span style="color:#B392F0;">actions</span><span style="color:#E1E4E8;">: [current actions], </span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">: { curent actions filter } }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">topPane</span><span style="color:#24292E;">: { </span><span style="color:#6F42C1;">content</span><span style="color:#24292E;">: [current pane content], </span><span style="color:#6F42C1;">mode</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;current pane mode&#39;</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">: { curent content filter }, </span><span style="color:#6F42C1;">visible</span><span style="color:#24292E;">: current visibility state }</span></span>
<span class="line"><span style="color:#6F42C1;">rightPane</span><span style="color:#24292E;">: { </span><span style="color:#6F42C1;">content</span><span style="color:#24292E;">: [current pane content], </span><span style="color:#6F42C1;">mode</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;current pane mode&#39;</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">: { curent content filter }, </span><span style="color:#6F42C1;">visible</span><span style="color:#24292E;">: current visibility state }</span></span>
<span class="line"><span style="color:#6F42C1;">bottomPane</span><span style="color:#24292E;">: { </span><span style="color:#6F42C1;">content</span><span style="color:#24292E;">: [current pane content], </span><span style="color:#6F42C1;">mode</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;current pane mode&#39;</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">: { curent content filter }, </span><span style="color:#6F42C1;">visible</span><span style="color:#24292E;">: current visibility state }</span></span>
<span class="line"><span style="color:#6F42C1;">page</span><span style="color:#24292E;">: { </span><span style="color:#6F42C1;">content</span><span style="color:#24292E;">: [current page content], </span><span style="color:#6F42C1;">mode</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;current pane mode&#39;</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">: { curent content filter } }</span></span>
<span class="line"><span style="color:#6F42C1;">window</span><span style="color:#24292E;">: { </span><span style="color:#6F42C1;">current</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;current widget&#39;</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">widgets</span><span style="color:#24292E;">: [available widgets], </span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">: { curent widgets filter } }</span></span>
<span class="line"><span style="color:#6F42C1;">fab</span><span style="color:#24292E;">: { </span><span style="color:#6F42C1;">actions</span><span style="color:#24292E;">: [current actions], </span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">: { curent actions filter } }</span></span></code></pre></div><blockquote><p>More details in the <a href="./components.html#layout">layout section</a></p></blockquote><h3 id="layout" tabindex="-1">Layout <a class="header-anchor" href="#layout" aria-label="Permalink to &quot;Layout&quot;">​</a></h3><p>Global object used to build the layout content:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { Layout } </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@kalisio/kdk/core.client&#39;</span></span>
<span class="line"><span style="color:#6A737D;">// Bind a UI configuration to a target component</span></span>
<span class="line"><span style="color:#E1E4E8;">Layout.</span><span style="color:#B392F0;">bindContent</span><span style="color:#E1E4E8;">([{</span></span>
<span class="line"><span style="color:#E1E4E8;">	id: </span><span style="color:#9ECBFF;">&#39;action&#39;</span><span style="color:#E1E4E8;">, icon: </span><span style="color:#9ECBFF;">&#39;las la-eye-dropper&#39;</span><span style="color:#E1E4E8;">, label: </span><span style="color:#9ECBFF;">&#39;MyActivity.ACTION_LABEL&#39;</span><span style="color:#E1E4E8;">, handler: </span><span style="color:#9ECBFF;">&#39;onAction&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">}], myComponent)</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> { Layout } </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@kalisio/kdk/core.client&#39;</span></span>
<span class="line"><span style="color:#6A737D;">// Bind a UI configuration to a target component</span></span>
<span class="line"><span style="color:#24292E;">Layout.</span><span style="color:#6F42C1;">bindContent</span><span style="color:#24292E;">([{</span></span>
<span class="line"><span style="color:#24292E;">	id: </span><span style="color:#032F62;">&#39;action&#39;</span><span style="color:#24292E;">, icon: </span><span style="color:#032F62;">&#39;las la-eye-dropper&#39;</span><span style="color:#24292E;">, label: </span><span style="color:#032F62;">&#39;MyActivity.ACTION_LABEL&#39;</span><span style="color:#24292E;">, handler: </span><span style="color:#032F62;">&#39;onAction&#39;</span></span>
<span class="line"><span style="color:#24292E;">}], myComponent)</span></span></code></pre></div>`,14),l=[t];function p(r,c,i,y,E,d){return n(),a("div",null,l)}const F=s(o,[["render",p]]);export{m as __pageData,F as default};