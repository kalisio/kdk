import{_ as e,o,c as t,Q as a}from"./chunks/framework.70a39c86.js";const s="/kdk/assets/feathers-services.a3f5a8f5.png",r="/kdk/assets/operations-methods-events.1e9ce547.png",k=JSON.parse('{"title":"API","description":"","frontmatter":{},"headers":[],"relativePath":"api/introduction.md","filePath":"api/introduction.md"}'),n={name:"api/introduction.md"},i=a('<h1 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to &quot;API&quot;">​</a></h1><p>These sections details the available external (i.e. REST/Websocket) as well as the internal (i.e. Classes/Functions) <a href="https://en.wikipedia.org/wiki/Application_programming_interface" target="_blank" rel="noreferrer">API</a> within each module of the KDK. If you&#39;d like to check the detailed API of a given module please select it in the menu.</p><blockquote><p>Modules are published under the <code>@kalisio</code> namespace in NPM, e.g. <code>kdk</code> NPM package is named <code>@kalisio/kdk</code></p></blockquote><p>Each submodule, e.g. <code>core</code>, is internally broken into 3 different parts.</p><ul><li>client API (<code>client</code> folder in submodule folder) to be used within the browser and imported like this:</li></ul><p><code>import { xxx } from &#39;@kalisio/kdk/core.client&#39;</code></p><ul><li>common API (<code>common</code> folder in submodule folder) to be used within the browser or NodeJS and imported like this:</li></ul><p><code>import { xxx } from &#39;@kalisio/kdk/core.common&#39;</code></p><ul><li>backend API (all other files in submodule folder) to be used within NodeJS and imported like this:</li></ul><p><code>import { xxx } from &#39;@kalisio/kdk/core.api&#39;</code></p><h2 id="services" tabindex="-1">Services <a class="header-anchor" href="#services" aria-label="Permalink to &quot;Services&quot;">​</a></h2><p>On the client/server side each service API is exposed using the <a href="https://docs.feathersjs.com/api/client.html" target="_blank" rel="noreferrer">Feathers isomorphic API</a> and the <a href="https://docs.feathersjs.com/api/databases/querying.html" target="_blank" rel="noreferrer">Feathers common database query API</a>. Although only web sockets are usually used on the client side, both the <a href="https://docs.feathersjs.com/api/express.html" target="_blank" rel="noreferrer">REST</a> and the <a href="https://docs.feathersjs.com/api/socketio.html" target="_blank" rel="noreferrer">Socket</a> interfaces are configured.</p><p><img src="'+s+`" alt="Feathers Services"></p><p>KDK usually exposes the available items of a service (e.g. users) through the <code>items</code> (e.g. <code>users</code>) service. For example you can request the available users like this on the client side:</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> response </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">await</span><span style="color:#E1E4E8;"> api.</span><span style="color:#B392F0;">getService</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;users&#39;</span><span style="color:#E1E4E8;">).</span><span style="color:#B392F0;">find</span><span style="color:#E1E4E8;">({})</span></span>
<span class="line"><span style="color:#E1E4E8;">response.data.</span><span style="color:#B392F0;">forEach</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">user</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// Do something with the current user</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">let</span><span style="color:#24292E;"> response </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">await</span><span style="color:#24292E;"> api.</span><span style="color:#6F42C1;">getService</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;users&#39;</span><span style="color:#24292E;">).</span><span style="color:#6F42C1;">find</span><span style="color:#24292E;">({})</span></span>
<span class="line"><span style="color:#24292E;">response.data.</span><span style="color:#6F42C1;">forEach</span><span style="color:#24292E;">(</span><span style="color:#E36209;">user</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Do something with the current user</span></span>
<span class="line"><span style="color:#24292E;">})</span></span></code></pre></div><blockquote><p>Depending on the permissions set on the user by the application he might not have access to all items of the service.</p></blockquote><p>The following table illustrates the correspondance between REST operations, service methods and real-time events:</p><p><img src="`+r+'" alt="Feathers Services"></p><h2 id="hooks" tabindex="-1">Hooks <a class="header-anchor" href="#hooks" aria-label="Permalink to &quot;Hooks&quot;">​</a></h2><p>KDK modules provide a collection of <a href="https://docs.feathersjs.com/api/hooks.html" target="_blank" rel="noreferrer">hooks</a> to be used by modules or <a href="https://docs.feathersjs.com/api/client.html" target="_blank" rel="noreferrer">client applications</a>. They often rely on <a href="https://docs.feathersjs.com/api/hooks-common.html" target="_blank" rel="noreferrer">Feathers common hooks</a>.</p><blockquote><p><a href="https://docs.feathersjs.com/api/hooks.html" target="_blank" rel="noreferrer">Hooks</a> are the main way to introduce business logic into applications and modules so we recommend to understand them well first before reading this.</p></blockquote><p>Each service can include a set of <em>internal</em> <a href="https://docs.feathersjs.com/api/hooks.html" target="_blank" rel="noreferrer">hooks</a>, i.e. hooks required to make the service work. They are built-in with the service and cannot usually be removed.</p><p>Each module then exposes a set of <em>external</em> <a href="https://docs.feathersjs.com/api/hooks.html" target="_blank" rel="noreferrer">hooks</a> you can use to extend the capabilities of your application. They are not built-in with the services and are usually added or removed on-demand by your application. The main reason is that you must have control over the order of execution when mixing different hooks to best fit your application logic and avoid any side effect.</p><p>We try to organise hooks in different categories:</p><ul><li><em>query</em> for hooks targetting the processing of input query</li><li><em>data model</em> for hooks targetting the processing of output data</li><li><em>logs</em> for hooks targetting logging features</li><li><em>service</em> for hooks targetting generic service setup</li><li><em>schemas</em> for hooks targetting <a href="https://docs.feathersjs.com/api/schema/validators.html" target="_blank" rel="noreferrer">validation schemas</a></li></ul><p>Others hooks are usually service-centric and so attached to the target service.</p><h2 id="data-model" tabindex="-1">Data model <a class="header-anchor" href="#data-model" aria-label="Permalink to &quot;Data model&quot;">​</a></h2><p>Each service can declare a set of <em>perspectives</em>, which are not retrieved by default when querying the object(s), you will need to use <a href="https://docs.feathersjs.com/api/databases/querying.html#select" target="_blank" rel="noreferrer"><code>$select</code></a> to do so. A perspective is simply a field of the data model containing a nested object, like the <strong>profile</strong> field containing the user&#39;s profile information on the user data model.</p><blockquote><p>All dates/times in KDK are managed as date or <a href="https://momentjs.com" target="_blank" rel="noreferrer">moment</a> objects and expressed in <a href="https://en.wikipedia.org/wiki/Coordinated_Universal_Time" target="_blank" rel="noreferrer">UTC</a>.</p></blockquote><h2 id="client" tabindex="-1">Client <a class="header-anchor" href="#client" aria-label="Permalink to &quot;Client&quot;">​</a></h2><p>KDK modules provide a collection of reusable <em>mixins</em> and <em>components</em> to be used by modules or applications.</p><p><a href="https://vuejs.org/v2/guide/mixins.html" target="_blank" rel="noreferrer">Mixins</a> are a flexible way to distribute reusable functionalities for <a href="https://vuejs.org/v2/guide/components.html" target="_blank" rel="noreferrer">Vue components</a>. A mixin object can contain any component options. When a component uses a mixin, all options in the mixin will be &quot;mixed&quot; into the component&#39;s own options.</p><p>Although <code>.vue</code> <a href="https://vuejs.org/v2/guide/single-file-components.html" target="_blank" rel="noreferrer">single file components</a> are stored at the module level to ensure synchronized configuration management with backend code they are not &quot;processed&quot; within. Instead, the application processes them directly using <a href="https://medium.com/front-end-hacking/webpack-and-dynamic-imports-doing-it-right-72549ff49234" target="_blank" rel="noreferrer">WebPack dynamic imports</a>.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>Single component files are temporarily copied into the application folder during the build process, in development mode they are directly imported from (linked) modules using hot reload.</p></div><h2 id="testing" tabindex="-1">Testing <a class="header-anchor" href="#testing" aria-label="Permalink to &quot;Testing&quot;">​</a></h2><p>You will find <a href="https://documenter.getpostman.com/view/3473756/RztfxCRc" target="_blank" rel="noreferrer">here</a> a collection of ready-to-go REST requests to test the API with the great <a href="https://www.getpostman.com/" target="_blank" rel="noreferrer">POSTMAN</a> tool. Simply download it and import it in your POSTMAN installation.</p><p>You should do the following:</p><ol><li>make your application run (the collection is configured for default dev port <code>8080</code> but you can easily switch to <code>8081</code> for production mode for instance or any other)</li><li>use the authenticate request with a registered user e-mail/password to retrieve an authorization token</li><li>set this token in the header of other requests in order to be authorized to perform the request</li><li>renew your token when expired (step 2)</li></ol>',38),l=[i];function c(p,h,d,m,u,f){return o(),t("div",null,l)}const b=e(n,[["render",c]]);export{k as __pageData,b as default};
