<!--
  Semantic search over this documentation, backed by the knowledge service.

  A floating button, mounted once by the theme layout, so the search is one
  click away from every page. It returns links rather than a written answer,
  on purpose: the similarity scores of our index sit within about 0.03
  between the first and the sixth result, so nothing lets us name a winner
  confidently enough to redirect the reader. Three anchored links inform
  them faster than one wrong tab.
-->
<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, ref } from 'vue'
import { withBase } from 'vitepress'

// Where the knowledge service lives. Without it the panel says it is
// unavailable rather than calling some arbitrary origin.
const API = import.meta.env.VITE_KNOWLEDGE_URL || ''

// The service requires a bearer token. A public static site cannot carry one
// without exposing it, so it is only read when supplied at build time: the
// public docs ship without, an internal deployment can have one.
const TOKEN = import.meta.env.VITE_KNOWLEDGE_TOKEN || ''

const LOGO = 'https://kalisio.github.io/kalisioscope/kalisio/kalisio-icon-light.svg'

// Below this, treat it as nothing found. The vector database has no refusal
// threshold: without a floor, an off-topic question still returns the five
// least distant chunks.
const SCORE_FLOOR = 0.70

// Closer than this and the ranking carries no information, so say so.
const TIE_RANGE = 0.02

// Retrieval is markedly weaker on plain French -- measured, same index: an
// English phrasing scored 0.842 against the right page where its French
// counterpart scored 0.670 against the wrong one. Until the query is
// translated before the search, these nudge people towards English.
const SUGGESTIONS = [
  'how to create a service',
  'cluster markers on a map layer',
  'add a hook to a service',
  'configure the catalog'
]

// Rendered through a teleport, which has no server-side counterpart here:
// hold it back until mounted rather than fight a hydration mismatch.
const mounted = ref(false)
const open = ref(false)
const panel = ref(null)
const fab = ref(null)
const field = ref(null)
const question = ref('')
const results = ref([])
const state = ref('idle')   // idle · loading · ok · empty · error
const message = ref('')

onMounted(() => {
  mounted.value = true
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('pointerdown', onPointerDown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('pointerdown', onPointerDown)
})

function onKeydown (event) {
  if (event.key === 'Escape' && open.value) return close()
  // The shortcut every documentation site uses. Nothing else claims it here:
  // this site ships no built-in search.
  if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    open.value ? close() : show()
  }
}

// A click anywhere else dismisses the panel, as a popover should.
function onPointerDown (event) {
  if (!open.value) return
  if (panel.value?.contains(event.target)) return
  if (fab.value?.contains(event.target)) return
  close()
}

async function show () {
  open.value = true
  await nextTick()
  field.value?.focus()
}

// Hand the focus back to the button, or it lands on the document body and
// keyboard users lose their place.
function close () {
  open.value = false
  fab.value?.focus()
}

function ask (suggestion) {
  question.value = suggestion
  search()
}

// VitePress serves docs/a/b.md at <base>/a/b.html and derives its anchors
// from the headings, which is what the index stores as a breadcrumb.
// withBase keeps the link right both locally and under /kdk/ on Pages.
function link (hit) {
  // The index covers the whole repository, not just the site: the root
  // README is published nowhere and would yield a dead link.
  if (!hit.path.startsWith('docs/') || !hit.path.endsWith('.md')) return null
  const page = hit.path.slice(5).replace(/\.md$/, '.html')
  const heading = (hit.breadcrumb || '').split('>').pop().trim()
  return withBase(`/${page}`) + (heading ? `#${anchor(heading)}` : '')
}

// Mirrors VitePress' own slug rule, checked against the built site: a
// markdown link collapses to its text, inline code loses its backticks, and
// any run of non-alphanumeric characters becomes a single dash. Without the
// last one, `createService(name, options)` yields createservicename-options
// where the page carries createservice-name-options.
function anchor (heading) {
  return heading
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`/g, '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// The breadcrumb reads "Page > Section > Subsection". The last part is what
// the link jumps to, the rest is where it sits.
function section (hit) {
  const parts = (hit.breadcrumb || hit.path).split('>').map((p) => p.trim())
  return { title: parts[parts.length - 1], trail: parts.slice(0, -1).join(' › ') }
}

// One page often comes back several times: keep its best passage.
function deduplicate (hits) {
  const seen = new Map()
  for (const hit of hits) {
    const key = `${hit.repo}/${hit.path}`
    if (!seen.has(key) || seen.get(key).score < hit.score) seen.set(key, hit)
  }
  return [...seen.values()]
}

async function search () {
  const query = question.value.trim()
  if (!query) return
  if (!API) {
    message.value = 'VITE_KNOWLEDGE_URL is not set'
    state.value = 'error'
    return
  }
  state.value = 'loading'
  try {
    const headers = { 'Content-Type': 'application/json' }
    if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`
    const response = await fetch(`${API}/search`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, top_k: 12 })
    })
    if (response.status === 401) throw new Error('search is not authenticated')
    if (!response.ok) throw new Error(`the service answered ${response.status}`)
    // /search answers with a bare array, not a wrapping object.
    const hits = await response.json()
    results.value = deduplicate(Array.isArray(hits) ? hits : [])
      .filter((hit) => hit.score >= SCORE_FLOOR &&
                       (hit.content || '').trim().length > 40)
      .map((hit) => ({ ...hit, url: link(hit), ...section(hit) }))
      .filter((hit) => hit.url)
      .slice(0, 4)
    state.value = results.value.length ? 'ok' : 'empty'
  } catch (error) {
    message.value = error.message
    state.value = 'error'
  }
}

