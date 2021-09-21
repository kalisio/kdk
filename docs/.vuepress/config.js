module.exports = {
  base: '/kdk/',
  port: 8888,
  title: 'KDK',
  description: 'The Kalisio Development Kit',
  head: [
    ['link', { rel: 'icon', href: `https://s3.eu-central-1.amazonaws.com/kalisioscope/kdk/kdk-icon-64x64.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }]
  ],
  theme: 'kalisio',
  themeConfig: {
    nav: [
      { text: 'About', link: '/about/' },
      { text: 'Guides', link: '/guides/' },
      { text: 'Architecture', link: '/architecture/' },
      { text: 'API', link: '/api/' },
      { text: 'Tips', link: '/tips/' },
      { text: 'Tools', link: '/tools/' }
    ],
    sidebar: {
      '/about/': getAboutSidebar(),
      '/guides/': getGuidesSidebar(),
      '/architecture/': getArchitectureSidebar(),
      '/api/': getAPISidebar(),
      '/tips/': getTipsSidebar(),
      '/tools/': getToolsSidebar()
    }
  }
}

function getAboutSidebar () {
  return [
    '',
    'roadmap',
    'contributing',
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
      children: ['development/setup', 'development/develop', 'development/configure', 'development/deploy', 'development/publish', 'development/testing' ] 
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
      title: 'core',
      children: [ 'core/', 'core/application', 'core/services', 'core/hooks', 'core/components', 'core/mixins' ]
    },
    {
      title: 'map',
      children: [ 'map/', 'map/services', 'map/hooks', 'map/components', 'map/mixins', 'map/map-mixins', 'map/globe-mixins' ]
    }
  ]
}

function getTipsSidebar () {
  return [
    '',
    'app-development',
    'mobile-configuration'
  ]
}

function getToolsSidebar () {
  return [
    '',
    'cli',
    'browsers',
    'documentation',
    'infrastructure'
  ]
}