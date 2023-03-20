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
    "revision": "8e36fc45210455c3f18eeb7f520a7ad3"
  },
  {
    "url": "about/contact.html",
    "revision": "6f42b4704cb7ccafebab0cf0ddcd95d7"
  },
  {
    "url": "about/contributing.html",
    "revision": "f7d64ff164ad73f9fde1a06f2e11414d"
  },
  {
    "url": "about/introduction.html",
    "revision": "5aa3797f876f5f882c1dff6e047f5516"
  },
  {
    "url": "about/license.html",
    "revision": "172a04ac6038c9222bbf38ba4a196622"
  },
  {
    "url": "about/roadmap.html",
    "revision": "def9874203ba04c67270f05ec250741d"
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
    "url": "assets/js/12.efe4942c.js",
    "revision": "63d500572d598b347cd370bc66a9ad81"
  },
  {
    "url": "assets/js/13.778458da.js",
    "revision": "b817e5928596831a491b1a2653221254"
  },
  {
    "url": "assets/js/14.1ad5e74b.js",
    "revision": "f01482629dd73079c84458f771bf9ef2"
  },
  {
    "url": "assets/js/15.de9c9ac2.js",
    "revision": "eee29c866ecd1de01f9b1b81cf85a78d"
  },
  {
    "url": "assets/js/16.5eb37b22.js",
    "revision": "7308533e3929b21ee1e72d570e259c21"
  },
  {
    "url": "assets/js/17.47daa01c.js",
    "revision": "dc9e1ff45f908a3f4f08b6ebeeb77546"
  },
  {
    "url": "assets/js/18.e8211658.js",
    "revision": "788687e549c00ed91fe573e0f817ba2a"
  },
  {
    "url": "assets/js/19.b89c736d.js",
    "revision": "f09a113b5804971f0bacb1648705fc59"
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
    "url": "assets/js/8.e7294b4d.js",
    "revision": "13b9dda8fdb740f07dbf5a536dcaeaec"
  },
  {
    "url": "assets/js/9.bc01efbe.js",
    "revision": "20a0efb5b0b7f14e6aa47d3d7b6f8799"
  },
  {
    "url": "assets/js/app.2b8c7812.js",
    "revision": "5e87f8a12a99544803ac44a9802406f7"
  },
  {
    "url": "examples/index.html",
    "revision": "8834fe2494158189eacab9738f387ae4"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "13470a8c0987602845dcf03bb44ae2a2"
  },
  {
    "url": "guides/index.html",
    "revision": "f00078f282b589b495fc8fd6bc655fef"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "da5e278bf8f4fcec937c8824135adfbd"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "e3ef91a10f469be7bd2e709ebe5baf71"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "9b48227a071d18977f6113f23ba29cdd"
  },
  {
    "url": "index.html",
    "revision": "b389c6c94d8666ff725629bd822cee7f"
  },
  {
    "url": "reference/hooks.html",
    "revision": "2fba2d90f1d6c5677441097719f8b991"
  },
  {
    "url": "reference/index.html",
    "revision": "09b867bc2d6b0a924815a4fd22868f02"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "531533db4ce13a40c6e2d146e7b5fe7d"
  },
  {
    "url": "reference/services.html",
    "revision": "3e89cc3559bb84a1f47bc2e9fa2766f6"
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
