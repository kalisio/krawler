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
    "revision": "6f50a777f21508aec02c8c0033b702c6"
  },
  {
    "url": "about/contact.html",
    "revision": "2a4bc7b1835f1f19362bdde95d0e3e6e"
  },
  {
    "url": "about/contributing.html",
    "revision": "aa984edcb1a9d0f9d60e271e03ecfc11"
  },
  {
    "url": "about/introduction.html",
    "revision": "1fdd11a41b74ffb645dcff24cf1123bb"
  },
  {
    "url": "about/license.html",
    "revision": "b272dbb4b6627447354380fcb763a2b8"
  },
  {
    "url": "about/roadmap.html",
    "revision": "2fdfe94ad126acd7f7d28a569ec021a1"
  },
  {
    "url": "assets/css/0.styles.02346099.css",
    "revision": "7344d66e2aadfc74a4e96800bf77c568"
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
    "url": "assets/js/10.8c62b894.js",
    "revision": "0f64e6116711c3553c0035e6fa348751"
  },
  {
    "url": "assets/js/11.06e80762.js",
    "revision": "04696fd458477627768f57b2146df2c9"
  },
  {
    "url": "assets/js/12.15fc4e89.js",
    "revision": "e9ebb3f2c7c90855386a54daed78f76c"
  },
  {
    "url": "assets/js/13.91b28054.js",
    "revision": "3cd58c5aec52838e648a318fa66c8202"
  },
  {
    "url": "assets/js/14.ac3e0aa4.js",
    "revision": "52f6f43acc66c2fef555e8d664c9ed38"
  },
  {
    "url": "assets/js/15.04334bbb.js",
    "revision": "171c5f1426dde5d991bb29743b452355"
  },
  {
    "url": "assets/js/16.4bade4d3.js",
    "revision": "69452b1a5771ffc0768a2d8dc525c9c5"
  },
  {
    "url": "assets/js/17.7474505d.js",
    "revision": "3dbce66a3441cabdfff62669fe68935c"
  },
  {
    "url": "assets/js/18.d69a7658.js",
    "revision": "1b9d0d0983cd9a10bdf3836980f544f9"
  },
  {
    "url": "assets/js/19.aa4fabb1.js",
    "revision": "ff5433a5384c57807f03cb1769295377"
  },
  {
    "url": "assets/js/2.b4c0037f.js",
    "revision": "54fb301630f081f5e4c2abbe0be8220a"
  },
  {
    "url": "assets/js/20.5225eaac.js",
    "revision": "164db8103ee77e6e9980d85f4fd340df"
  },
  {
    "url": "assets/js/21.e44bac18.js",
    "revision": "abcee0a6c107660567e129b7e787facc"
  },
  {
    "url": "assets/js/22.4957bf38.js",
    "revision": "6bd8924883446677e51bd59a855c04c4"
  },
  {
    "url": "assets/js/23.5d75c968.js",
    "revision": "8e248366602d3e29ee7880629d70d846"
  },
  {
    "url": "assets/js/24.15cf4e7a.js",
    "revision": "ac55af03fa9c8f15afbd7e3d9d71abca"
  },
  {
    "url": "assets/js/25.85d8ac2c.js",
    "revision": "18237f446f87937aa1e33f0cd82cc628"
  },
  {
    "url": "assets/js/26.e0d95a16.js",
    "revision": "3aa74257731d87a6aff7b1e250995093"
  },
  {
    "url": "assets/js/27.3c917690.js",
    "revision": "5006046c97f5c89c3d67616f174dbe76"
  },
  {
    "url": "assets/js/28.858df41a.js",
    "revision": "20988bbbc295da757f329bf4d3370b9f"
  },
  {
    "url": "assets/js/29.2e6acc1b.js",
    "revision": "3ffc9c1e5dff1ef423afba10b3b86d2a"
  },
  {
    "url": "assets/js/3.82d42272.js",
    "revision": "a19eadf8ccff77113eeb55499beee746"
  },
  {
    "url": "assets/js/4.9c47dc20.js",
    "revision": "a45e95404c5b05871e9e14b2c489cc7b"
  },
  {
    "url": "assets/js/5.8042ca6f.js",
    "revision": "e932a89f75042c8e6a159d56ce1841d3"
  },
  {
    "url": "assets/js/6.c3a08bef.js",
    "revision": "d7cc39c4117bb79346b969060ff2f4f3"
  },
  {
    "url": "assets/js/7.03ff545a.js",
    "revision": "84feff32309ef9014644aeb1ef138314"
  },
  {
    "url": "assets/js/8.27205470.js",
    "revision": "3729007797e08c6237b6fafcf2f68063"
  },
  {
    "url": "assets/js/9.e1ed15f6.js",
    "revision": "20a0efb5b0b7f14e6aa47d3d7b6f8799"
  },
  {
    "url": "assets/js/app.0489c382.js",
    "revision": "f28b5c5c0afc1c8738f59c6bb3f51276"
  },
  {
    "url": "examples/index.html",
    "revision": "2dc380771928812dc9ec321b7da84edb"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "52232ee723306675da1c75a33b2cc56c"
  },
  {
    "url": "guides/index.html",
    "revision": "5e1d62ec8ab07c61df61447d2ece1b1e"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "3a0d8b4147aa858b7b87cb99902ea696"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "7349e472bdb5fce89e1d875f771bc158"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "2182b9cbec0534d8e3d0d63d39d85b38"
  },
  {
    "url": "index.html",
    "revision": "69df80139ede46fa8e1dd7393c4c7c69"
  },
  {
    "url": "reference/hooks.html",
    "revision": "0d65f071f5a14f1fb906f89aea4e4783"
  },
  {
    "url": "reference/index.html",
    "revision": "2c17e9a0852c79f49877378c51690845"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "3020fa57fd8830aff7e68c5330cb717b"
  },
  {
    "url": "reference/services.html",
    "revision": "cec00071e4b7ea205c6fc03ee47b9dd9"
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
