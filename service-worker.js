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
    "revision": "4b43f7b47c2781f14e80165155afd7cf"
  },
  {
    "url": "about/contact.html",
    "revision": "18afc09d18a2b9da13c40a5dc248cc79"
  },
  {
    "url": "about/contributing.html",
    "revision": "28d0c231c410d5c8ca5c4516f2dd611f"
  },
  {
    "url": "about/introduction.html",
    "revision": "1159c4253dfe6a70aaa6e151f6518a4d"
  },
  {
    "url": "about/license.html",
    "revision": "25e30e7e30a169e2e003a74948733e15"
  },
  {
    "url": "about/roadmap.html",
    "revision": "0416adda0273e005331d30c1ee55bc3c"
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
    "url": "assets/js/23.433d53ed.js",
    "revision": "896f48aceaa22a39e01edb2f779e9f1e"
  },
  {
    "url": "assets/js/24.4edaa938.js",
    "revision": "709866f7b56069d456f20e5278b3cba6"
  },
  {
    "url": "assets/js/25.d4927adb.js",
    "revision": "d7a341c4185d33b26998e85b0ae8fb65"
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
    "url": "assets/js/app.392813d5.js",
    "revision": "d23b9fdcbc67826a942ae4385e647d0e"
  },
  {
    "url": "examples/index.html",
    "revision": "2810d575557e84d1b03aac45120e69a0"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "bd75d27d0e44040bebbbbe7295f25b57"
  },
  {
    "url": "guides/index.html",
    "revision": "785d433f46c147ab0923b5d4f252404f"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "f7b53c5b7873dd991add5ae658b81d50"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "02d250f74c353ef680d820b079e74393"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "9f8f6b97d3609529c2a41db867a01f47"
  },
  {
    "url": "index.html",
    "revision": "5ad5c47a000c7d0d059b2cf5990edf49"
  },
  {
    "url": "reference/hooks.html",
    "revision": "810c616b6a03a0d91b7d35a71adeea86"
  },
  {
    "url": "reference/index.html",
    "revision": "6cd3d69917a61d38fecf6b77c3f4044f"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "4841b6b46d1ae51c7ded3b048fb73268"
  },
  {
    "url": "reference/services.html",
    "revision": "0a00d34fb75e1cd6803d3d94e4461371"
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
