import{_ as s,c as n,o as a,V as i}from"./chunks/framework.MC2QjGNi.js";const e="/kdk/assets/hooks-diagram-template.SHLdfxGX.png",E=JSON.parse('{"title":"Documentation","description":"","frontmatter":{},"headers":[],"relativePath":"tools/documentation.md","filePath":"tools/documentation.md"}'),p={name:"tools/documentation.md"},t=i(`<h1 id="documentation" tabindex="-1">Documentation <a class="header-anchor" href="#documentation" aria-label="Permalink to &quot;Documentation&quot;">​</a></h1><h2 id="generating-the-doc" tabindex="-1">Generating the doc <a class="header-anchor" href="#generating-the-doc" aria-label="Permalink to &quot;Generating the doc&quot;">​</a></h2><p>The approach we have adopted rely on <a href="https://vitepress.dev/" target="_blank" rel="noreferrer">VitePress</a> to generate the static web site</p><h3 id="install-vitepress" tabindex="-1">Install VitePress <a class="header-anchor" href="#install-vitepress" aria-label="Permalink to &quot;Install VitePress&quot;">​</a></h3><p>You first need to install vitepress:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$yarn add -D vitepress</span></span></code></pre></div><p>And then add the documentation generation scripts to the <code>package.json</code> file:</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;scripts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;dev&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;vitepress dev&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;build&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;vitepress build&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;preview&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;vitepress preview&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>Create the following directory structure to store the <strong>VuePress</strong> stuff:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>docs/</span></span>
<span class="line"><span>|_ .vitepress/</span></span>
<span class="line"><span>|    |_ config.mjs</span></span>
<span class="line"><span>|_ package.json</span></span>
<span class="line"><span>|_ index.md</span></span>
<span class="line"><span>|....</span></span></code></pre></div><ul><li><code>.vitepress</code> stores the <strong>VitePress</strong> configuration.</li><li><code>index.md</code> is the entry point of your documentation.</li><li><code>package.json</code> is the Node.js entry point to build the documentation. The file must have the following content:</li></ul><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;docs&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;type&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;module&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;scripts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;dev&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;vitepress dev&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;build&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;vitepress build&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;preview&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;vitepress preview&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;devDependencies&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;keycloak-js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;^23.0.4&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;lodash&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;^4.17.21&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;mermaid&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;^10.8.0&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;moment&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;^2.30.1&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;quasar&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;^2.14.3&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;vitepress&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;^1.0.0-rc.40&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;vitepress-plugin-mermaid&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;^2.0.16&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;vitepress-theme-kalisio&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;https://github.com/kalisio/vitepress-theme-kalisio&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>The structure follows the <strong>VitePress</strong> directory structure and more information can be found <a href="https://vitepress.dev/guide/getting-started#file-structure" target="_blank" rel="noreferrer">here</a></p></div><h3 id="configure-vitepress" tabindex="-1">Configure VitePress <a class="header-anchor" href="#configure-vitepress" aria-label="Permalink to &quot;Configure VitePress&quot;">​</a></h3><p>Edit the <code>config.mjs</code> to configure <strong>VitePress</strong>. We usually have this kind of configuration:</p><div class="language-mjs vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mjs</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>import { defineConfig } from &#39;vitepress&#39;</span></span>
<span class="line"><span>import { withMermaid } from &#39;vitepress-plugin-mermaid&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default withMermaid(</span></span>
<span class="line"><span>  defineConfig({</span></span>
<span class="line"><span>    base: &#39;/kdk/&#39;,</span></span>
<span class="line"><span>    title: &#39;KDK&#39;,</span></span>
<span class="line"><span>    description: &#39;The Kalisio Development Kit&#39;,</span></span>
<span class="line"><span>    ignoreDeadLinks: true,</span></span>
<span class="line"><span>    head: [</span></span>
<span class="line"><span>      [&#39;link&#39;, { href: &#39;https://cdnjs.cloudflare.com/ajax/libs/line-awesome/1.3.0/line-awesome/css/line-awesome.min.css&#39;, rel: &#39;stylesheet&#39; }],</span></span>
<span class="line"><span>      [&#39;link&#39;, { rel: &#39;icon&#39;, href: &#39;https://s3.eu-central-1.amazonaws.com/kalisioscope/kdk/kdk-icon-color-2048x2048.png&#39; }]</span></span>
<span class="line"><span>    ],</span></span>
<span class="line"><span>    themeConfig: {</span></span>
<span class="line"><span>      logo: &#39;https://s3.eu-central-1.amazonaws.com/kalisioscope/kdk/kdk-icon-color-2048x2048.png&#39;,</span></span>
<span class="line"><span>      jwt: &#39;eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJkZXYua2FsaXNpby54eXoiLCJpc3MiOiJrYWxpc2lvIn0.CGvJwPPkuiFvNzo3zUBb-_vwD0CKbUfm7w7TkCY-Ts4&#39;,</span></span>
<span class="line"><span>      socialLinks: [{ icon: &#39;github&#39;, link: &#39;https://github.com/kalisio/kano&#39; }],</span></span>
<span class="line"><span>      nav: [</span></span>
<span class="line"><span>        { text: &#39;About&#39;, link: &#39;/about/introduction&#39; },</span></span>
<span class="line"><span>        { text: &#39;Guides&#39;, link: &#39;/guides/introduction&#39; },</span></span>
<span class="line"><span>        { text: &#39;Architecture&#39;, link: &#39;/architecture/introduction&#39; },</span></span>
<span class="line"><span>        { text: &#39;API&#39;, link: &#39;/api/introduction&#39; },</span></span>
<span class="line"><span>        { text: &#39;Tips&#39;, link: &#39;/tips/introduction&#39; },</span></span>
<span class="line"><span>        { text: &#39;Tools&#39;, link: &#39;/tools/introduction&#39; }</span></span>
<span class="line"><span>      ],</span></span>
<span class="line"><span>      sidebar: {</span></span>
<span class="line"><span>        &#39;/about/&#39;: getAboutSidebar(),</span></span>
<span class="line"><span>        &#39;/guides/&#39;: getGuidesSidebar(),</span></span>
<span class="line"><span>        &#39;/architecture/&#39;: getArchitectureSidebar(),</span></span>
<span class="line"><span>        &#39;/api/&#39;: getAPISidebar(),</span></span>
<span class="line"><span>        &#39;/tips/&#39;: getTipsSidebar(),</span></span>
<span class="line"><span>        &#39;/tools/&#39;: getToolsSidebar()</span></span>
<span class="line"><span>      },</span></span>
<span class="line"><span>      trustLogos: [</span></span>
<span class="line"><span>        { imageLink: &#39;https://s3.eu-central-1.amazonaws.com/kalisioscope/assets/logos/airbus.png&#39;, link: &#39;https://www.airbus.com/&#39; },</span></span>
<span class="line"><span>        { imageLink: &#39;https://s3.eu-central-1.amazonaws.com/kalisioscope/assets/logos/irsn.png&#39;, link: &#39;https://www.irsn.fr/&#39; }</span></span>
<span class="line"><span>      ],</span></span>
<span class="line"><span>      footer: {</span></span>
<span class="line"><span>        copyright: &#39;MIT Licensed | Copyright © 2017-20xx Kalisio&#39;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    vite: {</span></span>
<span class="line"><span>      optimizeDeps: {</span></span>
<span class="line"><span>        include: [&#39;keycloak-js&#39;, &#39;lodash&#39;],</span></span>
<span class="line"><span>      },</span></span>
<span class="line"><span>      ssr: {</span></span>
<span class="line"><span>        noExternal: [&#39;vitepress-theme-kalisio&#39;]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function getAboutSidebar () {</span></span>
<span class="line"><span>  return [</span></span>
<span class="line"><span>    { text: &#39;About&#39;, link: &#39;/about/introduction&#39; },</span></span>
<span class="line"><span>    { text: &#39;Roadmap&#39;, link: &#39;/about/roadmap&#39; },</span></span>
<span class="line"><span>    { text: &#39;Contributing&#39;, link: &#39;/about/contributing&#39; },</span></span>
<span class="line"><span>    { text: &#39;License&#39;, link: &#39;/about/license&#39; },</span></span>
<span class="line"><span>    { text: &#39;Contact&#39;, link: &#39;/about/contact&#39; }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function getGuidesSidebar () {</span></span>
<span class="line"><span>  return [</span></span>
<span class="line"><span>    { text: &#39;Guides&#39;, link: &#39;/guides/introduction&#39; },</span></span>
<span class="line"><span>    { text: &#39;The Basics&#39;, collapsed: true, items: [{ text: &#39;Introduction to KDK&#39;, link: &#39;/guides/basics/introduction&#39; }]},</span></span>
<span class="line"><span>    { </span></span>
<span class="line"><span>      text: &#39;Development&#39;, </span></span>
<span class="line"><span>      collapsed: true, </span></span>
<span class="line"><span>      items: [</span></span>
<span class="line"><span>        { text: &#39;Setup your environment&#39;, link: &#39;/guides/development/setup&#39; },</span></span>
<span class="line"><span>        { text: &#39;Develop with KDK&#39;, link: &#39;/guides/development/develop&#39; },</span></span>
<span class="line"><span>        { text: &#39;Testing with KDK&#39;, link: &#39;/guides/development/test&#39; },</span></span>
<span class="line"><span>        { text: &#39;Configure your app&#39;, link: &#39;/guides/development/configure&#39; },</span></span>
<span class="line"><span>        { text: &#39;Deploy your app&#39;, link: &#39;/guides/development/deploy&#39; },</span></span>
<span class="line"><span>        { text: &#39;Publish with KDK&#39;, link: &#39;/guides/development/publish&#39; }</span></span>
<span class="line"><span>      ]</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      text: &#39;Howtos&#39;,</span></span>
<span class="line"><span>      collapsed: true,</span></span>
<span class="line"><span>      items: [</span></span>
<span class="line"><span>        { text: &#39;Create a service&#39;, link: &#39;/guides/howtos/create-service&#39; },</span></span>
<span class="line"><span>        { text: &#39;Distribute a service&#39;, link: &#39;/guides/howtos/distribute-service&#39; },</span></span>
<span class="line"><span>        { text: &#39;Manage permissions&#39;, link: &#39;/guides/howtos/manage-permissions&#39; },</span></span>
<span class="line"><span>        { text: &#39;Manage collection&#39;, link: &#39;/guides/howtos/manage-collection&#39; },</span></span>
<span class="line"><span>        { text: &#39;Connect to a planet&#39;, link: &#39;/guides/howtos/connect-planet&#39; }</span></span>
<span class="line"><span>      ]</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function getArchitectureSidebar () {</span></span>
<span class="line"><span>  return [</span></span>
<span class="line"><span>    { text: &#39;Architecture&#39;, link: &#39;/architecture/introduction&#39; },</span></span>
<span class="line"><span>    { text: &#39;Main concepts&#39;, link: &#39;/architecture/main-concepts&#39; },</span></span>
<span class="line"><span>    { text: &#39;Global architecture&#39;, link: &#39;/architecture/global-architecture&#39; },</span></span>
<span class="line"><span>    { text: &#39;Component view&#39;, link: &#39;/architecture/component-view&#39; },</span></span>
<span class="line"><span>    { text: &#39;Data model-oriented view of the architecture&#39;, link: &#39;/architecture/data-model-view&#39; }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function getAPISidebar () {</span></span>
<span class="line"><span>  return [</span></span>
<span class="line"><span>    { text: &#39;API&#39;, link: &#39;/api/introduction&#39; },</span></span>
<span class="line"><span>    { </span></span>
<span class="line"><span>      text: &#39;core&#39;, </span></span>
<span class="line"><span>      collapsed: true, </span></span>
<span class="line"><span>      items: [</span></span>
<span class="line"><span>        { text: &#39;Overview&#39;, link: &#39;/api/core/introduction&#39; },</span></span>
<span class="line"><span>        { text: &#39;Application&#39;, link: &#39;/api/core/application&#39; },</span></span>
<span class="line"><span>        { text: &#39;Services&#39;, link: &#39;/api/core/services&#39; },</span></span>
<span class="line"><span>        { text: &#39;Hooks&#39;, link: &#39;/api/core/hooks&#39; },</span></span>
<span class="line"><span>        { text: &#39;Components&#39;, link: &#39;/api/core/components&#39; },</span></span>
<span class="line"><span>        { text: &#39;Mixins&#39;, link: &#39;/api/core/mixins&#39; },</span></span>
<span class="line"><span>        { text: &#39;Composables&#39;, link: &#39;/api/core/composables&#39; }</span></span>
<span class="line"><span>      ]</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    { </span></span>
<span class="line"><span>      text: &#39;map&#39;, </span></span>
<span class="line"><span>      collapsed: true, </span></span>
<span class="line"><span>      items: [</span></span>
<span class="line"><span>        { text: &#39;Overview&#39;, link: &#39;/api/map/introduction&#39; },</span></span>
<span class="line"><span>        { text: &#39;Services&#39;, link: &#39;/api/map/services&#39; },</span></span>
<span class="line"><span>        { text: &#39;Hooks&#39;, link: &#39;/api/map/hooks&#39; },</span></span>
<span class="line"><span>        { text: &#39;Components&#39;, link: &#39;/api/map/components&#39; },</span></span>
<span class="line"><span>        { text: &#39;Mixins&#39;, link: &#39;/api/map/mixins&#39; },</span></span>
<span class="line"><span>        { text: &#39;Map Mixins&#39;, link: &#39;/api/map/map-mixins&#39; },</span></span>
<span class="line"><span>        { text: &#39;Globe Mixins&#39;, link: &#39;/api/map/globe-mixins&#39; },</span></span>
<span class="line"><span>        { text: &#39;Composables&#39;, link: &#39;/api/map/composables&#39; }</span></span>
<span class="line"><span>      ]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function getTipsSidebar () {</span></span>
<span class="line"><span>  return [</span></span>
<span class="line"><span>    { text: &#39;Tips&#39;, link: &#39;/tips/introduction&#39; },</span></span>
<span class="line"><span>    { text: &#39;Application development&#39;, link: &#39;/tips/app-development&#39; },</span></span>
<span class="line"><span>    { text: &#39;Mobile configuration&#39;, link: &#39;/tips/mobile-configuration&#39; }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function getToolsSidebar () {</span></span>
<span class="line"><span>  return [</span></span>
<span class="line"><span>    { text: &#39;Tools&#39;, link: &#39;/tools/introduction&#39; },</span></span>
<span class="line"><span>    { text: &#39;Command-line tools&#39;, link: &#39;/tools/cli&#39; },</span></span>
<span class="line"><span>    { text: &#39;Browser-based tools&#39;, link: &#39;/tools/browsers&#39; },</span></span>
<span class="line"><span>    { text: &#39;Documentation&#39;, link: &#39;/tools/documentation&#39; },</span></span>
<span class="line"><span>    { text: &#39;Infrastructure&#39;, link: &#39;/tools/infrastructure&#39; }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="write-the-documentation" tabindex="-1">Write the documentation <a class="header-anchor" href="#write-the-documentation" aria-label="Permalink to &quot;Write the documentation&quot;">​</a></h3><p>Here are few tips to know when writing the documentation:</p><ul><li>Pages structure: the pages should match the navigation structure you have defined in the <code>config.js</code> file.</li><li>Handling assets: you can simply refer to the asset using relative URLs. Please refer to the <a href="https://vitepress.dev/guide/asset-handling" target="_blank" rel="noreferrer">Asset Handling</a> page to know more.</li><li>Take advantage of <a href="https://vitepress.dev/guide/markdown" target="_blank" rel="noreferrer">Markdown extensions</a></li></ul><h3 id="deploy-the-documentation-to-the-gh-pages" tabindex="-1">Deploy the documentation to the gh-pages <a class="header-anchor" href="#deploy-the-documentation-to-the-gh-pages" aria-label="Permalink to &quot;Deploy the documentation to the gh-pages&quot;">​</a></h3><p>Add the following lines to your <code>.travis.yml</code> file:</p><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">stage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">DOCS</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    language</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">node_js</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    node_js</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;8&#39;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    install</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">cd docs &amp;&amp; yarn install &amp;&amp; yarn build</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    deploy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      provider</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">pages</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      local-dir</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">docs/.vitepress/dist</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      skip-cleanup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      github-token</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">$GITHUB_TOKEN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  </span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      keep-history</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        branch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">master</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>You must set the secure variable <code>GITHUB_TOKEN</code> in your Travis CI project settings</p></div><h2 id="working-with-diagrams" tabindex="-1">Working with diagrams <a class="header-anchor" href="#working-with-diagrams" aria-label="Permalink to &quot;Working with diagrams&quot;">​</a></h2><p>We use two distinct tools to work with diagrams:</p><ul><li><a href="http://draw.io" target="_blank" rel="noreferrer">draw.io</a>] a complete editor to create well known diagrams</li><li><a href="https://github.com/knsv/mermaid" target="_blank" rel="noreferrer">mermaid</a> which allows you to generate diagrams from a simple text definition. We mainly use mermaid to create the hooks diagrams.</li></ul><p>To be able to include the diagrams within the documentation, we adopted the following methodology:</p><h3 id="draw-io" tabindex="-1">Draw.io <a class="header-anchor" href="#draw-io" aria-label="Permalink to &quot;Draw.io&quot;">​</a></h3><ol><li>make it with <a href="http://draw.io" target="_blank" rel="noreferrer">draw.io</a> and store it in this folder</li><li>export it as SVG/PNG in the root <strong>assets</strong> folder</li><li>reference it in the documentation using a link like this <code>![My legend](https://raw.githubusercontent.com/kalisio/kdk/master/images/my-diagram.png)</code></li></ol><h3 id="mermaid" tabindex="-1">mermaid <a class="header-anchor" href="#mermaid" aria-label="Permalink to &quot;mermaid&quot;">​</a></h3><ol><li>install the <a href="https://github.com/mermaidjs/mermaid.cli" target="_blank" rel="noreferrer">mermaid CLI</a></li><li>start from the <a href="./hooks-diagram-template.mmd.html">hooks diagram template file</a></li><li>output the SVG/PNG file in the root <strong>assets</strong> folder using <code>mmdc -i ./my-hooks-diagram.mmd -t neutral -b transparent -o my-hooks-diagram.svg</code></li><li>reference it in the documentation using a link like this <code>![My legend](https://raw.githubusercontent.com/kalisio/kdk/master/images/my-diagram.png)</code></li></ol><p>The template looks like this: <img src="`+e+'" alt="Hooks Diagram Template"></p>',32),l=[t];function o(r,h,c,k,d,u){return a(),n("div",null,l)}const m=s(p,[["render",o]]);export{E as __pageData,m as default};
