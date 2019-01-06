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
        updatePopup: {
          message: "New content is available.",
          buttonText: "Refresh"
        }
      }
    },
    nav: [
      {
        text: 'About',
        items: [
          { text: 'Introduction', link: '/about/introduction.md' },
          { text: 'Roadmap', link: '/about/roadmap.md' },
          { text: 'License', link: '/about/license.md' }
        ]
      },
      {
        text: 'Development',
        items: [
          { text: 'Architecture', link: '/development/architecture.md' }
        ]
      },
      {
        text: 'Modules',
        items: [
          { text: 'Overview', link: './modules/overview.md' },
          { text: 'kCore', 
            items: [
              { text: 'Application', link: './modules/kcore/application.md'},
              { text: 'Services', link: './modules/kcore/services.md'},
              { text: 'Hooks', link: './modules/kcore/hooks.md'},
              { text: 'Components', link: './modules/kcore/components.md'},
              { text: 'Mixins', link: './modules/kcore/mixins.md'},
              
            ]
          },
          { text: 'kTeam', 
            items: [
              { text: 'Application', link: './modules/kteam/application.md'},
              { text: 'Services', link: './modules/kteam/services.md'},
              { text: 'Hooks', link: './modules/kteam/hooks.md'},
              { text: 'Components', link: './modules/kteam/components.md'},
              { text: 'Mixins', link: './modules/kteam/mixins.md'},
            ]
          },
          { text: 'kNotify', 
            items: [
              { text: 'Application', link: './modules/knotify/application.md'},
              { text: 'Services', link: './modules/knotify/services.md'},
              { text: 'Hooks', link: './modules/knotify/hooks.md'},
              { text: 'Components', link: './modules/knotify/components.md'},
              { text: 'Mixins', link: './modules/knotify/mixins.md'},
            ]
          },
          { text: 'kMap', 
            items: [
              { text: 'Application', link: './modules/kmap/application.md'},
              { text: 'Services', link: './modules/kmap/services.md'},
              { text: 'Hooks', link: './modules/kmap/hooks.md'},
              { text: 'Components', link: './modules/kmap/components.md'},
              { text: 'Mixins', link: './modules/kmap/mixins.md'},
            ]
          },
          { text: 'kBilling', 
            items: [
              { text: 'Application', link: './modules/kbilling/application.md'},
              { text: 'Services', link: './modules/kbilling/services.md'},
              { text: 'Hooks', link: './modules/kbilling/hooks.md'},
              { text: 'Components', link: './modules/kbilling/components.md'},
              { text: 'Mixins', link: './modules/kbilling/mixins.md'},
            ]
          },
          { text: 'kEvent', 
            items: [
              { text: 'Application', link: './modules/kevent/application.md'},
              { text: 'Services', link: './modules/kevent/services.md'},
              { text: 'Hooks', link: './modules/kevent/hooks.md'},
              { text: 'Components', link: './modules/kevent/components.md'},
              { text: 'Mixins', link: './modules/kevent/mixins.md'},
            ]
          }
        ]
      }
    ]
  }
}