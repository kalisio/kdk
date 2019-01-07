module.exports = {
  base: '/kdk/',
  title: 'KDK',
  description: 'The Kalisio Development Kit',
  head: [
    ['link', { rel: 'icon', href: `https://s3.eu-central-1.amazonaws.com/kalisioscope/kdk/kdk-icon-64x64.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }]
  ],
  plugins: ['@vuepress/pwa'],
  theme: 'kalisio',
  themeConfig: {
    docsDir: 'docs',
    plugins: {
      '@vuepress/pwa': {
        serviceWorker: true,
        updatePopup: true
      }
    },
    nav: [
      { text: 'About', link: '/about/' },
      { text: 'Guides', link: '/guides/' },
      { text: 'Architecture', link: '/architecture/' },
      { text: 'API', link: '/api/' }
    ],
    sidebar: {
      '/about/': getAboutSidebar(),
      '/guides/': getGuidesSidebar(),
      '/architecture/': getArchitectureSidebar(),
      '/api/': getAPISidebar()
    }
  }
}

function getAboutSidebar () {
  return [
    '',
    'roadmap',
    'license',
    'contact'
  ] 
}

function getGuidesSidebar () {
  return [
    '',
    { 
      title: 'The Basics',
      children: [ 'basics/step-by-step' ]
    },
    {
      title: 'Development',
      children: ['development/setup', 'development/develop', 'development/publish', 'development/deploy' ] 
    }
  ]
}

function getArchitectureSidebar () {
  return [
    '',
    'main-concepts', 
    'global-architecture', 
    'component-view',
    'data-model-view'
  ]
}

function getAPISidebar () {
  return [
    '',
    {
      title: 'kCore',
      children: [ 'kcore/', 'kcore/application', 'kcore/services', 'kcore/hooks', 'kcore/components', 'kcore/mixins' ]
    },
    {
      title: 'kTeam',
      children: [ 'kteam/', 'kteam/services', 'kteam/hooks', 'kteam/components', 'kteam/mixins' ]
    },
    {
      title: 'kNotify',
      children: [ 'knotify/', 'knotify/services', 'knotify/hooks', 'knotify/components', 'knotify/mixins' ]
    },
    {
      title: 'kMap',
      children: [ 'kmap/', 'kmap/services', 'kmap/hooks', 'kmap/components', 'kmap/mixins' ]
    },
    {
      title: 'kBilling',
      children: [ 'kbilling/', 'kbilling/services', 'kbilling/hooks', 'kbilling/components', 'kbilling/mixins' ]
    },
    {
      title: 'kEvent',
      children: [ 'kevent/', 'kevent/services', 'kevent/hooks', 'kevent/components', 'kevent/mixins' ]
    }
  ]
}
