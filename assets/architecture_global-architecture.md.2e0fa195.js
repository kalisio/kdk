import{_ as e,o as a,c as s,Q as t}from"./chunks/framework.70a39c86.js";const n="/kdk/assets/global-architecture.21b838a5.svg",m=JSON.parse('{"title":"Global architecture","description":"","frontmatter":{},"headers":[],"relativePath":"architecture/global-architecture.md","filePath":"architecture/global-architecture.md"}'),o={name:"architecture/global-architecture.md"},r=t('<h1 id="global-architecture" tabindex="-1">Global architecture <a class="header-anchor" href="#global-architecture" aria-label="Permalink to &quot;Global architecture&quot;">​</a></h1><h2 id="overview" tabindex="-1">Overview <a class="header-anchor" href="#overview" aria-label="Permalink to &quot;Overview&quot;">​</a></h2><p>The typical global architecture and the underlying technologies of <strong>KDK</strong> are summarized in the following diagram.</p><p><img src="'+n+`" alt="Global architecture"></p><h2 id="architecture-at-scale" tabindex="-1">Architecture at scale <a class="header-anchor" href="#architecture-at-scale" aria-label="Permalink to &quot;Architecture at scale&quot;">​</a></h2><p>Although the typical architecture presented previously can be deployed in a single-server environment KDK has been developed as a loosely coupled set of modules to prevent it being a <a href="http://whatis.techtarget.com/definition/monolithic-architecture" target="_blank" rel="noreferrer">monolithic piece of software</a>. The built-in <a href="https://docs.feathersjs.com/guides/about/philosophy.html#services" target="_blank" rel="noreferrer">service layer</a> helps decoupling the business logic from how it is being accessed based on a <a href="https://docs.feathersjs.com/guides/about/philosophy.html#uniform-interfaces" target="_blank" rel="noreferrer">simple and unambiguous interface</a>. Kalisio applications can thus be deployed in a <a href="http://searchmicroservices.techtarget.com/definition/microservices" target="_blank" rel="noreferrer">microservice architectural style</a>, which is typically used to provide high availability. The idea is to deploy different application instances on different <em>logical hosts</em> (can be physical machines as well as containers or virtual machines) each running the same or a different set of services.</p><p>However, you will have to face some <a href="https://docs.feathersjs.com/guides/advanced/scaling.html" target="_blank" rel="noreferrer">scaling configuration issues</a> first. You also have to setup the underlying logical infrastructure. To achieve high availability, different strategies may be used.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>It is recommended to have a single source of truth (SSOT) for your data (i.e. a single database), simplifying authentication, which requires you to setup a <a href="https://docs.mongodb.com/manual/tutorial/deploy-replica-set/" target="_blank" rel="noreferrer">MongoDB replica set</a> and configure the DB URL <a href="http://mongodb.github.io/node-mongodb-native/2.0/reference/connecting/connection-settings/" target="_blank" rel="noreferrer">accordingly</a>.</p></div><h3 id="monolithic-application" tabindex="-1">Monolithic application <a class="header-anchor" href="#monolithic-application" aria-label="Permalink to &quot;Monolithic application&quot;">​</a></h3><p>This is the easiest strategy, you can rely on Cloud-ready solutions like <a href="https://kalisio.github.io/kaabah/" target="_blank" rel="noreferrer">Kaabah</a> to replicate and load-balance the different instances of your application and simply use <a href="https://github.com/feathersjs-ecosystem/feathers-sync" target="_blank" rel="noreferrer">feathers-sync</a> to synchronize service events.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>This approach is something between the true monolith and the true microservices architecture, i.e. you scale your entire application but not its underlying services according to their workload.</p></div><h3 id="distributed-application" tabindex="-1">Distributed application <a class="header-anchor" href="#distributed-application" aria-label="Permalink to &quot;Distributed application&quot;">​</a></h3><p>You can split up your application API manually on a per-responsibility basis (e.g. each module on a dedicated instance) and just communicate with each other through Feathers clients using all the infrastructure that is already in place. You could also deploy a frontend application serving as an <a href="http://microservices.io/patterns/apigateway.html" target="_blank" rel="noreferrer">API gateway</a>. To configure the proxy rules, edit the <code>proxyTable</code> option in your configuration. The frontend server is using <a href="https://github.com/chimurai/http-proxy-middleware" target="_blank" rel="noreferrer">http-proxy-middleware</a> for proxying, so you should refer to its docs for a detailed usage but here&#39;s a simple example:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// config/default.js</span></span>
<span class="line"><span style="color:#79B8FF;">module</span><span style="color:#E1E4E8;">.</span><span style="color:#79B8FF;">exports</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#E1E4E8;">  proxyTable: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// proxy all requests starting with /api/service</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&#39;/api/service&#39;</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      target: </span><span style="color:#9ECBFF;">&#39;http://my.service.com&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      changeOrigin: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      pathRewrite: {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#9ECBFF;">&#39;^/api/service&#39;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;/api&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">      }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// config/default.js</span></span>
<span class="line"><span style="color:#005CC5;">module</span><span style="color:#24292E;">.</span><span style="color:#005CC5;">exports</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#24292E;">  proxyTable: {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// proxy all requests starting with /api/service</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&#39;/api/service&#39;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">      target: </span><span style="color:#032F62;">&#39;http://my.service.com&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      changeOrigin: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      pathRewrite: {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;^/api/service&#39;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;/api&#39;</span></span>
<span class="line"><span style="color:#24292E;">      }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>The above example will proxy the request <code>/api/service/1</code> to <code>http://my.service.com/api/1</code>.</p><p>However, all of this requires manual work, creates a tight coupling with your underlying infrastructure and will not allow auto-scaling unless you have some discovery mechanism. You can make each instance automatically aware of others instances to distribute services and related events using <a href="https://github.com/kalisio/feathers-distributed" target="_blank" rel="noreferrer">feathers-distributed</a>.</p>`,16),l=[r];function i(c,p,h,u,d,y){return a(),s("div",null,l)}const f=e(o,[["render",i]]);export{m as __pageData,f as default};
