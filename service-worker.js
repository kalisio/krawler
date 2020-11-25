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
    "revision": "54449dae69cc69f3de55c52b408b74b2"
  },
  {
    "url": "about/contact.html",
    "revision": "f8fb0e2d7eedce283a95f57e85f4d081"
  },
  {
    "url": "about/contributing.html",
    "revision": "0b7f6f377e8e17049fbbf0c86567068e"
  },
  {
    "url": "about/introduction.html",
    "revision": "b2610e9854fc4acc9498a9f1c1bd2313"
  },
  {
    "url": "about/license.html",
    "revision": "601a71a9242d45a3f96a436187bfa061"
  },
  {
    "url": "about/roadmap.html",
    "revision": "0c83081a5fd4a55eaf8061bac9e26f44"
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
    "url": "assets/js/app.93b9d3e1.js",
    "revision": "498e43f3dc3c777b141c5255ca2d35da"
  },
  {
    "url": "examples/index.html",
    "revision": "d486d030511332cda161528bd2711ed2"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "94e1f3b4d39448b15d628047875b9efc"
  },
  {
    "url": "guides/index.html",
    "revision": "12984bf344f462b74ffe6b18a7fb8867"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "bf8eef8cfd134ef431139114a2b162f5"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "0bb11104faa37ad69fb8474974ded99c"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "48e46c90ee473605b4352152e315b35e"
  },
  {
    "url": "index.html",
    "revision": "292d4d61dbc9fe498d712f301da8a19d"
  },
  {
    "url": "reference/hooks.html",
    "revision": "5886ba610decb47579fe02306d7a0e7b"
  },
  {
    "url": "reference/index.html",
    "revision": "ea6eaea885197711c0375c02d03f0294"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "69620b17ae003e7247423e5a4bc773f5"
  },
  {
    "url": "reference/services.html",
    "revision": "3d8be30c5a80b13bdb150b08c7ebfccc"
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
