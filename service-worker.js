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
    "revision": "595fb18637fe792da110fd2b0a3f32df"
  },
  {
    "url": "about/contact.html",
    "revision": "e3427f4c878aed323714a37c4e82dbf2"
  },
  {
    "url": "about/contributing.html",
    "revision": "a9095347ef7bd9d16e1957396771210a"
  },
  {
    "url": "about/introduction.html",
    "revision": "1df530cce6ff2ff736e1669cde93a2ef"
  },
  {
    "url": "about/license.html",
    "revision": "45ef5603917b44e3f9b280318d12dc47"
  },
  {
    "url": "about/roadmap.html",
    "revision": "4234409b2a64767009cfebec490d3304"
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
    "url": "assets/js/app.49068389.js",
    "revision": "0ed277c42b849aadbd77d4e651c6a2a5"
  },
  {
    "url": "examples/index.html",
    "revision": "e501880f473328ba1c482d024ec9accf"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "8e176cef3f5cadcdb2394757361145ab"
  },
  {
    "url": "guides/index.html",
    "revision": "d3fe6257adb26b6f572007089a4a324e"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "dc45d39e6614a90f6272390615f6bac8"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "c90219f174c5ddd082413727837f6a79"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "23f9108366b2fcf624cc412983ee2346"
  },
  {
    "url": "index.html",
    "revision": "2f475be3a45471f1ceb1a321dfddecf9"
  },
  {
    "url": "reference/hooks.html",
    "revision": "4bbb4f4304b70eb3fc49e9538df78644"
  },
  {
    "url": "reference/index.html",
    "revision": "00d41220f99c64f8345684cb3c62d168"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "a4a050f56a39f4a11090dcaad938baff"
  },
  {
    "url": "reference/services.html",
    "revision": "d7ec02089ca3c7ca4e5db9714c45c37c"
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
