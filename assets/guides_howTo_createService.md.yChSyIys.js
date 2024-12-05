import{_ as s,c as a,o as n,V as e}from"./chunks/framework.MC2QjGNi.js";const v=JSON.parse('{"title":"Create a new service","description":"","frontmatter":{},"headers":[],"relativePath":"guides/howTo/createService.md","filePath":"guides/howTo/createService.md"}'),p={name:"guides/howTo/createService.md"},i=e(`<h3 id="work-in-progress" tabindex="-1">** Work In Progress ** <a class="header-anchor" href="#work-in-progress" aria-label="Permalink to &quot;** Work In Progress **&quot;">​</a></h3><h1 id="create-a-new-service" tabindex="-1">Create a new service <a class="header-anchor" href="#create-a-new-service" aria-label="Permalink to &quot;Create a new service&quot;">​</a></h1><p>Start creating a folder with service name in <code>/services</code> and create your service inside</p><blockquote><p>By convention the name of the file will be formated like : serviceName.service.js</p></blockquote><p>You can also create a hook file to define custom hook for the service as the same format</p><p>This service file contain all your custom method</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>export default async function (name, app, options) {</span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    async createMessage (message) {</span></span>
<span class="line"><span>      await this.create(message)</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    async otherMethod () {</span></span>
<span class="line"><span>      ...</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="create-data-model" tabindex="-1">Create data model <a class="header-anchor" href="#create-data-model" aria-label="Permalink to &quot;Create data model&quot;">​</a></h2><p>Create your model in <code>/src/models</code> formated like <code>serviceName/model.mongodb.js</code></p><p>Example:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>export default function (app, options) {</span></span>
<span class="line"><span>  const db = options.db || app.db</span></span>
<span class="line"><span>  options.Model = db.collection(&#39;message&#39;)</span></span>
<span class="line"><span>  options.Model.createIndex({ createdAt: -1 })</span></span>
<span class="line"><span>  options.Model.createIndex({ description: 1 }, { name: &#39;description-en&#39;, collation: { locale: &#39;en&#39;, strength: 1 } })</span></span>
<span class="line"><span>  options.Model.createIndex({ description: 1 }, { name: &#39;description-fr&#39;, collation: { locale: &#39;fr&#39;, strength: 1 } })</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="configure-your-new-service" tabindex="-1">Configure your new service <a class="header-anchor" href="#configure-your-new-service" aria-label="Permalink to &quot;Configure your new service&quot;">​</a></h2><p>In the service.js file import and declare your service</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>import path from &#39;path&#39;</span></span>
<span class="line"><span>import { fileURLToPath } from &#39;url&#39;</span></span>
<span class="line"><span>import kdkCore from &#39;@kalisio/kdk/core.api.js&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//For autoloading service and model in service setup</span></span>
<span class="line"><span>const __dirname = path.dirname(fileURLToPath(import.meta.url))</span></span>
<span class="line"><span>const modelsPath = path.join(__dirname, &#39;models&#39;)</span></span>
<span class="line"><span>const servicesPath = path.join(__dirname, &#39;services&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default async function () {</span></span>
<span class="line"><span>  const app = this</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    // Set up services  </span></span>
<span class="line"><span>    const messageService = await app.createService(&#39;message&#39;, {</span></span>
<span class="line"><span>      modelsPath,</span></span>
<span class="line"><span>      servicesPath,</span></span>
<span class="line"><span>      methods: [&#39;find&#39;, &#39;get&#39;, &#39;create&#39;, &#39;update&#39;, &#39;patch&#39;, &#39;remove&#39;, &#39;createMessage&#39;],</span></span>
<span class="line"><span>      events: [&#39;event-closed&#39;, &#39;event-reopened&#39;]</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    messageService.on(&#39;createMessage&#39;, async event =&gt; {</span></span>
<span class="line"><span>      await eventsService.createMessage(event)</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    await app.configure(kdkCore)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  } catch (error) {</span></span>
<span class="line"><span>    app.logger.error(error.message)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="structure-example" tabindex="-1">Structure example : <a class="header-anchor" href="#structure-example" aria-label="Permalink to &quot;Structure example :&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>├── src</span></span>
<span class="line"><span>│  ├── models</span></span>
<span class="line"><span>│  │  ├── messages.model.mongodb.js</span></span>
<span class="line"><span>│  ├── services</span></span>
<span class="line"><span>│  │  ├── messages</span></span>
<span class="line"><span>│  │  │  ├── messages.hooks.js</span></span>
<span class="line"><span>│  │  │  ├── messages.service.js</span></span>
<span class="line"><span>│  ├── service.js</span></span>
<span class="line"><span>  ...</span></span></code></pre></div>`,16),l=[i];function t(c,o,r,d,h,m){return n(),a("div",null,l)}const g=s(p,[["render",t]]);export{v as __pageData,g as default};
