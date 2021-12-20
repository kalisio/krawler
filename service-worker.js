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
    "revision": "c7a4a7fae65194051e5d8c6e45c2c757"
  },
  {
    "url": "about/contact.html",
    "revision": "28443d7057c67a9e25e87440588cbc32"
  },
  {
    "url": "about/contributing.html",
    "revision": "085334eff18a923ebea52d8cff875e0c"
  },
  {
    "url": "about/introduction.html",
    "revision": "941c78292931b25a1d1b48b8021d92a6"
  },
  {
    "url": "about/license.html",
    "revision": "8833fa79e2ac98255fdcae5a86edacbd"
  },
  {
    "url": "about/roadmap.html",
    "revision": "2a21e5cad52c282084905a445dcf43e9"
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
    "url": "assets/js/17.edb1cb4f.js",
    "revision": "afa40824a6208fb134ca76b881305d41"
  },
  {
    "url": "assets/js/18.d69a7658.js",
    "revision": "1b9d0d0983cd9a10bdf3836980f544f9"
  },
  {
    "url": "assets/js/19.aa4fabb1.js",
    "revision": "ff5433a5384c57807f03cb1769295377"
  },
  {
    "url": "assets/js/2.b4c0037f.js",
    "revision": "54fb301630f081f5e4c2abbe0be8220a"
  },
  {
    "url": "assets/js/20.5225eaac.js",
    "revision": "164db8103ee77e6e9980d85f4fd340df"
  },
  {
    "url": "assets/js/21.e44bac18.js",
    "revision": "abcee0a6c107660567e129b7e787facc"
  },
  {
    "url": "assets/js/22.4957bf38.js",
    "revision": "6bd8924883446677e51bd59a855c04c4"
  },
  {
    "url": "assets/js/23.ef49b0b8.js",
    "revision": "2b89151e872441ea1c50c7024fe20d4c"
  },
  {
    "url": "assets/js/24.15cf4e7a.js",
    "revision": "ac55af03fa9c8f15afbd7e3d9d71abca"
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
    "url": "assets/js/27.f564c46c.js",
    "revision": "83a002b241672f411c924bdc791ab7d4"
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
    "url": "assets/js/app.64437817.js",
    "revision": "54acc9affa8eda7e1530b9f8acc45797"
  },
  {
    "url": "examples/index.html",
    "revision": "9337b8534c7d0986517207c0cd55668e"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "3a4389e054635d0713624caa59764a3b"
  },
  {
    "url": "guides/index.html",
    "revision": "dba9d3e4d0af410bca99f1332e62d5da"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "d29680d12a5529ba751c825b03dbec5f"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "b476f8f78ff46e22d605b059045b39bd"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "da611a27d24a60a793c1578e2bc313df"
  },
  {
    "url": "index.html",
    "revision": "1b230354fa9463001f94f767c1d08b87"
  },
  {
    "url": "reference/hooks.html",
    "revision": "1e0d27708778b25e97a6246e8653fe1d"
  },
  {
    "url": "reference/index.html",
    "revision": "0dc42c4607eb68b380bc2a01f8fe19d0"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "6cb4fb2e3ca7e4801ceaa40e4c6315ab"
  },
  {
    "url": "reference/services.html",
    "revision": "21d92ab0377a081308100f930cdec4cd"
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
