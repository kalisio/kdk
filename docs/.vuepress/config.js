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
        text: 'How to use it ?',
        items: [
          { text: 'The Bascis', link: '/how-to-use-it/the-basics.md' },
          { text: 'Development', link: '/how-to-use-it/development.md' },
		  { text: 'Tools', link: '/how-to-use-it/tools.md' }
        ]
      },
      {
        text: '   ?',
        items: [
          { text: 'GitHub', link: 'https://github.com/kalisio/kdk' },
          { text: 'Contributing', link: '/CONTRIBUTING.md' },
          { text: 'License', link: '/LICENSE.md' }
        ]
      }
    ]
  }
}