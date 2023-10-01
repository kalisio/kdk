import{_ as e,o as t,c as a,Q as o}from"./chunks/framework.70a39c86.js";const r="/kdk/assets/users-data-model.964b8a75.svg",i="/kdk/assets/organizations-data-model.98edb57e.svg",s="/kdk/assets/groups-data-model.fe5dbb43.svg",v=JSON.parse('{"title":"Data model-oriented view of the architecture","description":"","frontmatter":{},"headers":[],"relativePath":"architecture/data-model-view.md","filePath":"architecture/data-model-view.md"}'),d={name:"architecture/data-model-view.md"},l=o('<h1 id="data-model-oriented-view-of-the-architecture" tabindex="-1">Data model-oriented view of the architecture <a class="header-anchor" href="#data-model-oriented-view-of-the-architecture" aria-label="Permalink to &quot;Data model-oriented view of the architecture&quot;">​</a></h1><p>According to the <a href="https://docs.feathersjs.com/guides/about/philosophy.html" target="_blank" rel="noreferrer">Feathers philosophy</a> each data model is manipulated using a <a href="https://docs.feathersjs.com/api/services.html" target="_blank" rel="noreferrer">service interface</a> to perform <a href="https://en.wikipedia.org/wiki/Create,_read,_update_and_delete" target="_blank" rel="noreferrer">CRUD operations</a> of the <a href="https://docs.feathersjs.com/api/databases/common.html" target="_blank" rel="noreferrer">persistence layer</a>. So this data model-oriented view is a service-oriented view in the same manner.</p><p>Because data models internally rely on <a href="http://www.json.org/" target="_blank" rel="noreferrer">JSON</a> they are by nature hierarchical. In the following diagrams each nested JSON object is represented as a smaller <em>bubble</em> in a bigger <em>bubble</em> (the nesting/parent object), the data model instance being the root JSON object or the <em>biggest</em> bubble. The name of the bubble is the name of the nesting object property owing the nested object.</p><p>Data models are dynamic by nature, allowing any plugin to add custom fields whenever required using <a href="https://docs.feathersjs.com/api/hooks.html" target="_blank" rel="noreferrer">hooks</a>. Each data model includes an implicit <a href="https://mongodb.github.io/node-mongodb-native/api-bson-generated/objectid.html" target="_blank" rel="noreferrer">ObjectID</a> <code>_id</code> field provided by the database.</p><h2 id="user-data-model" tabindex="-1">User data model <a class="header-anchor" href="#user-data-model" aria-label="Permalink to &quot;User data model&quot;">​</a></h2><p>The most common properties of a user are described by the following data model:</p><p><img src="'+r+'" alt="User data model"></p><p>The details of each property are the following:</p><ul><li><strong>email</strong> : user e-mail used as an internal unique ID</li><li><strong>password</strong> : hashed user password</li><li><strong>locale</strong> : user locale when registering</li><li><strong>previousPasswords</strong> : hashed user password history if <a href="./../guides/basics/step-by-step.html#configuring-the-app">password policy has been enabled</a></li><li><strong>profile</strong> : user profile information including name</li><li><strong>[provider]</strong> : user profile information for associated OAuth provider, e.g. <code>google</code></li><li><strong>[scope]</strong> : user permissions for associated scope, e.g. <code>groups</code></li><li><strong>tags</strong> : user affected tags if any</li><li><strong>devices</strong> : user mobile devices if any, each time the user uses a new device it is registered</li></ul><h2 id="device-data-model" tabindex="-1">Device data model <a class="header-anchor" href="#device-data-model" aria-label="Permalink to &quot;Device data model&quot;">​</a></h2><p>The most common properties of a device object are described by the following data model:</p><p><strong>TODO</strong></p><p>This data model is manipulated through the <a href="./../api/core/services.html">Device API</a>.</p><p>The details of each property are the following:</p><ul><li><strong>platform</strong>: the platform of the device, e.g. <code>Android</code></li><li><strong>model</strong>: the model of the device, e.g. <code>SM-G930U</code></li><li><strong>manufacturer</strong>: the manufacturer of the device, e.g. <code>samsung</code></li><li><strong>uuid</strong>: UUID of the device</li><li><strong>registrationId</strong>: the ID of the associated device in the notification system (APNS or Firebase)</li><li><strong>arn</strong>: the ARN of associated SNS device</li><li><strong>lastActivity</strong>: the date/time of the last connection of this device</li></ul><p>Most data are retrieved using the <a href="https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device/" target="_blank" rel="noreferrer">cordova-plugin-device</a>.</p><h2 id="tag-data-model" tabindex="-1">Tag data model <a class="header-anchor" href="#tag-data-model" aria-label="Permalink to &quot;Tag data model&quot;">​</a></h2><p>The most common properties of a tag object are described by the following data model:</p><p><strong>TODO</strong></p><p>This data model is manipulated through the <a href="./../api/core/services.html">Tag API</a>.</p><p>The details of each property are the following:</p><ul><li><strong>scope</strong>: the scope of the tag (i.e. category), e.g. <code>skill</code></li><li><strong>value</strong>: the value of the tag, e.g. <code>developer</code></li><li><strong>count</strong>: the number of tagged objects</li><li><strong>context</strong>: the ID of the associated context object providing this tag if any (e.g. the organisation)</li><li><strong>topics</strong>: the ARN of associated SNS topics for each platform used to publish messages to tagged objects, used by the <a href="./../api/core/services.html#pusher-service">pusher service</a></li></ul><h2 id="organization-data-model" tabindex="-1">Organization data model <a class="header-anchor" href="#organization-data-model" aria-label="Permalink to &quot;Organization data model&quot;">​</a></h2><p>The most common properties of an organization are described by the following data model:</p><p><img src="'+i+'" alt="Organization data model"></p><p>This data model is manipulated through the <a href="./../api/core/services.html#organisations-service">organizations service</a>.</p><p>The details of each property are the following:</p><ul><li><strong>name</strong>: the name of the organisation</li><li><strong>topics</strong>: the ARN of associated SNS topics for each platform used to publish messages to organization&#39; members, used by the <a href="./../api/core/services.html#pusher-service">pusher service</a></li></ul><blockquote><p>the organization ObjectID is used as the internal DB name</p></blockquote><h2 id="group-data-model" tabindex="-1">Group data model <a class="header-anchor" href="#group-data-model" aria-label="Permalink to &quot;Group data model&quot;">​</a></h2><p>The most common properties of a group object are described by the following data model:</p><p><img src="'+s+'" alt="Group data model"></p><p>This data model is manipulated through the <a href="./../api/core/services.html#groups-service">groups service</a>.</p><p>The details of each property are the following:</p><ul><li><strong>name</strong>: the name of the group</li><li><strong>description</strong>: the description of the group</li><li><strong>topics</strong>: the ARN of associated SNS topics for each platform used to publish messages to group&#39; members, used by <a href="./../api/core/services.html#pusher-service">pusher service</a></li></ul>',35),n=[l];function h(c,p,g,m,u,f){return t(),a("div",null,n)}const _=e(d,[["render",h]]);export{v as __pageData,_ as default};