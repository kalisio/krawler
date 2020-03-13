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
    "revision": "8763e61b794ad11ce8a3399486c3d80f"
  },
  {
    "url": "about/contact.html",
    "revision": "95990ae3b0611fc2ac6ac1b668dce48c"
  },
  {
    "url": "about/contributing.html",
    "revision": "9436d95576f12db8dd28c526933cb77e"
  },
  {
    "url": "about/introduction.html",
    "revision": "af5501159982c9c46264a94af65eb89f"
  },
  {
    "url": "about/license.html",
    "revision": "c56d00348aaa66b46837652f5f2213d8"
  },
  {
    "url": "about/roadmap.html",
    "revision": "f32279bab2c55c4c493762dfa8ccd27c"
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
    "url": "assets/js/app.eb0a87f5.js",
    "revision": "33cfc73e78fe3fa10c88efb082332560"
  },
  {
    "url": "examples/index.html",
    "revision": "60e04336868e866000a37edc28464525"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "784b4553a336b5b250af109ddc6f1a31"
  },
  {
    "url": "guides/index.html",
    "revision": "1b57b2eeabb3ba7e531f256fd98b59c2"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "430b2230e87e53d8ce7d5fce05902fd3"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "d21d4332f0f661be9d507955db256f11"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "3233288d3ab1bf663bd213a60483bec9"
  },
  {
    "url": "index.html",
    "revision": "a45a8f2e77989999b04d45a0dc57608f"
  },
  {
    "url": "reference/hooks.html",
    "revision": "06808f02eafbdef0cef4d1e9c09546c2"
  },
  {
    "url": "reference/index.html",
    "revision": "8a4b3f19c13ee971e1aa8475a072ec75"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "1d3ad9dd0ed4006fa2aeeff5780e852d"
  },
  {
    "url": "reference/services.html",
    "revision": "a3a5bd2420191e9c1161394be380ab98"
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
