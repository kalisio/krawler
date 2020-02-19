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
    "revision": "8bd9450bb291af7c87c86edf8615beb7"
  },
  {
    "url": "about/contact.html",
    "revision": "da3a9575c7e1ec6a70f2f4004ae74ffe"
  },
  {
    "url": "about/contributing.html",
    "revision": "6bb6e72f2d1eca1e90ff8c691a3f3544"
  },
  {
    "url": "about/introduction.html",
    "revision": "69f3a7b381ee931490328a477bd9e559"
  },
  {
    "url": "about/license.html",
    "revision": "1ff6182a766a9dbe29c3f6452c4632af"
  },
  {
    "url": "about/roadmap.html",
    "revision": "4e1c84d657027050f015d60274bf687a"
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
    "url": "assets/js/12.139b1d5f.js",
    "revision": "1ba8483ffb2b805d3403de668807a2c6"
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
    "url": "assets/js/5.55435292.js",
    "revision": "5f2ab4e045922bf71a8f4b07894d4506"
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
    "url": "assets/js/app.c9ac0350.js",
    "revision": "541dd3d07952d53b0b66108e3a3783f7"
  },
  {
    "url": "examples/index.html",
    "revision": "1110817fab4ed4a88852f94b345cc41e"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "1b6de616c77e8fa551bcf367b2a2445c"
  },
  {
    "url": "guides/index.html",
    "revision": "18894d59c1f952d23bdb8a84f4f50027"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "c56722fd2da0fbb5fb7ed0be6ce2c538"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "a7dd569ccff2b7efd6b6be1f53f01e2a"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "83c38625c189a0f674e5ac6725b6f004"
  },
  {
    "url": "index.html",
    "revision": "60f61f18a288a1dccb00724521cda553"
  },
  {
    "url": "reference/hooks.html",
    "revision": "dfb1075cb7aaab302e4ad63c2a35ae8f"
  },
  {
    "url": "reference/index.html",
    "revision": "747ee98e4bdf16352aaf6f35174cc236"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "00a701d5100835ad8e022fef61af7226"
  },
  {
    "url": "reference/services.html",
    "revision": "626ff366a7b1c9636c24bc22a377741f"
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
