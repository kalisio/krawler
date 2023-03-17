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
    "revision": "10f5aadea509645b86f00723d630c0a4"
  },
  {
    "url": "about/contact.html",
    "revision": "5286819699cb7a7b8b47e50822ceb220"
  },
  {
    "url": "about/contributing.html",
    "revision": "596e013515760060a95d0c47206ded83"
  },
  {
    "url": "about/introduction.html",
    "revision": "b300914c73e9ef2edb7992fb7e315ba5"
  },
  {
    "url": "about/license.html",
    "revision": "7a478c2cec1b82928948231b751d9eb3"
  },
  {
    "url": "about/roadmap.html",
    "revision": "0a9daec8ffcb549f8680a5f5108eb554"
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
    "url": "assets/js/16.e1700f75.js",
    "revision": "226d3fa257d96bf4bc17d67fe9726623"
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
    "url": "assets/js/8.00bcd0e5.js",
    "revision": "3729007797e08c6237b6fafcf2f68063"
  },
  {
    "url": "assets/js/9.bc01efbe.js",
    "revision": "20a0efb5b0b7f14e6aa47d3d7b6f8799"
  },
  {
    "url": "assets/js/app.ca78b973.js",
    "revision": "5a4a94caecd0e219cf4ef7c548f4ca59"
  },
  {
    "url": "examples/index.html",
    "revision": "945a4550c3563f9eccfb21c32d3bee9d"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "c6eaf488880afed358b76541effac098"
  },
  {
    "url": "guides/index.html",
    "revision": "77343f224736fdea7a9227668d2f2119"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "902275d69e0cfafd5b6dd0f5bc50215c"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "db1e648964d50a24fcd292cdf03c2947"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "da5ff622c6dc5be18029df6fa5751cd9"
  },
  {
    "url": "index.html",
    "revision": "ad4890cd5585c9e87bb96e9b10f057a1"
  },
  {
    "url": "reference/hooks.html",
    "revision": "b0e683634c37c7645c134bed55acf81f"
  },
  {
    "url": "reference/index.html",
    "revision": "ab05f330e73aa91ef35f4313aa25b3ef"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "9f9748dc70fa98bbedf37f117492a352"
  },
  {
    "url": "reference/services.html",
    "revision": "e8ec72339363eb8423e34ab75ac08f47"
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
