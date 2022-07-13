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
    "revision": "4da152ce96915be22ae556e4f273ec18"
  },
  {
    "url": "about/contact.html",
    "revision": "480d0b39d1c1b7c071a46bb7173d3bf8"
  },
  {
    "url": "about/contributing.html",
    "revision": "ed022dd6f46acd25ec0b53e80a49e15e"
  },
  {
    "url": "about/introduction.html",
    "revision": "aa7426e2400c73dbb4d47cb644eb7fbb"
  },
  {
    "url": "about/license.html",
    "revision": "1da55f39e25bc09db67c812d125bc7a4"
  },
  {
    "url": "about/roadmap.html",
    "revision": "3d0b787b73fe3949cceb9646de4147e6"
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
    "url": "assets/js/23.d0fad4d8.js",
    "revision": "76a1dcf8e52d6a1dd2118d194082c322"
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
    "url": "assets/js/app.3c89ad9f.js",
    "revision": "5c01c80bc1fa13413ead942efbc04563"
  },
  {
    "url": "examples/index.html",
    "revision": "2a500167d93a6abeb1682cea87849e2f"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "6f2fa4fd8bb57baedb8be36bb7f6cd7d"
  },
  {
    "url": "guides/index.html",
    "revision": "c30698c4453a3ea9d9ebc03a9ecbc20d"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "7c8c1b8b1d2f5fa520fce8a63ee54177"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "ff6b6dce9029624782175130f2837141"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "3c9ac6cc8372e68d86f05e8b25a21b2b"
  },
  {
    "url": "index.html",
    "revision": "37f204508240f7d69b2085df058fecf7"
  },
  {
    "url": "reference/hooks.html",
    "revision": "39add041fadeb12ec43671ef30a366e1"
  },
  {
    "url": "reference/index.html",
    "revision": "b8405cc9cdad066e26e8e37ff6b21989"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "c2ebc38cdc42a6038c28fcb171244fad"
  },
  {
    "url": "reference/services.html",
    "revision": "93e98c2acbc2033b3dc4db592d9e2338"
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
