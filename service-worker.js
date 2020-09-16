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
    "revision": "744b03597b015a09cf4cc51cbdbe0e93"
  },
  {
    "url": "about/contact.html",
    "revision": "8e67657e7f825d194bbe75e8eed83b73"
  },
  {
    "url": "about/contributing.html",
    "revision": "b37751da41d2217d24e9b5aed923815c"
  },
  {
    "url": "about/introduction.html",
    "revision": "9edbdc488b246628b8896cf164ad9b3e"
  },
  {
    "url": "about/license.html",
    "revision": "99315b21cf89620d9874cb1cec1e32e1"
  },
  {
    "url": "about/roadmap.html",
    "revision": "5d1caa8795645455fbd14df7213a6486"
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
    "url": "assets/js/19.f4475963.js",
    "revision": "d47f27a96eae27df1ea6a2f11c7d4cc6"
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
    "url": "assets/js/21.cab31eb4.js",
    "revision": "a8c2e7961d9741bcd4973a56d7e166bd"
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
    "url": "assets/js/app.7378ece6.js",
    "revision": "998cd522f4c88c961027602c143a8a02"
  },
  {
    "url": "examples/index.html",
    "revision": "ff5792242ec5489660cb3b8f56b3f740"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "c9e0dac1eb5e2c244136357b37e5b3f0"
  },
  {
    "url": "guides/index.html",
    "revision": "506a1ef8d7ce3f579acd4fa02981f8ab"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "d37dcd872835ff6bc0301788cface56f"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "e603c20eadc133625a84571b6bf1abd7"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "05cf4067fec0a4b705bdbcbe460a5c17"
  },
  {
    "url": "index.html",
    "revision": "755aa238893c3b56a330ba5e2cc09d81"
  },
  {
    "url": "reference/hooks.html",
    "revision": "4c3b4c9433a048f3764e741bb14890db"
  },
  {
    "url": "reference/index.html",
    "revision": "362e8f060216862271515435bb90c948"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "5f8fdd541c1960656d81c54aad189e67"
  },
  {
    "url": "reference/services.html",
    "revision": "e4998c03fbaa95987216f5d64ed39701"
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
