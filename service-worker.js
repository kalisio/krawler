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
    "revision": "3c731493f4248a389c2cc7668c4bfcf6"
  },
  {
    "url": "about/contact.html",
    "revision": "bf2b93175c6821047c7ad06f0ff89fa2"
  },
  {
    "url": "about/contributing.html",
    "revision": "8ee1113d3000cff27dfa0c62bbc3e984"
  },
  {
    "url": "about/introduction.html",
    "revision": "16821c82a0a0626f89229121040c7ae9"
  },
  {
    "url": "about/license.html",
    "revision": "00fb167ea12af5348a4f5bb439470c53"
  },
  {
    "url": "about/roadmap.html",
    "revision": "d5ca658196ed02a3ae81e7dd8c5da641"
  },
  {
    "url": "assets/css/0.styles.c3dcb25c.css",
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
    "url": "assets/js/10.972fb118.js",
    "revision": "0c2771d6127d3929e5e5c6f662550272"
  },
  {
    "url": "assets/js/11.51d6d138.js",
    "revision": "84a59640b191d9e2168ad75acaff7ea9"
  },
  {
    "url": "assets/js/12.ae829fb1.js",
    "revision": "7228913d2b678dc953872982e9848104"
  },
  {
    "url": "assets/js/13.beaec42f.js",
    "revision": "bb1d07f0d6339fdebfc1dfcc4060b82e"
  },
  {
    "url": "assets/js/14.8a5b09d4.js",
    "revision": "62e9d3a73016d7df24e3bd5d9c474868"
  },
  {
    "url": "assets/js/15.1be3db8d.js",
    "revision": "9610d384ae2d9d04e1735441783cc757"
  },
  {
    "url": "assets/js/16.facef2d5.js",
    "revision": "4ba8d15bf838a82761226f21040ddfdb"
  },
  {
    "url": "assets/js/17.911d9482.js",
    "revision": "f34dcf05379ad9aa9546e061d0628169"
  },
  {
    "url": "assets/js/18.806726bc.js",
    "revision": "7d2fcb96648584d90b0b6e1557bf6e58"
  },
  {
    "url": "assets/js/19.a1c69d7d.js",
    "revision": "c9e350681e1eaee263d00e72743ff635"
  },
  {
    "url": "assets/js/2.3d1476b8.js",
    "revision": "879026a61aa96d7c73750c323e2354aa"
  },
  {
    "url": "assets/js/20.db3cbc96.js",
    "revision": "3932268451662add919d92434c200134"
  },
  {
    "url": "assets/js/21.8256e14e.js",
    "revision": "c364cc2fc9eb2b160efbdfe14dc7c27d"
  },
  {
    "url": "assets/js/22.31299058.js",
    "revision": "292e54b35ab2e4286defe2699fa03166"
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
    "url": "assets/js/4.f83e9215.js",
    "revision": "c419c183f159c4e2e0559e2567bcb720"
  },
  {
    "url": "assets/js/5.26e546fb.js",
    "revision": "f4c6ac68f9af109e62e90878edbe2e3f"
  },
  {
    "url": "assets/js/6.85317ad0.js",
    "revision": "80b31805a90e6df0fd6e2748ab4543db"
  },
  {
    "url": "assets/js/7.18dbb362.js",
    "revision": "dd12b711e9241cb18777313f3ec1e812"
  },
  {
    "url": "assets/js/8.7dd70712.js",
    "revision": "2326cceb950ecbf0bf19069fa7631d12"
  },
  {
    "url": "assets/js/9.658b30d2.js",
    "revision": "61a6306a25098be7031c0a9b226870ee"
  },
  {
    "url": "assets/js/app.f12091d2.js",
    "revision": "50a7757f2f6973d705cd207ba370dee8"
  },
  {
    "url": "examples/index.html",
    "revision": "452bd1ff21f6903e4e9c1c69ed48415f"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "67965e0e7ed2beccb02213ce72220b4a"
  },
  {
    "url": "guides/index.html",
    "revision": "ce0a8fc650ec1b848d759f8e4bd66a1d"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "4b54b1f6262f55625f9d4e77671f7303"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "d8693095a7bf06bef316fc1d221a707d"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "50c15e5498d1e618618195f7d0893340"
  },
  {
    "url": "index.html",
    "revision": "beca2090c8368d359e410be630e0adba"
  },
  {
    "url": "reference/hooks.html",
    "revision": "29ba80463827fc6cdbbf24f10e9cf6e4"
  },
  {
    "url": "reference/index.html",
    "revision": "edeefe21c207819e3b4f47908ad15a35"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "e2d86c2ec5bd79a3a1014d3f5257424b"
  },
  {
    "url": "reference/services.html",
    "revision": "c017dec043f00cc87931d122a5c88e4b"
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
