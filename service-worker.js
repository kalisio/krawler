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
    "revision": "d3c96d71ba3cc3acc1cb6151fef2d21f"
  },
  {
    "url": "about/contact.html",
    "revision": "daab28808f9b000866906e6c0a2dadcb"
  },
  {
    "url": "about/contributing.html",
    "revision": "0805cb54000aa0c97d6a2670283cb65c"
  },
  {
    "url": "about/introduction.html",
    "revision": "2d7a3647d4a8480858a549520b070808"
  },
  {
    "url": "about/license.html",
    "revision": "106ebb095f421c76e856c7cd32c5d324"
  },
  {
    "url": "about/roadmap.html",
    "revision": "46341853b9f2243a61b3d9422419e234"
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
    "url": "assets/js/app.600eb843.js",
    "revision": "b8e94eafc19adbe60a8e2e210a17f38b"
  },
  {
    "url": "examples/index.html",
    "revision": "6a22e2953c8b7be819117b83898c278e"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "ddbaa706495fb9c5e1e1893edc1dc974"
  },
  {
    "url": "guides/index.html",
    "revision": "a8570d3496efe7f2d179da019ef55a59"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "d00b50c96f8c8377cb706563fb45c0f5"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "d1e7f43cb11be2f3382198efb4545f27"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "6ed79a6d5947bec6424d313ecbdad7ec"
  },
  {
    "url": "index.html",
    "revision": "72239c689dbf70e9c9af76910a9fbaf6"
  },
  {
    "url": "reference/hooks.html",
    "revision": "e33ca72907d11a34fc710a6f3e46b556"
  },
  {
    "url": "reference/index.html",
    "revision": "239d3996442080a66ccab987fb68c443"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "33739ccb30375c247579fe79a9d5182a"
  },
  {
    "url": "reference/services.html",
    "revision": "cec9ec0aaa7a46d042d82a7b6430de17"
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
