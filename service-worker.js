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
    "revision": "a28c7be4180560b19b56a3427d328a54"
  },
  {
    "url": "about/contact.html",
    "revision": "f67ed48d8072ed1cfdcbc8de7c9bec7e"
  },
  {
    "url": "about/contributing.html",
    "revision": "2b1f7f54014f501b88d1f183d7ef805b"
  },
  {
    "url": "about/introduction.html",
    "revision": "614c8e2a8bf82bd2ff4e9fc61f0b7408"
  },
  {
    "url": "about/license.html",
    "revision": "11758e1377d521edb94139e82ab7a0f4"
  },
  {
    "url": "about/roadmap.html",
    "revision": "c218ca06308f187ab826338288c623b8"
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
    "url": "assets/js/20.84c6e4d8.js",
    "revision": "39989ba10b969974d3ac800b3f4cb54e"
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
    "url": "assets/js/app.23275e00.js",
    "revision": "8771b04e0f4883a16062512b60a61279"
  },
  {
    "url": "examples/index.html",
    "revision": "0ae93102dc92ccf61ff06e460b4e1307"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "77f5689d8f2486ec5838a8305bfbbe4c"
  },
  {
    "url": "guides/index.html",
    "revision": "f4634755a563ea15701131ec0e600c0d"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "55cfd6deaab2f89b1c30af6da931c6b3"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "28d0f97269619eb57da11e60cbba4bc4"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "b4dabbce7c18983af616262f7cbf5a3f"
  },
  {
    "url": "index.html",
    "revision": "87c72b72e5f5f05167a06fce83ab0cab"
  },
  {
    "url": "reference/hooks.html",
    "revision": "b15afa321ebea7f15eac215e7dbea4d7"
  },
  {
    "url": "reference/index.html",
    "revision": "8a10101a8d7d729b484815359a6d154d"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "265473c4206ff5b0369736145e8f94b5"
  },
  {
    "url": "reference/services.html",
    "revision": "caa39826906c050a39f3982a13e231f4"
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
