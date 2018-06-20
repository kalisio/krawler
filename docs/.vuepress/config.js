module.exports = {
  base: '/krawler/',
  title: 'Krawler',
  description: 'A minimalist Geospatial ETL',
  head: [
    ['link', { rel: 'icon', href: `https://s3.eu-central-1.amazonaws.com/kalisioscope/krawler/krawler-icon-64x64.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }]
  ],
  serviceWorker: false,
  theme: 'kalisio',
  themeConfig: {
    docsDir: 'docs',
    nav: [
      {
        text: 'What is it ?',
        link: '/what-is-it/',
      },
      {
        text: 'How doest it work ?',
        link: '/how-does-it-work/'
      },
      {
        text: 'How to use it ?',
        link: '/how-to-use-it/'
      },
      {
        text: 'License',
        link: '/license/'
      },
      {
        text: 'GitHub',
        link: 'https://github.com/kalisio/krawler'
      }
    ]
  }
}