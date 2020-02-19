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
    "revision": "9f1f99a3a0895aa66fe285462623299a"
  },
  {
    "url": "about/contact.html",
    "revision": "d8f7afa2b606b038bd2e6acf064e1307"
  },
  {
    "url": "about/contributing.html",
    "revision": "c0b6d9329a5905f93063e955dfcf3ee5"
  },
  {
    "url": "about/introduction.html",
    "revision": "7363bd56c6788b654f4d01de208f9cc8"
  },
  {
    "url": "about/license.html",
    "revision": "6412fc5ee80030c0d5d796f3f0551cfa"
  },
  {
    "url": "about/roadmap.html",
    "revision": "b00a29062fd2c3a6b88d4fee049dbab9"
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
    "url": "assets/js/10.9eadf440.js",
    "revision": "e959bd65b18ffafe6359354c3a349a9d"
  },
  {
    "url": "assets/js/11.a12401ba.js",
    "revision": "5cd4257d7ff2f4ee9b13ccdb33bc4ce1"
  },
  {
    "url": "assets/js/12.e9d5b188.js",
    "revision": "2c99505b474a5e90c1560aed42f73278"
  },
  {
    "url": "assets/js/13.5c5acad8.js",
    "revision": "84edc06cdcf777758f06abf97a8158d4"
  },
  {
    "url": "assets/js/14.9095b2c9.js",
    "revision": "8ded854dba3de04028695544a61d55a2"
  },
  {
    "url": "assets/js/15.064408ce.js",
    "revision": "92e61a1963447df5451efe9236b1bfae"
  },
  {
    "url": "assets/js/16.2c3b0566.js",
    "revision": "90dedd7c0f2ee591182e48f8c01bbd7d"
  },
  {
    "url": "assets/js/17.4d6ca9da.js",
    "revision": "bda4abf9bfe3b96b4aa222d4307df4d5"
  },
  {
    "url": "assets/js/18.c9b3bf90.js",
    "revision": "b7e937e77179baaa0d5c42ba26b5b76a"
  },
  {
    "url": "assets/js/19.304941d2.js",
    "revision": "70127e405a8e10883386578a8632e812"
  },
  {
    "url": "assets/js/2.bf0b5ff7.js",
    "revision": "65c8d478fb3f8127033802597ab59e0b"
  },
  {
    "url": "assets/js/20.7855634e.js",
    "revision": "0beba7e2a2a27adf2877942d673b4470"
  },
  {
    "url": "assets/js/21.8551123a.js",
    "revision": "c594d56291effce9f0bc6aba86c2597f"
  },
  {
    "url": "assets/js/22.7aef7733.js",
    "revision": "043f2730849b6632664c8985385f707a"
  },
  {
    "url": "assets/js/3.7765abec.js",
    "revision": "ff604779a2f36c63a82f8844fb8c1570"
  },
  {
    "url": "assets/js/4.2f891876.js",
    "revision": "131896c5820a5b17080ccfa5276bd165"
  },
  {
    "url": "assets/js/5.62f74cd8.js",
    "revision": "0e10003497b11809109a7f3e6b46e24f"
  },
  {
    "url": "assets/js/6.dc14714e.js",
    "revision": "bacd786593ee2320227342f3616fc203"
  },
  {
    "url": "assets/js/7.7d9324f3.js",
    "revision": "23adca2c92b13cf90a66ab2881512fd1"
  },
  {
    "url": "assets/js/8.7ef33122.js",
    "revision": "20d9d4159c128d8f5bc78da3330db859"
  },
  {
    "url": "assets/js/9.873fd423.js",
    "revision": "ec165a450ee71e0283635708afbd10a3"
  },
  {
    "url": "assets/js/app.42ab4503.js",
    "revision": "2b853e9452a8fb3a0a3a6871dacef4ee"
  },
  {
    "url": "examples/index.html",
    "revision": "cfc5773e90e573c947a9fe7d80eb387c"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "26ffa0822edb35e5ec2db0f4c57e6173"
  },
  {
    "url": "guides/index.html",
    "revision": "9a5c13bad62b233e6d469fd60364ac8b"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "faa8c6cd561881630aabdbf38d002f79"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "faa5281a2983bdb29facc7c6fb40db0a"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "f64487ebd6ee168b21f865899c7b0cd8"
  },
  {
    "url": "index.html",
    "revision": "b13d931323a50f8e11b163e67e2e059b"
  },
  {
    "url": "reference/hooks.html",
    "revision": "0c5832e36917200c92b31673a6d2fc76"
  },
  {
    "url": "reference/index.html",
    "revision": "534707be91eb7baf87bfddd91d0c2271"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "e1383b253dc3071da38a620af4314fd9"
  },
  {
    "url": "reference/services.html",
    "revision": "c581d9acdd8fd41a892464d046a1b7df"
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
