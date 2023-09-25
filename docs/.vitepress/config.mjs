import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    base: '/kdk/',
    title: 'KDK',
    description: 'The Kalisio Development Kit',
    ignoreDeadLinks: true,
    head: [
      ['link', { href: 'https://cdnjs.cloudflare.com/ajax/libs/line-awesome/1.3.0/line-awesome/css/line-awesome.min.css', rel: 'stylesheet' }],
      ['link', { rel: 'icon', href: `https://s3.eu-central-1.amazonaws.com/kalisioscope/kdk/kdk-icon-64x64.png` }]
    ],
    themeConfig: {
      logo: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/kano/kano-icon-256x256.png',
      jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJkZXYua2FsaXNpby54eXoiLCJpc3MiOiJrYWxpc2lvIn0.CGvJwPPkuiFvNzo3zUBb-_vwD0CKbUfm7w7TkCY-Ts4',
      socialLinks: [{ icon: 'github', link: 'https://github.com/kalisio/kano' }],
      nav: [
        { text: 'About', link: '/about/introduction' },
        { text: 'Guides', link: '/guides/introduction' },
        { text: 'Architecture', link: '/architecture/introduction' },
        { text: 'API', link: '/api/introduction' },
        { text: 'Tips', link: '/tips/introduction' },
        { text: 'Tools', link: '/tools/introduction' }
      ],
      sidebar: {
        '/about/': getAboutSidebar(),
        '/guides/': getGuidesSidebar(),
        '/architecture/': getArchitectureSidebar(),
        '/api/': getAPISidebar(),
        '/tips/': getTipsSidebar(),
        '/tools/': getToolsSidebar()
      },
      footer: {
        copyright: 'MIT Licensed | Copyright © 2017-20xx Kalisio'
      }
    }
  })
)

function getAboutSidebar () {
  return [
    { text: 'About', link: '/about/introduction' },
    { text: 'Roadmap', link: '/about/roadmap' },
    { text: 'Contributing', link: '/about/contributing' },
    { text: 'License', link: '/about/license' },
    { text: 'Contact', link: '/about/contact' }
  ]
}

function getGuidesSidebar () {
  return [
    { text: 'Guides', link: '/guides/introduction' },
    { text: 'The Basics', collapsed: true, items: [{ text: 'Introduction to KDK', link: '/guides/basics/introduction' }]},
    { 
      text: 'Development', 
      collapsed: true, 
      items: [
        { text: 'Setup your environment', link: '/guides/development/setup' },
        { text: 'Develop with KDK', link: '/guides/development/develop' },
        { text: 'Testing with KDK', link: '/guides/development/test' },
        { text: 'Configure your app', link: '/guides/development/configure' },
        { text: 'Deploy your app', link: '/guides/development/deploy' },
        { text: 'Publish with KDK', link: '/guides/development/publish' }
      ]
    }
  ]
}

function getArchitectureSidebar () {
  return [
    { text: 'Architecture', link: '/architecture/introduction' },
    { text: 'Main concepts', link: '/architecture/main-concepts' },
    { text: 'Global architecture', link: '/architecture/global-architecture' },
    { text: 'Component view', link: '/architecture/component-view' },
    { text: 'Data model-oriented view of the architecture', link: '/architecture/data-model-view' }
  ]
}

function getAPISidebar () {
  return [
    { text: 'API', link: '/api/introduction' },
    { 
      text: 'core', 
      collapsed: true, 
      items: [
        { text: 'Overview', link: '/api/core/introduction' },
        { text: 'Application', link: '/api/core/application' },
        { text: 'Services', link: '/api/core/services' },
        { text: 'Hooks', link: '/api/core/hooks' },
        { text: 'Components', link: '/api/core/components' },
        { text: 'Mixins', link: '/api/core/mixins' }
      ]
    },
    { 
      text: 'map', 
      collapsed: true, 
      items: [
        { text: 'Overview', link: '/api/map/introduction' },
        { text: 'Services', link: '/api/map/services' },
        { text: 'Hooks', link: '/api/map/hooks' },
        { text: 'Components', link: '/api/map/components' },
        { text: 'Mixins', link: '/api/map/mixins' },
        { text: 'Map Mixins', link: '/api/map/map-mixins' },
        { text: 'Globe Mixins', link: '/api/map/globe-mixins' }
      ]
    }
  ]
}

function getTipsSidebar () {
  return [
    { text: 'Tips', link: '/tips/introduction' },
    { text: 'Application development', link: '/tips/app-development' },
    { text: 'Mobile configuration', link: '/tips/mobile-configuration' }
  ]
}

function getToolsSidebar () {
  return [
    { text: 'Tools', link: '/tools/introduction' },
    { text: 'Command-line tools', link: '/tools/cli' },
    { text: 'Browser-based tools', link: '/tools/browsers' },
    { text: 'Documentation', link: '/tools/documentation' },
    { text: 'Infrastructure', link: '/tools/infrastructure' }
  ]
}