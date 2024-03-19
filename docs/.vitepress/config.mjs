import { defineConfig } from 'vitepress'
import { OramaPlugin } from '@orama/plugin-vitepress'

export default defineConfig({
  base: '/krawler/',
  title: 'Krawler',
  description: 'A minimalist Geospatial ETL',
  head: [
    ['link', { rel: 'icon', href: `https://s3.eu-central-1.amazonaws.com/kalisioscope/krawler/krawler-icon-64x64.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }]
  ],
  vite: {
    plugins: [OramaPlugin()]
  },
  theme: 'kalisio',
  themeConfig: {
    logo: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/krawler/krawler-icon-64x64.png',
    socialLinks: [        
      { icon: 'linkedin', link: 'https://fr.linkedin.com/company/kalisio' },
      { icon: 'twitter', link: 'https://twitter.com/Kalisio3' },
      { icon: 'github', link: 'https://github.com/kalisio' }
    ],
    nav: [
      { text: 'About', link: '/about/introduction' },
      { text: 'Guides', link: '/guides/understanding-krawler' },
      { text: 'Reference', link: '/reference/services' },
      { text: 'Examples', link: '/examples/' },
      { text: 'GitHub', link: 'https://github.com/kalisio/krawler' }
    ],
    sidebar: {
      '/about/': getAboutSidebar(),
      '/guides/': getGuidesSidebar(),
      '/reference/': getReferenceSidebar(),
      '/examples/': getExamplesSidebar()
    },
    footer: {
      copyright: 'MIT Licensed | Copyright © 2017-20xx Kalisio'
    }
  }
})

function getAboutSidebar () {
  return [
    { text: 'Introduction', link: '/about/introduction' },
    { text: 'Roadmap', link: '/about/roadmap' },
    { text: 'Contributing', link: '/about/contributing' },
    { text: 'License', link: '/about/license' },
    { text: 'Contact', link: '/about/contact' }
  ] 
}

function getGuidesSidebar () {
  return [
    { text: 'Understanding Krawler', link: '/guides/understanding-krawler' },
    { text: 'Installing Krawler', link: '/guides/installing-krawler' },
    { text: 'Using Krawler', link: '/guides/using-krawler' },
    { text: 'Extending Krawler', link: '/guides/extending-krawler' }
  ]
}

function getReferenceSidebar () {
  return [
    { text: 'Services', link: '/reference/services' },
    { text: 'Hooks', link: '/reference/hooks' },
    { text: 'Known-issues', link: '/reference/known-issues' }
  ]
}

function getExamplesSidebar () {
  return [
  ]
}
