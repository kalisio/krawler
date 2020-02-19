module.exports = {
  base: '/krawler/',
  title: 'Krawler',
  description: 'A minimalist Geospatial ETL',
  head: [
    ['link', { rel: 'icon', href: `https://s3.eu-central-1.amazonaws.com/kalisioscope/krawler/krawler-icon-64x64.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }]
  ],
  theme: 'kalisio',
  themeConfig: {
    docsDir: 'docs',
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
    }
  }
}

function getAboutSidebar () {
  return [
    'introduction',
    'roadmap',
    'contributing',
    'license',
    'contact'
  ] 
}

function getGuidesSidebar () {
  return [
    'understanding-krawler',
    'installing-krawler',
    'using-krawler',
    'extending-krawler'
  ]
}

function getReferenceSidebar () {
  return [
    'services',
    'hooks',
    'known-issues'
  ]
}

function getExamplesSidebar () {
  return [
  ]
}
