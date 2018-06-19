module.exports = {
  base: '/krawler/',
  title: 'Krawler',
  description: 'A Terraform solution to build and operate Docker Swarm infrastructures',
  head: [
    ['link', { rel: 'icon', href: `https://s3.eu-central-1.amazonaws.com/kalisio-artwork/kalisio/kalisio-icon-64x64.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }]
  ],
  serviceWorker: false,
  theme: 'vue',
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