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
    "revision": "5186a311fbe7062620bfbded0cbf7b96"
  },
  {
    "url": "about/contact.html",
    "revision": "2c4d57c8d0b9f7068cc32b78fdced63d"
  },
  {
    "url": "about/contributing.html",
    "revision": "e7f21fc8247b02798268a3417c3e47a6"
  },
  {
    "url": "about/introduction.html",
    "revision": "17a58adb4280bd9eddffb5a2828290aa"
  },
  {
    "url": "about/license.html",
    "revision": "520ca238bf7ef29640bc6beb8a2b1332"
  },
  {
    "url": "about/roadmap.html",
    "revision": "f6899fb0a83b7334ec80fe159db5ac03"
  },
  {
    "url": "assets/css/0.styles.25ffafa9.css",
    "revision": "37cec3f2dcbc0ee8758cd12d536e4751"
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
    "url": "assets/js/10.85926714.js",
    "revision": "0db9f8ef70dedafe7fee60141c396b0b"
  },
  {
    "url": "assets/js/11.a81db617.js",
    "revision": "920c47eda10bb9a4ca40698ca9c9bd78"
  },
  {
    "url": "assets/js/12.97d5e5c8.js",
    "revision": "52cb4d4b0ecf3fe059cd3ae623acc25b"
  },
  {
    "url": "assets/js/13.6d4d1414.js",
    "revision": "37eaf0e235ea1193ad428a1bca7d8a5f"
  },
  {
    "url": "assets/js/14.2a241faf.js",
    "revision": "75b0860a22662d9fbd98a4f05072a680"
  },
  {
    "url": "assets/js/15.cfafa784.js",
    "revision": "2ad2c4bf265a869446f4cdc91e69ebd1"
  },
  {
    "url": "assets/js/16.ffa5d390.js",
    "revision": "bb7b5908d1a09c3a0d784f021f82130e"
  },
  {
    "url": "assets/js/17.68a49618.js",
    "revision": "5eb771fd9487c7f79208ba2c9af22800"
  },
  {
    "url": "assets/js/18.c480d4c8.js",
    "revision": "c10adc9916fd1d643145dc4af9ba78ca"
  },
  {
    "url": "assets/js/19.f4f5bcb6.js",
    "revision": "6056a8d906f9ae2c48ea3585d8c9f46d"
  },
  {
    "url": "assets/js/2.474da0f0.js",
    "revision": "6abdf1ca338d1f8ef94bbe1b6f3d0751"
  },
  {
    "url": "assets/js/20.4e88aa1e.js",
    "revision": "1864039376d0913b5c2e435e9b9f4173"
  },
  {
    "url": "assets/js/21.31348589.js",
    "revision": "58431d6d49711df2ea251c0a1565c45f"
  },
  {
    "url": "assets/js/22.7d77138c.js",
    "revision": "bf0ae2d552dfc0bf5c54783d2286367f"
  },
  {
    "url": "assets/js/23.7c355498.js",
    "revision": "1632de08352e75f656e6cca28aa3063b"
  },
  {
    "url": "assets/js/24.d8b242c9.js",
    "revision": "65197b1152534cc2150b4de7e176aac7"
  },
  {
    "url": "assets/js/3.dfa3e8be.js",
    "revision": "c849b801d1bd213b66f1922757960db1"
  },
  {
    "url": "assets/js/4.454cdf86.js",
    "revision": "10fd3a93dd3ea99014c5d5a912c6083d"
  },
  {
    "url": "assets/js/5.0faea6a2.js",
    "revision": "bad352099e449374fc8be4e4854cb5c0"
  },
  {
    "url": "assets/js/6.9558c952.js",
    "revision": "11253de8399e7f6820eb377f728fd114"
  },
  {
    "url": "assets/js/7.3658d3f9.js",
    "revision": "d909dd69c78fb97061ae562b83c43949"
  },
  {
    "url": "assets/js/8.b6ecc4d1.js",
    "revision": "00b08c9b2ec8c549e2aecf3a46c5b492"
  },
  {
    "url": "assets/js/9.d214e9fa.js",
    "revision": "0c4fb0767085652c399adc7084c0bd4a"
  },
  {
    "url": "assets/js/app.488a5ba1.js",
    "revision": "e761986694fe2de7de8f5a64028abeec"
  },
  {
    "url": "examples/index.html",
    "revision": "85252d9f38a5acffe342713338eff506"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "b8b4c26d52c3d9ab1542165ca13ad575"
  },
  {
    "url": "guides/index.html",
    "revision": "d26cc7f72679ee10c039a877747fd352"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "cc2337ef84d3a960aa9b5e76ea8f02c1"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "88a66b76c642d4268e9ce1912fcafb92"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "e539662ad75d2f3e080faeced5ad6d0a"
  },
  {
    "url": "index.html",
    "revision": "8878b46c40b83caa5bb3ddac14687d7a"
  },
  {
    "url": "reference/hooks.html",
    "revision": "3d9ef0659ed44a5fbc332ef9f0620b57"
  },
  {
    "url": "reference/index.html",
    "revision": "a1134f0be2aa969e96d1dc81c82e0989"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "f699bcfbb289bb6f2d4c3f556414bc50"
  },
  {
    "url": "reference/services.html",
    "revision": "5ce5e6ba754a0d9c1ae19ca45939fe0b"
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
