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
    "revision": "083a9f21fd5bba49abffcfd7a3c10cc7"
  },
  {
    "url": "about/contact.html",
    "revision": "0f290bb298231fe78b66d74945529f54"
  },
  {
    "url": "about/contributing.html",
    "revision": "cfe86b03b7d76a020372ff479f1b2e98"
  },
  {
    "url": "about/introduction.html",
    "revision": "06d8eedec3a6f345c675ef3b0b2f3219"
  },
  {
    "url": "about/license.html",
    "revision": "8a078682f421ec3901b4de47065f5ccb"
  },
  {
    "url": "about/roadmap.html",
    "revision": "e959676548098e6c4b12b1b90f18d1b7"
  },
  {
    "url": "assets/css/0.styles.dd0a2e58.css",
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
    "url": "assets/js/10.89bd5b33.js",
    "revision": "0f64e6116711c3553c0035e6fa348751"
  },
  {
    "url": "assets/js/11.1ce39713.js",
    "revision": "04696fd458477627768f57b2146df2c9"
  },
  {
    "url": "assets/js/12.77f43dde.js",
    "revision": "e9ebb3f2c7c90855386a54daed78f76c"
  },
  {
    "url": "assets/js/13.9b1ad182.js",
    "revision": "3cd58c5aec52838e648a318fa66c8202"
  },
  {
    "url": "assets/js/14.e89a29b9.js",
    "revision": "52f6f43acc66c2fef555e8d664c9ed38"
  },
  {
    "url": "assets/js/15.c046756f.js",
    "revision": "171c5f1426dde5d991bb29743b452355"
  },
  {
    "url": "assets/js/16.0d5e83f7.js",
    "revision": "69452b1a5771ffc0768a2d8dc525c9c5"
  },
  {
    "url": "assets/js/17.b1d8058c.js",
    "revision": "f09256d924d275b05212efd4db56280c"
  },
  {
    "url": "assets/js/18.7e141bcf.js",
    "revision": "1b9d0d0983cd9a10bdf3836980f544f9"
  },
  {
    "url": "assets/js/19.ba10a357.js",
    "revision": "2fac9466858e68e0d9988f1cd1109531"
  },
  {
    "url": "assets/js/2.564c5686.js",
    "revision": "8b3deee406c365497c1bff6cbf412fb4"
  },
  {
    "url": "assets/js/20.b401f8bb.js",
    "revision": "3bcb859623e8c8b96644492479e4cd2b"
  },
  {
    "url": "assets/js/21.c9a05651.js",
    "revision": "aa694d8677dd580a3a6885e4b10b66aa"
  },
  {
    "url": "assets/js/22.fea26fe0.js",
    "revision": "6bd8924883446677e51bd59a855c04c4"
  },
  {
    "url": "assets/js/23.31809593.js",
    "revision": "06147a928bf4712bd72f438292cdeaa8"
  },
  {
    "url": "assets/js/24.4edaa938.js",
    "revision": "709866f7b56069d456f20e5278b3cba6"
  },
  {
    "url": "assets/js/25.1e6c4272.js",
    "revision": "18237f446f87937aa1e33f0cd82cc628"
  },
  {
    "url": "assets/js/26.6d1beb93.js",
    "revision": "8c11565011bd0787d804ac22ab20f0e3"
  },
  {
    "url": "assets/js/27.d2f53065.js",
    "revision": "71edf20ebff147671a6a2269e40999b1"
  },
  {
    "url": "assets/js/28.d52cbba5.js",
    "revision": "20988bbbc295da757f329bf4d3370b9f"
  },
  {
    "url": "assets/js/29.64d6d174.js",
    "revision": "3ffc9c1e5dff1ef423afba10b3b86d2a"
  },
  {
    "url": "assets/js/3.b3661107.js",
    "revision": "a19eadf8ccff77113eeb55499beee746"
  },
  {
    "url": "assets/js/4.26c8de0e.js",
    "revision": "a45e95404c5b05871e9e14b2c489cc7b"
  },
  {
    "url": "assets/js/5.9b3d90bc.js",
    "revision": "e932a89f75042c8e6a159d56ce1841d3"
  },
  {
    "url": "assets/js/6.1a872ecd.js",
    "revision": "d7cc39c4117bb79346b969060ff2f4f3"
  },
  {
    "url": "assets/js/7.e86c7666.js",
    "revision": "84feff32309ef9014644aeb1ef138314"
  },
  {
    "url": "assets/js/8.00bcd0e5.js",
    "revision": "3729007797e08c6237b6fafcf2f68063"
  },
  {
    "url": "assets/js/9.bc01efbe.js",
    "revision": "20a0efb5b0b7f14e6aa47d3d7b6f8799"
  },
  {
    "url": "assets/js/app.99d95b23.js",
    "revision": "b852dfaca3331f6911c1658141e7fed3"
  },
  {
    "url": "examples/index.html",
    "revision": "c9c646675bc827fed386d9681a2867ef"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "115003f2ee425b3db37c011d821c576e"
  },
  {
    "url": "guides/index.html",
    "revision": "e3dc7a8fea23525cbc6fbaba81334b12"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "a4ea097d0f099cbb511f48cbcbbcad8a"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "ee2831353d0e2ec17ba33ead04766553"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "17efa94b8dfda31802ecca412cbb5bf1"
  },
  {
    "url": "index.html",
    "revision": "b9b6bca1c80d6d5fcc85070340009016"
  },
  {
    "url": "reference/hooks.html",
    "revision": "5e794ccc813bd97d3178a2e11444df80"
  },
  {
    "url": "reference/index.html",
    "revision": "0e284fba708c8205ff32336fcb56b55e"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "e67773545d822240b9382be5827da966"
  },
  {
    "url": "reference/services.html",
    "revision": "53b67009cef01fe445b02adfe18ca2b9"
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
