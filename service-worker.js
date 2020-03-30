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
    "revision": "ea2b11abebc031b65e67d82b416d9996"
  },
  {
    "url": "about/contact.html",
    "revision": "54578f5366e8928f23b22fbe50f3723d"
  },
  {
    "url": "about/contributing.html",
    "revision": "6d8de00291c36e5fcf3450b7888d2a72"
  },
  {
    "url": "about/introduction.html",
    "revision": "233bd00a2f57062455f9ca0f9bc5b4d2"
  },
  {
    "url": "about/license.html",
    "revision": "3a85f8633b0e6e70b07e7f22455de122"
  },
  {
    "url": "about/roadmap.html",
    "revision": "8c1353863d09c797fe038f756a913980"
  },
  {
    "url": "assets/css/0.styles.b96f908c.css",
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
    "url": "assets/js/10.3785444b.js",
    "revision": "779e1f37ba78fc3feab631c7deb668c2"
  },
  {
    "url": "assets/js/11.6483caea.js",
    "revision": "596120c26ba8864dea2bb4de87281a04"
  },
  {
    "url": "assets/js/12.702527f9.js",
    "revision": "6d7e919e3b038279821933047dce9228"
  },
  {
    "url": "assets/js/13.3c90b84a.js",
    "revision": "fcc610eba79cc27d6ef6c092e9f993e0"
  },
  {
    "url": "assets/js/14.65ed7b9f.js",
    "revision": "8a440fc2fcc3c683249ca2a303e51eea"
  },
  {
    "url": "assets/js/15.5154f212.js",
    "revision": "73879991c29ed6dcddff5dfde5a5aa09"
  },
  {
    "url": "assets/js/16.40aa3d44.js",
    "revision": "b980657219b81ff2551c6c5fa18a3182"
  },
  {
    "url": "assets/js/17.c4c5a00d.js",
    "revision": "126a72d4960b50de291e7682141aeffa"
  },
  {
    "url": "assets/js/18.fc220f38.js",
    "revision": "d08e2f3ad319f4647542241c95a692a1"
  },
  {
    "url": "assets/js/19.edfc5074.js",
    "revision": "0d3edb5be5e5e773de717972617ddcd6"
  },
  {
    "url": "assets/js/2.3d1476b8.js",
    "revision": "879026a61aa96d7c73750c323e2354aa"
  },
  {
    "url": "assets/js/20.f08b35da.js",
    "revision": "b39c520f33e1b751d71b6f0e47db3baf"
  },
  {
    "url": "assets/js/21.2016c968.js",
    "revision": "e0b9cf3b6515e33135fb3c920f95767b"
  },
  {
    "url": "assets/js/22.6e5606ae.js",
    "revision": "072dc06ff40117d727fb074f94095a07"
  },
  {
    "url": "assets/js/23.723763a2.js",
    "revision": "85962111a38f74e235efb83422532383"
  },
  {
    "url": "assets/js/24.de066fe1.js",
    "revision": "410213c7f91e68f7ec6d1a7b7a7f6d7b"
  },
  {
    "url": "assets/js/3.56e7fc0c.js",
    "revision": "a707e3b63dba7cac7a939b9047b8fa9a"
  },
  {
    "url": "assets/js/4.c758858b.js",
    "revision": "cd58687ade874e1a28f5a7fd8057f859"
  },
  {
    "url": "assets/js/5.34770660.js",
    "revision": "4b000f48ad29f289945970914a0f9ae3"
  },
  {
    "url": "assets/js/6.7e2fd059.js",
    "revision": "655c844d0709c94a73d6dfc1bd2d1746"
  },
  {
    "url": "assets/js/7.dc83bd11.js",
    "revision": "7423ac4d23eac95b3620cd4ab27aaca3"
  },
  {
    "url": "assets/js/8.c78dfdea.js",
    "revision": "bf85f30f36e994827e94c551e0a03087"
  },
  {
    "url": "assets/js/9.848d58e0.js",
    "revision": "204cb184a4907ec52757a3ec29993456"
  },
  {
    "url": "assets/js/app.72958ae2.js",
    "revision": "fe65831b8805ddb5fd2163b26d5151ea"
  },
  {
    "url": "examples/index.html",
    "revision": "436dfbd8656230c96bcb0b34d2903615"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "1ee8cc2a034e5977f85a4ebc536a897c"
  },
  {
    "url": "guides/index.html",
    "revision": "a2f267ebedaafe9734ce861a301461b4"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "6ecaed1e34736d7d80dafc9ddde9e078"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "241a8598789eb95ed6644cffc282956c"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "86ffd9dcebb60b863f58fd4827404bb7"
  },
  {
    "url": "index.html",
    "revision": "e55533f451a6d59fdaf8efc1f36b4407"
  },
  {
    "url": "reference/hooks.html",
    "revision": "3a80afda3ecc15d4a5a0dad2490cb826"
  },
  {
    "url": "reference/index.html",
    "revision": "005ff415365827938a94d4f0c7ab4bfe"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "1b105d71f7ec5083abec47f20bf08e1c"
  },
  {
    "url": "reference/services.html",
    "revision": "84e535455bc3a1d2191ca304e0aea25f"
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
