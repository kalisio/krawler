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
    "revision": "0b38a64ab438c8f8041575c64c8ff944"
  },
  {
    "url": "about/contact.html",
    "revision": "40a9820771e1832b7d37f951ce4fada4"
  },
  {
    "url": "about/contributing.html",
    "revision": "ba86181c6317e2b89c9a89930250eea1"
  },
  {
    "url": "about/introduction.html",
    "revision": "06e85136a8c35c5f742c7bb8ee338f1b"
  },
  {
    "url": "about/license.html",
    "revision": "a7ad24fd716532b6f67a0902bb278e70"
  },
  {
    "url": "about/roadmap.html",
    "revision": "fdcd66fa9c8a8b58b2b17396e34cdb78"
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
    "url": "assets/js/10.d0b49833.js",
    "revision": "04e3c19598b0e542bdee28bce2cc9dae"
  },
  {
    "url": "assets/js/11.a055a38f.js",
    "revision": "87fa5b1a2f30bc41f0ed4c3a90180098"
  },
  {
    "url": "assets/js/12.d5be6f50.js",
    "revision": "8b8839bde22e7c76c128322c49428a19"
  },
  {
    "url": "assets/js/13.e5df0eda.js",
    "revision": "447eb50ce806babf8b5c2e2080930bc6"
  },
  {
    "url": "assets/js/14.16b93c99.js",
    "revision": "f72260077bb3079f2c756e3684671aa4"
  },
  {
    "url": "assets/js/15.26b4fe99.js",
    "revision": "58c334b4332aaf909d265c7a2a156d21"
  },
  {
    "url": "assets/js/16.fb5bccc6.js",
    "revision": "e5d2139a690f0c083f3ad762d5c3b107"
  },
  {
    "url": "assets/js/17.14c284e3.js",
    "revision": "d974851aacb4f59404d47038f1a2796b"
  },
  {
    "url": "assets/js/18.2df46228.js",
    "revision": "e5ec75e89110f99c4d8a5f3c94cce130"
  },
  {
    "url": "assets/js/19.80bf8e88.js",
    "revision": "764dc578fa980dea2fbbfd870a7af236"
  },
  {
    "url": "assets/js/2.6dfb2940.js",
    "revision": "51aa3d107c8026e7c5526ad129012ec3"
  },
  {
    "url": "assets/js/20.3f972ebc.js",
    "revision": "faec4491ff78f40b0cd96b98e4eb2f3c"
  },
  {
    "url": "assets/js/21.8f82545a.js",
    "revision": "8a07bbe28a2723682da1a4d89848aa7a"
  },
  {
    "url": "assets/js/22.1471d756.js",
    "revision": "f4c5f504b26ed697c5b5362c49eef508"
  },
  {
    "url": "assets/js/23.c27d0c09.js",
    "revision": "d25ffc18c788a6a16c2272ae7ba303eb"
  },
  {
    "url": "assets/js/3.2d85a604.js",
    "revision": "55c4c6bf186961ad25af2ff1fe0908c4"
  },
  {
    "url": "assets/js/4.fccd6493.js",
    "revision": "76fbd8f6664ff3c887191329c8638e63"
  },
  {
    "url": "assets/js/5.8de28b45.js",
    "revision": "361e9b2e200693c41e3c645c4e9b0336"
  },
  {
    "url": "assets/js/6.55e9c8c0.js",
    "revision": "d89b5cbf171f80cd6aa93c1c260aaeec"
  },
  {
    "url": "assets/js/7.e25bb910.js",
    "revision": "4ef72f596c77606ab33dda77cd7ab67c"
  },
  {
    "url": "assets/js/8.f77beb3c.js",
    "revision": "ca7b56fb66036a7f29fe9a2bf475a86d"
  },
  {
    "url": "assets/js/9.2b279179.js",
    "revision": "2b3d4092a71a9579e56052273d69be6b"
  },
  {
    "url": "assets/js/app.c1f84e95.js",
    "revision": "bfa44140790ce853de211c58b06e5354"
  },
  {
    "url": "examples/index.html",
    "revision": "faf3e0bdffa835e5fde3202db04f7da5"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "329bca8cd0ee58dde9fdb50c593857a1"
  },
  {
    "url": "guides/index.html",
    "revision": "51680b0cdc4cb9ce7e35114fe7b64707"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "c9d368c4bd11e4d8fc6bea615e191f14"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "2a66ab9aa240157d003a83c3a8ebe164"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "662b4cd879f9c0676a82d1905d4a1297"
  },
  {
    "url": "index.html",
    "revision": "31c04d096a6e46eae4647c18d2bdcae2"
  },
  {
    "url": "reference/hooks.html",
    "revision": "4ba70d53714022d59b6e04db3d49cff5"
  },
  {
    "url": "reference/index.html",
    "revision": "d559e899eca23344e8bb9259fe068954"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "7260325bf2d45553c14362218df38d35"
  },
  {
    "url": "reference/services.html",
    "revision": "a85561dd62fded24d819388030da32a6"
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
