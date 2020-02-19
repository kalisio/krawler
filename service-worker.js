/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "7e2c329aaa92f111b9be1e133be1101f"
  },
  {
    "url": "about/contact.html",
    "revision": "1be5fc9e198a4f8795ab97f0a3eb959c"
  },
  {
    "url": "about/contributing.html",
    "revision": "a22f362af1c2ffadaa92e4de8f338338"
  },
  {
    "url": "about/introduction.html",
    "revision": "80a471ce6904b8ec6d8867b478fd9f27"
  },
  {
    "url": "about/license.html",
    "revision": "8bc5b29dcd2e003211c1bc8fca4be8c2"
  },
  {
    "url": "about/roadmap.html",
    "revision": "0b34185d717ea3608cb8aaf5e8f0fade"
  },
  {
    "url": "assets/css/0.styles.c3dcb25c.css",
    "revision": "5b8284fbf40289c2a5cb3b19b299ccbc"
  },
  {
    "url": "assets/img/etl.5c60286b.jpg",
    "revision": "5c60286bd6cad27887fd58e021dcc77d"
  },
  {
    "url": "assets/img/krawler-overview.29a3f099.png",
    "revision": "29a3f099a7aeecee4fa4f9061a449335"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.afb79e8d.js",
    "revision": "aad3ea0fd234f4836f5f80a9f0060cba"
  },
  {
    "url": "assets/js/11.340c4c80.js",
    "revision": "bd74c25fe1b811086d8f35464a8f2bd7"
  },
  {
    "url": "assets/js/12.c5e5f816.js",
    "revision": "7dea65c63ee265b1eee0d202439aa2a8"
  },
  {
    "url": "assets/js/13.eebdd72c.js",
    "revision": "ac0aed1ff1939528cbd963abb28d8f3f"
  },
  {
    "url": "assets/js/14.d8d655e2.js",
    "revision": "84d08fa7a2ff0b7a14c325bea793d58d"
  },
  {
    "url": "assets/js/15.567af17b.js",
    "revision": "2c826fe4a45b6f35d3de2fdf348d4b19"
  },
  {
    "url": "assets/js/16.cb1d6df1.js",
    "revision": "959886aab7e89a090048bb9c181366b5"
  },
  {
    "url": "assets/js/17.6b81414e.js",
    "revision": "de328df20c2f2800ae98d514b6f2e211"
  },
  {
    "url": "assets/js/18.5a7fee20.js",
    "revision": "13882a29d993a382cfcb6ad4c007827e"
  },
  {
    "url": "assets/js/19.37afae94.js",
    "revision": "c48cc2fd463f1ddb9193380ed948f53d"
  },
  {
    "url": "assets/js/2.fccf871e.js",
    "revision": "898b3b12197bdad4535a8e45943e012e"
  },
  {
    "url": "assets/js/20.a0ea2ef1.js",
    "revision": "80d4138f050b93575fdd1a56cfadbfd9"
  },
  {
    "url": "assets/js/21.befc381e.js",
    "revision": "0887d1b1e9113b25d11afb27678a5003"
  },
  {
    "url": "assets/js/22.10ff21b8.js",
    "revision": "8944efe8e02289d05ea71faadd280134"
  },
  {
    "url": "assets/js/3.8fc05678.js",
    "revision": "c5dca40a79fea29627d2325c267bc511"
  },
  {
    "url": "assets/js/4.eac0e397.js",
    "revision": "adfadbba85ff8b480e0ffb9918de7f0f"
  },
  {
    "url": "assets/js/5.90a2fe49.js",
    "revision": "04b9eb649dd6d180a389913f2dba609a"
  },
  {
    "url": "assets/js/6.319d5986.js",
    "revision": "e5fdb65db8c8dbe6061f2f07542ba542"
  },
  {
    "url": "assets/js/7.8cee272a.js",
    "revision": "a37cffaebc433bb82eaf90d3c41076b2"
  },
  {
    "url": "assets/js/8.9b1b4427.js",
    "revision": "375f2eb7e04b4d61952d81a34ae95a31"
  },
  {
    "url": "assets/js/9.e3836b3a.js",
    "revision": "a3ad2c1307ad2ad4b29fc09a3b5e02dd"
  },
  {
    "url": "assets/js/app.276fed0d.js",
    "revision": "f7c696f7d64cb7992ed3575718453ea6"
  },
  {
    "url": "examples/index.html",
    "revision": "cdff5b8ac86de2802219391d2751896d"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "e125d8e2b3703d8a0eab2ea4684a5001"
  },
  {
    "url": "guides/index.html",
    "revision": "73fa41e8bca6a84664b777707a4fa1dd"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "f906a491837126c290f1b693375638cc"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "fff701e563a14f5d08afa25bcad25fa7"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "79c2e826be913c25cd0360605de1c267"
  },
  {
    "url": "index.html",
    "revision": "b04a9c74a61900c294cde4592d1d2e98"
  },
  {
    "url": "reference/hooks.html",
    "revision": "404560fc344a48d3f5609714c0c242dd"
  },
  {
    "url": "reference/index.html",
    "revision": "12a4ae95f9c0e06d5ab5d3ce5b3ec4f7"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "72968145d717a6494df553e905e60295"
  },
  {
    "url": "reference/services.html",
    "revision": "1f5ae45da4f62524cc010d586a163382"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