const tied = computed(() =>
  results.value.length > 1 &&
  results.value[0].score - results.value[1].score < TIE_RANGE)
</script>

<template>
  <Teleport v-if="mounted" to="body">
    <Transition name="ks-fade">
      <div
        v-if="open" ref="panel" class="ks-panel"
        role="dialog" aria-modal="false" aria-label="Search the documentation">
        <header class="ks-head">
          <span>Search the documentation</span>
          <button class="ks-close" aria-label="Close" @click="close">&times;</button>
        </header>

        <form class="ks-form" @submit.prevent="search">
          <input
            ref="field" v-model="question" type="search"
            placeholder="What are you looking for?"
            aria-label="Search the documentation" />
          <button type="submit" :disabled="state === 'loading'">Search</button>
        </form>

        <div class="ks-body">
          <template v-if="state === 'idle'">
            <p class="ks-note">
              Ask in your own words. Answers are links into this documentation,
              not generated text.
            </p>
            <ul class="ks-chips">
              <li v-for="suggestion in SUGGESTIONS" :key="suggestion">
                <button type="button" @click="ask(suggestion)">{{ suggestion }}</button>
              </li>
            </ul>
          </template>

          <p v-else-if="state === 'loading'" class="ks-note">Searching…</p>

          <p v-else-if="state === 'empty'" class="ks-note">
            Nothing close enough in the documentation. Try rephrasing in
            English — the documentation is written in English and retrieval is
            markedly more accurate there.
          </p>

          <p v-else-if="state === 'error'" class="ks-note ks-error">
            Search is unavailable ({{ message }}).
          </p>

          <template v-else>
            <p v-if="tied" class="ks-note">
              Several sections answer equally well — all of them are listed.
            </p>
            <ul class="ks-list">
              <li v-for="hit in results" :key="hit.url">
                <a :href="hit.url" @click="close">
                  <span class="ks-title">{{ hit.title }}</span>
                  <span v-if="hit.trail" class="ks-trail">{{ hit.trail }}</span>
                </a>
                <span class="ks-score">{{ hit.score.toFixed(2) }}</span>
                <p class="ks-excerpt">{{ hit.content.slice(0, 150) }}…</p>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </Transition>

    <button
      ref="fab" class="ks-fab" :aria-expanded="open"
      aria-label="Search the documentation"
      @click="open ? close() : show()">
      <img :src="LOGO" alt="" width="20" height="20" />
      <span>Ask the docs</span>
    </button>
  </Teleport>
</template>

<style scoped>
.ks-fab {
  position: fixed; right: 1.25rem; bottom: 1.25rem; z-index: 50;
  display: flex; align-items: center; gap: .5rem;
  padding: .6rem 1rem; border: 0; border-radius: 999px;
  background: var(--vp-c-brand-1); color: #fff; font-size: .9rem;
  font-weight: 600; cursor: pointer; box-shadow: 0 4px 14px rgb(0 0 0 / .25);
  transition: background-color .2s;
}
.ks-fab:hover { background: var(--vp-c-brand-2); }
.ks-fab img { display: block; }

.ks-panel {
  position: fixed; right: 1.25rem; bottom: 4.75rem; z-index: 50;
  display: flex; flex-direction: column;
  width: 380px; max-width: calc(100vw - 2.5rem); max-height: 70vh;
  border: 1px solid var(--vp-c-divider); border-radius: 10px;
  background: var(--vp-c-bg); box-shadow: 0 8px 30px rgb(0 0 0 / .25);
}
.ks-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: .75rem 1rem; border-bottom: 1px solid var(--vp-c-divider);
  font-weight: 600; font-size: .95rem;
}
.ks-close {
  border: 0; background: none; cursor: pointer; font-size: 1.3rem;
  line-height: 1; color: var(--vp-c-text-2);
}
.ks-form { display: flex; gap: .5rem; padding: .75rem 1rem; }
.ks-form input {
  flex: 1; min-width: 0; padding: .5rem .75rem; border-radius: 6px;
  border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.ks-form button {
  padding: .5rem .9rem; border-radius: 6px; border: 0;
  background: var(--vp-c-brand-1); color: #fff; cursor: pointer;
}
.ks-form button[disabled] { opacity: .6; cursor: default; }

.ks-body { overflow-y: auto; padding: 0 1rem 1rem; }
.ks-chips { list-style: none; display: flex; flex-wrap: wrap; gap: .4rem;
  padding: 0; margin: .75rem 0 0; }
.ks-chips button {
  padding: .3rem .6rem; border-radius: 999px; cursor: pointer;
  border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2); font-size: .78rem;
}
.ks-chips button:hover { color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); }

.ks-list { list-style: none; padding: 0; margin: 0; }
.ks-list li { padding: .6rem 0; border-top: 1px solid var(--vp-c-divider); }
.ks-list a { display: inline-flex; flex-direction: column; }
.ks-title { font-weight: 600; font-size: .9rem; }
.ks-trail { font-size: .75rem; color: var(--vp-c-text-3); }
.ks-score { float: right; font-size: .78em; color: var(--vp-c-text-3); }
.ks-excerpt { margin: .25rem 0 0; font-size: .82em; color: var(--vp-c-text-2); }
.ks-note { font-size: .85rem; color: var(--vp-c-text-2); margin: 0; }
.ks-error { color: var(--vp-c-danger-1); }

.ks-fade-enter-active, .ks-fade-leave-active { transition: opacity .15s, transform .15s; }
.ks-fade-enter-from, .ks-fade-leave-to { opacity: 0; transform: translateY(6px); }

@media (max-width: 480px) {
  .ks-fab span { display: none; }
  .ks-fab { padding: .7rem; }
}
</style>
