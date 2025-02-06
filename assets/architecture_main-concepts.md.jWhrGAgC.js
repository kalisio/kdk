import{_ as e,c as a,o as t,V as s}from"./chunks/framework.MC2QjGNi.js";const o="/kdk/assets/domain-model.scBqQX7o.svg",b=JSON.parse('{"title":"Main concepts","description":"","frontmatter":{},"headers":[],"relativePath":"architecture/main-concepts.md","filePath":"architecture/main-concepts.md"}'),r={name:"architecture/main-concepts.md"},i=s('<h1 id="main-concepts" tabindex="-1">Main concepts <a class="header-anchor" href="#main-concepts" aria-label="Permalink to &quot;Main concepts&quot;">​</a></h1><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>Although this page details the main data model used for SaaS applications the organisation part is optional and you can build legacy applications just by using services.</p></div><h2 id="services" tabindex="-1">Services <a class="header-anchor" href="#services" aria-label="Permalink to &quot;Services&quot;">​</a></h2><p>According to the <a href="https://docs.feathersjs.com/guides/about/philosophy.html" target="_blank" rel="noreferrer">Feathers philosophy</a> each business operation should be performed through a <a href="https://docs.feathersjs.com/api/services.html" target="_blank" rel="noreferrer">service interface</a>. As a consequence, these are are the building blocks at the heart of each KDK application.</p><h2 id="data-model-and-segregation" tabindex="-1">Data model and segregation <a class="header-anchor" href="#data-model-and-segregation" aria-label="Permalink to &quot;Data model and segregation&quot;">​</a></h2><p>Each service managing business items is usually related to a database <strong>collection</strong> with an underlying data model formatted as a JSON document.</p><blockquote><p>All dates/times in KDK are internally managed as date or <a href="https://momentjs.com" target="_blank" rel="noreferrer">moment</a> objects and expressed in <a href="https://en.wikipedia.org/wiki/Coordinated_Universal_Time" target="_blank" rel="noreferrer">UTC</a>.</p></blockquote><h3 id="context" tabindex="-1">Context <a class="header-anchor" href="#context" aria-label="Permalink to &quot;Context&quot;">​</a></h3><p>One key aspect of access control is to filter the data resources a user can reach. The <strong>KDK</strong> can help to segregate data at the source level, ie the database, using what we call a <strong>context</strong> (more details in this <a href="https://blog.feathersjs.com/access-control-strategies-with-feathersjs-72452268739d" target="_blank" rel="noreferrer">article</a>). If it makes sense for your assets to only be accessed in a given business context (e.g. within an &quot;organisation&quot; or a &quot;workspace&quot;) you can create a dedicated database with associated collections (respectively services) to hold (respectively manage) the data when the context is made available, and simply remove it when it is not anymore.</p><p>The context is usually also managed as a business object providing information about it like UUID, name, etc. and stored in a collection accessible through a service. For instance an application might manage a list of organisations as contexts, which can be listed using a service, and for each orgnisation provide a database storing all data collections related to the organisation with related services. Such services are called <strong>contextual services</strong> while services not related to a context are called <strong>global services</strong>.</p><p>Using the KDK you can dynamically create a database and declare services to access contextual assets stored in this segregated DB.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Under the hood the <a href="https://github.com/feathersjs-ecosystem/feathers-mongodb-management" target="_blank" rel="noreferrer">feathers-mongodb-management</a> module is used to dynamically create/remove a database per organisation whenever required</p></div><h3 id="permissions" tabindex="-1">Permissions <a class="header-anchor" href="#permissions" aria-label="Permalink to &quot;Permissions&quot;">​</a></h3><p>Organisation owners can manage member access to an organisation with a pre-defined set of permissions based on <a href="https://en.wikipedia.org/wiki/Attribute-based_access_control" target="_blank" rel="noreferrer">Attribute Based Access Control</a> (ABAC), which allows to enforce authorization decisions based on any attribute accessible to the application and not just the user&#39;s role. Similarly, resource owners can manage member access to a given resource (e.g. a <strong>group</strong>).</p><p>All permissions are stored along with the user so that they are always available once authenticated. They are organised by resource types (what we call <em>scopes</em>). The <strong>authorisation service</strong> allow to:</p><ol><li>add, respectively remove, a set of <strong>permissions</strong> (e.g. being a owner or a manager)</li><li>for a subject (i.e. a <strong>user</strong> in most case but it could be generalized)</li><li>on a resource (e.g. an <strong>organisation</strong> or a <strong>group</strong>).</li></ol><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Under the hood the <a href="https://stalniy.github.io/casl/" target="_blank" rel="noreferrer">CASL</a> module is used to manage the permissions</p></div><h2 id="domain-model" tabindex="-1">Domain model <a class="header-anchor" href="#domain-model" aria-label="Permalink to &quot;Domain model&quot;">​</a></h2><p>The <strong>domain model</strong> is a set of high-level abstractions that describes selected aspects of a sphere of activity, it is a representation of meaningful real-world concepts pertinent to the domain that are modeled in the software. The concepts include the data involved in the business and rules the business uses in relation to that data.</p><p>The class diagram used to represent the domain model in the <a href="https://en.wikipedia.org/wiki/Unified_Modeling_Language" target="_blank" rel="noreferrer">Unified Modeling Language</a> (UML) is presented afterwards. The Kalisio domain model is implemented as a hybridation between <a href="https://en.wikipedia.org/wiki/Object-oriented_programming" target="_blank" rel="noreferrer">objects</a> and <a href="https://en.wikipedia.org/wiki/Aspect-oriented_software_development" target="_blank" rel="noreferrer">cross-cutting concerns</a> within a layer that uses a lower-level layer for <a href="./data-model-view.html">persistence</a> and <em>publishes</em> an <a href="./../api/readme.html">API</a> to a higher-level layer to gain access to the data and behavior of the model.</p><p><img src="'+o+'" alt="Domain model"></p><p>To get into the details of this model look at the <a href="./data-model-view.html">persisted data model</a> and the provided <a href="./../api/readme.html">API</a>.</p>',22),n=[i];function l(c,d,h,m,p,g){return t(),a("div",null,n)}const f=e(r,[["render",l]]);export{b as __pageData,f as default};
