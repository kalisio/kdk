module.exports = {
  base: '/kdk/',
  title: 'KDK',
  description: 'The Kalisio Development Kit',
  head: [
    ['link', { rel: 'icon', href: `https://s3.eu-central-1.amazonaws.com/kalisioscope/kdk/kdk-icon-64x64.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }]
  ],
  serviceWorker: true,
  theme: 'kalisio',
  themeConfig: {
    docsDir: 'docs',
    serviceWorker: {
      updatePopup: true
    },
    nav: [
      {
        text: 'About',
        items: [
          { text: 'Introduction', link: '/about/intoduction.md' },
          { text: 'Roadmap', link: '/about/roadmap.md' },
          { text: 'Licence', link: '/about/licence.md' }
        ]
      },
      {
        text: 'Development',
        items: [
          { text: 'Architecture', link: '/how-to-use-it/architecture' }
        ]
      },
      {
        text: 'Modules',
        items: [
          { text: 'kCore', link: '/modules/kcore.md' },
          { text: 'kTeam', link: '/modules/kteam.md' },
          { text: 'kNotify', link: '/modules/knotify.md' },
          { text: 'kMap', link: '/modules/kmap.md' },
          { text: 'kEvent', link: '/modules/kevent.md' },
          { text: 'kBilling', link: '/modules/kbilling.md' }
        ]
      }
    ]
  }
}