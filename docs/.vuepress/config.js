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
      { text: 'Modules', link: '/modules/' }
    ],
    sidebar: {
      '/about/': getAboutSidebar(),
      '/guides/': getGuidesSidebar(),
      '/modules/': getModuleSidebar()
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
    'the-basics',
    {
      title: 'Development',
      children: ['setup', 'develop', 'publish', 'deploy' ] 
    }
  ]
}

function getModuleSidebar () {
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
