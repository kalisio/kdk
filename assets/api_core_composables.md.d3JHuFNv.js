import{_ as t,c as e,o,V as s}from"./chunks/framework.MC2QjGNi.js";const m=JSON.parse('{"title":"Composables","description":"","frontmatter":{},"headers":[],"relativePath":"api/core/composables.md","filePath":"api/core/composables.md"}'),i={name:"api/core/composables.md"},a=s('<h1 id="composables" tabindex="-1">Composables <a class="header-anchor" href="#composables" aria-label="Permalink to &quot;Composables&quot;">​</a></h1><h2 id="usestore" tabindex="-1">useStore <a class="header-anchor" href="#usestore" aria-label="Permalink to &quot;useStore&quot;">​</a></h2><p>Used to setup a reactive store, call <strong>useStore()</strong> with the following arguments:</p><ul><li><strong>name</strong> unique store name within the application</li><li><strong>initialStore</strong> initial store content if any</li></ul><p>The composable exposes the following:</p><ul><li><strong>store</strong>: the created store object</li><li><strong>clear()</strong>: reset store content</li><li><strong>set(path, value)</strong>: set a store value by path</li><li><strong>get(path)</strong>: get a store value by path</li><li><strong>unset(path)</strong>: unset a store value by path</li><li><strong>has(path)</strong>: test if a store has a value by path</li><li><strong>forOwn(f)</strong>: call function <code>f</code> on each <code>(value, key)</code> of the store</li></ul><h2 id="useselection" tabindex="-1">useSelection <a class="header-anchor" href="#useselection" aria-label="Permalink to &quot;useSelection&quot;">​</a></h2><p>Used to setup a reactive store for selection items, call <strong>useSelection()</strong> with the following arguments:</p><ul><li><strong>name</strong> unique store name within the application</li><li><strong>options</strong> options to setup the store <ul><li><strong>matches</strong> comparison function to identify two selected items as equal, defaults to Lodash <a href="https://lodash.com/docs/4.17.15#matches" target="_blank" rel="noreferrer">matches</a></li></ul></li></ul><p>The composable exposes the following:</p><ul><li><strong>selection</strong>: the created store object</li><li><strong>clearSelection()</strong>: reset selection content</li><li><strong>get/setSelectionMode(mode)</strong>: get current selection mode or switch between <code>&#39;single&#39;</code> or <code>&#39;multiple&#39;</code> mode</li><li><strong>get/setSelectionFilter(filter)</strong>: get/set filtering function to avoid selecting certain items</li><li><strong>selectItem(path)</strong>: select a new item</li><li><strong>unselectItem(path)</strong>: unselect an item</li><li><strong>has/getSelectedItem()</strong>, <strong>has/getSelectedItems()</strong>: check for selected item(s) depending on selection mode</li></ul><h2 id="activity" tabindex="-1">Activity <a class="header-anchor" href="#activity" aria-label="Permalink to &quot;Activity&quot;">​</a></h2><h3 id="useactivity" tabindex="-1">useActivity <a class="header-anchor" href="#useactivity" aria-label="Permalink to &quot;useActivity&quot;">​</a></h3><p>Used to setup states and options for a new activity, call <strong>useActivity()</strong> with the following arguments:</p><ul><li><strong>name</strong> unique activity name within the application</li><li><strong>options</strong> options to setup the activity <ul><li><strong>selection</strong> <code>true</code> to also create a selection store associated with the activity</li><li><strong>state</strong> initial state content if any</li></ul></li></ul><blockquote><p>Causes the current activity to be automatically reset on unmount.</p></blockquote><p>The composable exposes the following:</p><ul><li><strong>state</strong>: the store object for activity state</li><li><strong>options</strong>: the store object for activity options</li><li><strong>setCurrentActivity(activity)</strong>: set the given component as the current activity</li><li>elements exposed by the <a href="./composables.html#useselection">selection composable</a> associated to the activity</li></ul><h3 id="usecurrentactivity" tabindex="-1">useCurrentActivity <a class="header-anchor" href="#usecurrentactivity" aria-label="Permalink to &quot;useCurrentActivity&quot;">​</a></h3><p>Used to access the current activity, call <strong>useCurrentActivity()</strong> with the following arguments:</p><ul><li><strong>options</strong> options to retrieve the activity <ul><li><strong>selection</strong> <code>true</code> to also retrieve the selection store associated with the activity</li><li><strong>state</strong> initial state content if any</li></ul></li></ul><blockquote><p>Causes the current activity to be automatically reset on unmount.</p></blockquote><p>The composable exposes the following:</p><ul><li><strong>state</strong>: the store object for current activity state</li><li><strong>options</strong>: the store object for current activity options</li><li>elements exposed by the <a href="./composables.html#useselection">selection composable</a> associated to the activity</li></ul><h2 id="usecollection" tabindex="-1">useCollection <a class="header-anchor" href="#usecollection" aria-label="Permalink to &quot;useCollection&quot;">​</a></h2><p><em>TODO</em></p>',26),l=[a];function n(r,c,u,h,g,p){return o(),e("div",null,l)}const b=t(i,[["render",n]]);export{m as __pageData,b as default};
