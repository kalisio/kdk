import{_ as e,c as s,o as a,V as i}from"./chunks/framework.MC2QjGNi.js";const g=JSON.parse('{"title":"Application development","description":"","frontmatter":{},"headers":[],"relativePath":"tips/app-development.md","filePath":"tips/app-development.md"}'),n={name:"tips/app-development.md"},t=i(`<h1 id="application-development" tabindex="-1">Application development <a class="header-anchor" href="#application-development" aria-label="Permalink to &quot;Application development&quot;">​</a></h1><h2 id="generating-service-account-tokens" tabindex="-1">Generating service account tokens <a class="header-anchor" href="#generating-service-account-tokens" aria-label="Permalink to &quot;Generating service account tokens&quot;">​</a></h2><p>If you&#39;d like a third-party application to rely on the API of your application without authenticating using a user/password you can generate an access token with a fixed expiration date to be used as an API key.</p><p>If your API needs a user ID to work as expected first register a user as usual. Then, using your application secret and a <a href="https://jwt.io/" target="_blank" rel="noreferrer">JWT library</a>, issue a JWT with a payload matching the configuration options of your application regarding audience (i.e. domain), issuer and the user ID if any, e.g.:</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;aud&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;kano.kargo.kalisio.xyz&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;iss&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;kalisio&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;exp&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1552402010</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;userId&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;5bc5b166beb4648d3cd79327&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h2 id="linking-errors" tabindex="-1">Linking errors <a class="header-anchor" href="#linking-errors" aria-label="Permalink to &quot;Linking errors&quot;">​</a></h2><p>Due to the modular approach of the KDK we need to <a href="https://medium.com/@alexishevia/the-magic-behind-npm-link-d94dcb3a81af" target="_blank" rel="noreferrer">link</a> the modules and the applications according to the dependency tree when developing.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Due to some <a href="http://codetunnel.io/npm-5-changes-to-npm-link/" target="_blank" rel="noreferrer">changes</a> in the way <code>npm</code> manages linked modules we prefer to use <a href="https://yarnpkg.com" target="_blank" rel="noreferrer">Yarn</a> as a package manager.</p></div><p>It appeared that when performing a new install, adding a new dependency, or launching two installs concurrently, some of these links often break raising different errors:</p><ul><li><code>TypeError: Cannot read property &#39;eventMappings&#39; of undefined</code></li><li><code>TypeError: processNextTick is not a function</code></li><li><code>Error: Cannot find module &#39;safer-buffer&#39;</code></li><li><code>An unexpected error occurred: &quot;ENOENT: no such file or directory, scandir &#39;xxx&#39;</code></li><li>...</li></ul><p>As a workaround you will either need to:</p><ul><li>clear the yarn cache <code>yarn cache clean</code> (or <code>yarn cache clean module</code> to be more specific)</li><li>restore the broken links using commands like e.g. <code>yarn link @kalisio/kdk</code> in the broken applications</li><li>reinstall all dependencies using <code>yarn install --check-files</code> in broken modules/applications, and then restore the links as above</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>You might also clean all dependencies frist using <a href="http://www.nikola-breznjak.com/blog/javascript/nodejs/how-to-delete-node_modules-folder-on-windows-machine/" target="_blank" rel="noreferrer"><code>rimraf node_modules</code></a></p></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Errors are often visible when launching the app server but might come from an underlying module. For instance the <code>TypeError: Cannot read property &#39;eventMappings&#39; of undefined</code> error often appears in modules, probably due to the fact incompatible versions of the same library (e.g. Feathers) are installed. So try first to reinstall and relink the modules before your app, and if you&#39;d like to see if a module is fine running its tests is usually a good indicator: <code>yarn mocha</code>.</p></div><h2 id="profiling-applications" tabindex="-1">Profiling applications <a class="header-anchor" href="#profiling-applications" aria-label="Permalink to &quot;Profiling applications&quot;">​</a></h2><p>In your local development environment you can usually use <a href="https://developers.google.com/web/tools/chrome-devtools/rendering-tools/js-execution" target="_blank" rel="noreferrer">Chrome DevTools</a>. However, it is trickier to perform profiling on remote production environments, here are the steps.</p><ol><li>Override the command used to launch your application to activate the <a href="https://nodejs.org/en/docs/guides/simple-profiling/" target="_blank" rel="noreferrer">Node.js V8 profiler</a>:</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>node --prof app.js</span></span></code></pre></div><ol start="2"><li>Once you have run your tests and recorded the profile, a file named like this <code>isolate-pid-1-v8.log</code> should appear in your working directory. Process it using the following commands to get either:</li></ol><ul><li><p>a &quot;human-readable&quot; file (txt)</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>node --prof-process .\\isolate-0x49489f0-1-v8.log &gt; prof-processed.txt</span></span></code></pre></div></li><li><p>a &quot;machine-readable&quot; file (json)</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>node --prof-process --preprocess -j .\\isolate-0x49489f0-1-v8.log &gt; prof-processed.json</span></span></code></pre></div></li></ul><ol start="3"><li>In order to identify bottlenecks in your app you can either:</li></ol><ul><li>Analyze the human-readable file</li><li>Install <a href="https://github.com/mapbox/flamebearer" target="_blank" rel="noreferrer">flamebearer</a> and generate the flame graph</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>npm install -g flamebearer</span></span>
<span class="line"><span>flamebearer prof-processed.json</span></span></code></pre></div><ul><li>Use the <a href="https://mapbox.github.io/flamebearer/" target="_blank" rel="noreferrer">online flame graph generator</a> and drag&#39;n&#39;drop your profile</li></ul><h2 id="running-multiple-applications-side-by-side" tabindex="-1">Running multiple applications side-by-side <a class="header-anchor" href="#running-multiple-applications-side-by-side" aria-label="Permalink to &quot;Running multiple applications side-by-side&quot;">​</a></h2><p>For instance, as Kano depends for some features on a running Weacast API you will need to run both on your local development environment. If your application also uses replication you will need to launch two instances in parallel. The problem is that by default all our apps uses the <code>8081</code> port for server and <code>8080</code> port for client in development mode, generating a port conflict. Similarly the Node.js debugger uses by default the <code>9229</code> port.</p><p>You should run the first server by defining eg. <code>PORT=8082</code> (to avoid port conflict). If single-sign-on is expected to work, define also <code>APP_SECRET=same value as in second application configuration</code> as environment variables. Then execute the <code>yarn dev:replica</code> command (will setup the Node.js debugger to use the <code>9229</code> port to avoid port conflict). Last, you can launch the second server/client as usual.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>You usually don&#39;t need the client application but only the API on the replica but if required you can launch another client similarly e.g. by setting <code>CLIENT_PORT=8083</code>.</p></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>If you need more than two side-by-side applications then use set <a href="https://nodejs.org/api/cli.html#cli_node_options_options" target="_blank" rel="noreferrer">NODE_OPTIONS</a> environment variable before launching each one, e.g. <code>NODE_OPTIONS=&#39;--inspect-port=9230&#39;</code>.</p></div><h3 id="application-instances-synchronization" tabindex="-1">Application instances synchronization <a class="header-anchor" href="#application-instances-synchronization" aria-label="Permalink to &quot;Application instances synchronization&quot;">​</a></h3><p>If your application is not fully stateless or requires real-time events to be dispatched to clients you will also need to synchronize them using <a href="https://github.com/feathersjs-ecosystem/feathers-sync" target="_blank" rel="noreferrer">feathers-sync</a>. We previously relied on the <a href="https://github.com/scttnlsn/mubsub" target="_blank" rel="noreferrer">mubsub</a> adapter because as we already use MongoDB it did not require any additional service to be deployed.</p><p>Unfortunately it has been <a href="https://github.com/feathersjs-ecosystem/feathers-sync/pull/135" target="_blank" rel="noreferrer">deprecated</a>. As a consequence we now rely on the <a href="https://redis.io/" target="_blank" rel="noreferrer">Redis</a> adapter. For development you can easily run a Redis server using Docker:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Bind it to your prefered port</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run -d --rm --name redis -p </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6300</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">:6379 redis:5</span></span></code></pre></div><p>You will need to play with the different options presented above to avoid port conflicts and define as well how your app connects to the Redis instance using the <code>REDIS_URL</code> environment variable like <code>redis://127.0.0.1:6300</code>. You can see the subscriber apps and exchanged messages by connecting to the Redis container:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Bind it to your prefered port</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> exec -it redis bash</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> redis-cli</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Number of subscribers</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> PUBSUB NUMSUB feathers-sync</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;feathers-sync&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) (</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">integer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) 2</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Monitor messages</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> SUBSCRIBE feathers-sync</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Reading</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> messages...</span></span></code></pre></div>`,35),o=[t];function l(r,p,c,d,h,u){return a(),s("div",null,o)}const y=e(n,[["render",l]]);export{g as __pageData,y as default};
