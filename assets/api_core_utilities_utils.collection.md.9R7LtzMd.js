import{_ as e,c as i,o as t,V as s}from"./chunks/framework.MC2QjGNi.js";const u=JSON.parse('{"title":"Collection","description":"","frontmatter":{},"headers":[],"relativePath":"api/core/utilities/utils.collection.md","filePath":"api/core/utilities/utils.collection.md"}'),l={name:"api/core/utilities/utils.collection.md"},a=s('<h1 id="collection" tabindex="-1">Collection <a class="header-anchor" href="#collection" aria-label="Permalink to &quot;Collection&quot;">​</a></h1><h2 id="overview" tabindex="-1">Overview <a class="header-anchor" href="#overview" aria-label="Permalink to &quot;Overview&quot;">​</a></h2><p>The <code>utils.collection.js</code> module provides utility functions for interacting with collections in a KDK-based application.</p><p>It leverages <strong>Lodash</strong> for object manipulation and <strong>FeathersJS</strong> services to perform database operations efficiently.</p><h2 id="functions" tabindex="-1">Functions <a class="header-anchor" href="#functions" aria-label="Permalink to &quot;Functions&quot;">​</a></h2><h3 id="getcollectionservice-name-context" tabindex="-1"><code>getCollectionService(name, context)</code> <a class="header-anchor" href="#getcollectionservice-name-context" aria-label="Permalink to &quot;`getCollectionService(name, context)`&quot;">​</a></h3><p>Retrieves a service instance for a specified collection.</p><ul><li><strong>Parameters:</strong><ul><li><code>name</code> <em>(string)</em>: The name of the collection service.</li><li><code>context</code> <em>(object)</em>: The context in which the service operates.</li></ul></li><li><strong>Returns:</strong> The requested service instance.</li></ul><h3 id="listitems-service-fields-filter-limit-50" tabindex="-1"><code>listItems(service, fields, filter = {}, limit = 50)</code> <a class="header-anchor" href="#listitems-service-fields-filter-limit-50" aria-label="Permalink to &quot;`listItems(service, fields, filter = {}, limit = 50)`&quot;">​</a></h3><p>Fetches a list of items from a given service, applying optional filters and field selection.</p><ul><li><strong>Parameters:</strong><ul><li><code>service</code> <em>(object)</em>: The service instance to query.</li><li><code>fields</code> <em>(array)</em>: The fields to select in the query.</li><li><code>filter</code> <em>(object, optional)</em>: Additional query filters.</li><li><code>limit</code> <em>(number, optional, default=50)</em>: The maximum number of items to retrieve.</li></ul></li><li><strong>Returns:</strong> A promise resolving to the list of retrieved items.</li></ul><h3 id="getoldestitem-service-field-createdat-filter" tabindex="-1"><code>getOldestItem(service, field = &#39;createdAt&#39;, filter = {})</code> <a class="header-anchor" href="#getoldestitem-service-field-createdat-filter" aria-label="Permalink to &quot;`getOldestItem(service, field = &#39;createdAt&#39;, filter = {})`&quot;">​</a></h3><p>Retrieves the oldest item from a service based on a specified field.</p><ul><li><strong>Parameters:</strong><ul><li><code>service</code> <em>(object)</em>: The service instance to query.</li><li><code>field</code> <em>(string, optional, default=&#39;createdAt&#39;)</em>: The field used to determine the oldest item.</li><li><code>filter</code> <em>(object, optional)</em>: Additional query filters.</li></ul></li><li><strong>Returns:</strong> A promise resolving to the oldest item.</li></ul><h3 id="getoldesttime-service-field-createdat-filter" tabindex="-1"><code>getOldestTime(service, field = &#39;createdAt&#39;, filter = {})</code> <a class="header-anchor" href="#getoldesttime-service-field-createdat-filter" aria-label="Permalink to &quot;`getOldestTime(service, field = &#39;createdAt&#39;, filter = {})`&quot;">​</a></h3><p>Retrieves the timestamp of the oldest item from a service based on a specified field.</p><ul><li><strong>Parameters:</strong><ul><li><code>service</code> <em>(object)</em>: The service instance to query.</li><li><code>field</code> <em>(string, optional, default=&#39;createdAt&#39;)</em>: The field used to determine the oldest timestamp.</li><li><code>filter</code> <em>(object, optional)</em>: Additional query filters.</li></ul></li><li><strong>Returns:</strong> A promise resolving to the timestamp of the oldest item.</li></ul><h3 id="getlatestitem-service-field-createdat-filter" tabindex="-1"><code>getLatestItem(service, field = &#39;createdAt&#39;, filter = {})</code> <a class="header-anchor" href="#getlatestitem-service-field-createdat-filter" aria-label="Permalink to &quot;`getLatestItem(service, field = &#39;createdAt&#39;, filter = {})`&quot;">​</a></h3><p>Retrieves the latest item from a service based on a specified field.</p><ul><li><strong>Parameters:</strong><ul><li><code>service</code> <em>(object)</em>: The service instance to query.</li><li><code>field</code> <em>(string, optional, default=&#39;createdAt&#39;)</em>: The field used to determine the latest item.</li><li><code>filter</code> <em>(object, optional)</em>: Additional query filters.</li></ul></li><li><strong>Returns:</strong> A promise resolving to the latest item.</li></ul><h3 id="getlatesttime-service-field-createdat-filter" tabindex="-1"><code>getLatestTime(service, field = &#39;createdAt&#39;, filter = {})</code> <a class="header-anchor" href="#getlatesttime-service-field-createdat-filter" aria-label="Permalink to &quot;`getLatestTime(service, field = &#39;createdAt&#39;, filter = {})`&quot;">​</a></h3><p>Retrieves the timestamp of the latest item from a service based on a specified field.</p><ul><li><strong>Parameters:</strong><ul><li><code>service</code> <em>(object)</em>: The service instance to query.</li><li><code>field</code> <em>(string, optional, default=&#39;createdAt&#39;)</em>: The field used to determine the latest timestamp.</li><li><code>filter</code> <em>(object, optional)</em>: Additional query filters.</li></ul></li><li><strong>Returns:</strong> A promise resolving to the timestamp of the latest item.</li></ul><h3 id="enumeratefield-service-field-filter" tabindex="-1"><code>enumerateField(service, field, filter = {})</code> <a class="header-anchor" href="#enumeratefield-service-field-filter" aria-label="Permalink to &quot;`enumerateField(service, field, filter = {})`&quot;">​</a></h3><p>Retrieves a list of distinct values for a specified field in a collection.</p><ul><li><strong>Parameters:</strong><ul><li><code>service</code> <em>(object)</em>: The service instance to query.</li><li><code>field</code> <em>(string)</em>: The field for which distinct values are required.</li><li><code>filter</code> <em>(object, optional)</em>: Additional query filters.</li></ul></li><li><strong>Returns:</strong> A promise resolving to an array of unique values.</li></ul><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to &quot;Usage&quot;">​</a></h2><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { getCollectionService, listItems } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;./utils.collection.js&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> service</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> getCollectionService</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;myCollection&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, context);</span></span>\n<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> items</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> await</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> listItems</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(service, [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;name&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;age&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">], { active: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Active items:&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, items);</span></span></code></pre></div>',28),r=[a];function o(n,c,d,h,m,p){return t(),i("div",null,r)}const g=e(l,[["render",o]]);export{u as __pageData,g as default};
