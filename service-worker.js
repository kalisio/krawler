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
    "revision": "f3fb350a10e78a64e4363a560910ae96"
  },
  {
    "url": "about/contact.html",
    "revision": "da017400bab4c334f72c37a0b97d48e2"
  },
  {
    "url": "about/contributing.html",
    "revision": "5493dd156eb0c59bba210e94d77c7680"
  },
  {
    "url": "about/introduction.html",
    "revision": "27bb8004f6cc6033d140612b96cc48ca"
  },
  {
    "url": "about/license.html",
    "revision": "a4337b15b15ba18130c6cd5f8b8354f1"
  },
  {
    "url": "about/roadmap.html",
    "revision": "d5e64ceaa3268568fd49911982c61bcf"
  },
  {
    "url": "assets/css/0.styles.449c4234.css",
    "revision": "2930ea781371fae48e7dc3cc6325e97b"
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
    "url": "assets/js/10.8c62b894.js",
    "revision": "0f64e6116711c3553c0035e6fa348751"
  },
  {
    "url": "assets/js/11.06e80762.js",
    "revision": "04696fd458477627768f57b2146df2c9"
  },
  {
    "url": "assets/js/12.15fc4e89.js",
    "revision": "e9ebb3f2c7c90855386a54daed78f76c"
  },
  {
    "url": "assets/js/13.91b28054.js",
    "revision": "3cd58c5aec52838e648a318fa66c8202"
  },
  {
    "url": "assets/js/14.ac3e0aa4.js",
    "revision": "52f6f43acc66c2fef555e8d664c9ed38"
  },
  {
    "url": "assets/js/15.04334bbb.js",
    "revision": "171c5f1426dde5d991bb29743b452355"
  },
  {
    "url": "assets/js/16.4bade4d3.js",
    "revision": "69452b1a5771ffc0768a2d8dc525c9c5"
  },
  {
    "url": "assets/js/17.47a0ad32.js",
    "revision": "f09256d924d275b05212efd4db56280c"
  },
  {
    "url": "assets/js/18.d69a7658.js",
    "revision": "1b9d0d0983cd9a10bdf3836980f544f9"
  },
  {
    "url": "assets/js/19.08d0459e.js",
    "revision": "2fac9466858e68e0d9988f1cd1109531"
  },
  {
    "url": "assets/js/2.a2fcfd71.js",
    "revision": "a6b02bcc062f664208107477e39d59a6"
  },
  {
    "url": "assets/js/20.15920698.js",
    "revision": "3bcb859623e8c8b96644492479e4cd2b"
  },
  {
    "url": "assets/js/21.4dc2ca83.js",
    "revision": "aa694d8677dd580a3a6885e4b10b66aa"
  },
  {
    "url": "assets/js/22.4957bf38.js",
    "revision": "6bd8924883446677e51bd59a855c04c4"
  },
  {
    "url": "assets/js/23.f314205e.js",
    "revision": "ce4d6bf75f9cc29852f1783f7c45eebe"
  },
  {
    "url": "assets/js/24.561e8157.js",
    "revision": "709866f7b56069d456f20e5278b3cba6"
  },
  {
    "url": "assets/js/25.85d8ac2c.js",
    "revision": "18237f446f87937aa1e33f0cd82cc628"
  },
  {
    "url": "assets/js/26.591273aa.js",
    "revision": "8c11565011bd0787d804ac22ab20f0e3"
  },
  {
    "url": "assets/js/27.805bd3f5.js",
    "revision": "71edf20ebff147671a6a2269e40999b1"
  },
  {
    "url": "assets/js/28.858df41a.js",
    "revision": "20988bbbc295da757f329bf4d3370b9f"
  },
  {
    "url": "assets/js/29.2e6acc1b.js",
    "revision": "3ffc9c1e5dff1ef423afba10b3b86d2a"
  },
  {
    "url": "assets/js/3.82d42272.js",
    "revision": "a19eadf8ccff77113eeb55499beee746"
  },
  {
    "url": "assets/js/4.9c47dc20.js",
    "revision": "a45e95404c5b05871e9e14b2c489cc7b"
  },
  {
    "url": "assets/js/5.8042ca6f.js",
    "revision": "e932a89f75042c8e6a159d56ce1841d3"
  },
  {
    "url": "assets/js/6.c3a08bef.js",
    "revision": "d7cc39c4117bb79346b969060ff2f4f3"
  },
  {
    "url": "assets/js/7.03ff545a.js",
    "revision": "84feff32309ef9014644aeb1ef138314"
  },
  {
    "url": "assets/js/8.27205470.js",
    "revision": "3729007797e08c6237b6fafcf2f68063"
  },
  {
    "url": "assets/js/9.e1ed15f6.js",
    "revision": "20a0efb5b0b7f14e6aa47d3d7b6f8799"
  },
  {
    "url": "assets/js/app.54bcdaf4.js",
    "revision": "d37cd8cfaa5acb5d6ebe32634f7fe3c3"
  },
  {
    "url": "examples/index.html",
    "revision": "58cde6735fbcb7c1d3ffd62f7d3ddc10"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "651b26b4c471ae521bdbb702cb67dc6d"
  },
  {
    "url": "guides/index.html",
    "revision": "2d976497f2f72116d1246128d062d685"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "8baec562dc5a62ab7859271af4754e9e"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "c3d0a7ec524c268446089c8135112c31"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "1d7e1017763679f0fd3cb8496004bc9e"
  },
  {
    "url": "index.html",
    "revision": "19a030add89e1ec04510c174ced07f68"
  },
  {
    "url": "reference/hooks.html",
    "revision": "de5030b066a3e3eabcc642ff45652e5a"
  },
  {
    "url": "reference/index.html",
    "revision": "7fab7fe7cf3cef456ccd19905baefc90"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "26095dbe4fa015611816cfbbdd01ffe2"
  },
  {
    "url": "reference/services.html",
    "revision": "dd7aecafce967696f94dbcf475c4d8dd"
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
