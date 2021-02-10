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
    "revision": "0649ddc6fec913886c637bb1f566959a"
  },
  {
    "url": "about/contact.html",
    "revision": "70839b30f60c5df041cffed7ad09c0bf"
  },
  {
    "url": "about/contributing.html",
    "revision": "7daf30c5293fd9529d1e792e23543db6"
  },
  {
    "url": "about/introduction.html",
    "revision": "88bf3973519650f5cc1bfbb44891576a"
  },
  {
    "url": "about/license.html",
    "revision": "b20ddc599f1c75a079a82b44ffa94e05"
  },
  {
    "url": "about/roadmap.html",
    "revision": "dd3a768c57a90f5a336e81ed2ec80d88"
  },
  {
    "url": "assets/css/0.styles.02346099.css",
    "revision": "7344d66e2aadfc74a4e96800bf77c568"
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
    "url": "assets/js/17.7474505d.js",
    "revision": "3dbce66a3441cabdfff62669fe68935c"
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
    "url": "assets/js/23.5d75c968.js",
    "revision": "8e248366602d3e29ee7880629d70d846"
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
    "url": "assets/js/26.e0d95a16.js",
    "revision": "3aa74257731d87a6aff7b1e250995093"
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
    "url": "assets/js/app.5dc3bda9.js",
    "revision": "6c73dc31a463d2f036df739c359aab05"
  },
  {
    "url": "examples/index.html",
    "revision": "5c552172b66e6a050ab751b27d6cfe9f"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "27ffd206f7fa090c53e428f042ac2ab2"
  },
  {
    "url": "guides/index.html",
    "revision": "4f08e006f622efda469aeaa0555d4279"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "eadd7ef8581920640d29d8c919489567"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "8e1e814c9c2f14e1a6f3aa1d7437b2fa"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "637aef4bce872e9a03acbcaac4a205f8"
  },
  {
    "url": "index.html",
    "revision": "cd011aaa32611aa6bffb456bbb856b4a"
  },
  {
    "url": "reference/hooks.html",
    "revision": "ebea3f0dd61a860180809a5ba18c8d54"
  },
  {
    "url": "reference/index.html",
    "revision": "674549fc698916e2bf8735aedabcd01d"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "efa1056d70427ddd5e9dfec4fe9984b4"
  },
  {
    "url": "reference/services.html",
    "revision": "afecccccb19f2386ed9b9cb7c57e3c8d"
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
