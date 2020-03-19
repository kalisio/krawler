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
    "revision": "5be3c3e46953ddac7b97259b1bc3bbdd"
  },
  {
    "url": "about/contact.html",
    "revision": "5f5903fa4744213a27fa3176b6751901"
  },
  {
    "url": "about/contributing.html",
    "revision": "9b7b5b3609b18c872badd52e2df4644f"
  },
  {
    "url": "about/introduction.html",
    "revision": "bc1b2a0f3d293516be1e4eb7a82b1a13"
  },
  {
    "url": "about/license.html",
    "revision": "78df4afc763af857287f7013d4c47ad5"
  },
  {
    "url": "about/roadmap.html",
    "revision": "d9817f4015d76902dddc0108a4cfe94b"
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
    "url": "assets/js/20.1c960901.js",
    "revision": "fc508250f67473e8473c3355d996d93c"
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
    "url": "assets/js/app.3dae85f5.js",
    "revision": "e9603fb1530d63db205c94716802ffba"
  },
  {
    "url": "examples/index.html",
    "revision": "d8feb4a313f88cb9683a44000e1ef736"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "75b4364b382c8eee4afa02687754c4b7"
  },
  {
    "url": "guides/index.html",
    "revision": "ca006cfef77a9e036dd66ac9ec164d0c"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "a2afcb67d22a646f720bb55b796db5ae"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "cd7c253eca24008914665dd21b30823b"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "bcf6cff253231e85f434f19111c179dd"
  },
  {
    "url": "index.html",
    "revision": "6878fcd9561f314bdf9fde059c78473c"
  },
  {
    "url": "reference/hooks.html",
    "revision": "5cf7ea573021b889609e0c1d1eb2fa4c"
  },
  {
    "url": "reference/index.html",
    "revision": "850c0f07d6c8a79102b079fa2af8efb3"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "e802238fc903483eda846fc7392100c4"
  },
  {
    "url": "reference/services.html",
    "revision": "77aa9b75a5fc1acd4ff6c084c293f056"
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
