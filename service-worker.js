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
    "revision": "e4afcc91be326e43ae1d8aa1a3bbd41d"
  },
  {
    "url": "about/contact.html",
    "revision": "e4dad23a782c150a8dca72519eab2dc8"
  },
  {
    "url": "about/contributing.html",
    "revision": "1ba4b7ded026f7a774fd2c0fbccc9bc3"
  },
  {
    "url": "about/introduction.html",
    "revision": "a39a32751eee78eb5669c093995bac61"
  },
  {
    "url": "about/license.html",
    "revision": "d75519738725d200000fa8024d795cf0"
  },
  {
    "url": "about/roadmap.html",
    "revision": "4c58781823c147cf1dd90d8cddb58f7e"
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
    "url": "assets/js/23.ca89577c.js",
    "revision": "27a6e36fae5b7918ca1a529b8d42d306"
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
    "url": "assets/js/27.3c917690.js",
    "revision": "5006046c97f5c89c3d67616f174dbe76"
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
    "url": "assets/js/app.01537b5a.js",
    "revision": "c070d07e03427694d316dc52e1a16e1b"
  },
  {
    "url": "examples/index.html",
    "revision": "b0f820eb130749976239b493bf091baa"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "922d1d63286acca562bc70272146bc65"
  },
  {
    "url": "guides/index.html",
    "revision": "9097234ca49c393060646795bcd710a7"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "1cc341574053336202a8762f7df13791"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "9159e0e42e06d54c6bdc5a1740b53f29"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "5832ba8c799becdc725a98bd57251408"
  },
  {
    "url": "index.html",
    "revision": "4ace476e0ab05ab4d61f29eb6f3c0856"
  },
  {
    "url": "reference/hooks.html",
    "revision": "d63330edbe17f998141035c603178453"
  },
  {
    "url": "reference/index.html",
    "revision": "64db6fd83f446b6374e48479dd24f887"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "bcde4bad8209737f2de5f17bc8d8b20e"
  },
  {
    "url": "reference/services.html",
    "revision": "48faea26160d1e984a4ee3af5d03c09c"
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
