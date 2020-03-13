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
    "revision": "c9007301e489c22b3a4fb9b41cf68fda"
  },
  {
    "url": "about/contact.html",
    "revision": "3332af0ca276596f1f807d3413bdb59a"
  },
  {
    "url": "about/contributing.html",
    "revision": "d9e535e00bcc5253d4a5a2e5f740d4d5"
  },
  {
    "url": "about/introduction.html",
    "revision": "e53dad07b164efc55788d4e2239861af"
  },
  {
    "url": "about/license.html",
    "revision": "5072541df9c371b37d0252717e6c3d84"
  },
  {
    "url": "about/roadmap.html",
    "revision": "9f2e7234c43e46be2755428530d6c0dd"
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
    "url": "assets/js/10.972fb118.js",
    "revision": "0c2771d6127d3929e5e5c6f662550272"
  },
  {
    "url": "assets/js/11.51d6d138.js",
    "revision": "84a59640b191d9e2168ad75acaff7ea9"
  },
  {
    "url": "assets/js/12.ae829fb1.js",
    "revision": "7228913d2b678dc953872982e9848104"
  },
  {
    "url": "assets/js/13.beaec42f.js",
    "revision": "bb1d07f0d6339fdebfc1dfcc4060b82e"
  },
  {
    "url": "assets/js/14.8a5b09d4.js",
    "revision": "62e9d3a73016d7df24e3bd5d9c474868"
  },
  {
    "url": "assets/js/15.1be3db8d.js",
    "revision": "9610d384ae2d9d04e1735441783cc757"
  },
  {
    "url": "assets/js/16.facef2d5.js",
    "revision": "4ba8d15bf838a82761226f21040ddfdb"
  },
  {
    "url": "assets/js/17.911d9482.js",
    "revision": "f34dcf05379ad9aa9546e061d0628169"
  },
  {
    "url": "assets/js/18.806726bc.js",
    "revision": "7d2fcb96648584d90b0b6e1557bf6e58"
  },
  {
    "url": "assets/js/19.a1c69d7d.js",
    "revision": "c9e350681e1eaee263d00e72743ff635"
  },
  {
    "url": "assets/js/2.3d1476b8.js",
    "revision": "879026a61aa96d7c73750c323e2354aa"
  },
  {
    "url": "assets/js/20.db3cbc96.js",
    "revision": "3932268451662add919d92434c200134"
  },
  {
    "url": "assets/js/21.8256e14e.js",
    "revision": "c364cc2fc9eb2b160efbdfe14dc7c27d"
  },
  {
    "url": "assets/js/22.31299058.js",
    "revision": "292e54b35ab2e4286defe2699fa03166"
  },
  {
    "url": "assets/js/23.723763a2.js",
    "revision": "85962111a38f74e235efb83422532383"
  },
  {
    "url": "assets/js/24.de066fe1.js",
    "revision": "410213c7f91e68f7ec6d1a7b7a7f6d7b"
  },
  {
    "url": "assets/js/3.56e7fc0c.js",
    "revision": "a707e3b63dba7cac7a939b9047b8fa9a"
  },
  {
    "url": "assets/js/4.f83e9215.js",
    "revision": "c419c183f159c4e2e0559e2567bcb720"
  },
  {
    "url": "assets/js/5.26e546fb.js",
    "revision": "f4c6ac68f9af109e62e90878edbe2e3f"
  },
  {
    "url": "assets/js/6.85317ad0.js",
    "revision": "80b31805a90e6df0fd6e2748ab4543db"
  },
  {
    "url": "assets/js/7.18dbb362.js",
    "revision": "dd12b711e9241cb18777313f3ec1e812"
  },
  {
    "url": "assets/js/8.7dd70712.js",
    "revision": "2326cceb950ecbf0bf19069fa7631d12"
  },
  {
    "url": "assets/js/9.658b30d2.js",
    "revision": "61a6306a25098be7031c0a9b226870ee"
  },
  {
    "url": "assets/js/app.cd1f642d.js",
    "revision": "e7680187f9d21235f5029b30c9fe656d"
  },
  {
    "url": "examples/index.html",
    "revision": "f23cb1c045001aa6a26eb603fff10745"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "ae32f053f38d8153ec6e941929647b30"
  },
  {
    "url": "guides/index.html",
    "revision": "12bda5b84be37ec23ae8bb1681d69063"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "410b1c0cbba5c3bd046cb7457053f7cc"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "ec7e620d58a2d19d30494d8c1a93867a"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "d300b2e20e9893e9bf736cf323c61e99"
  },
  {
    "url": "index.html",
    "revision": "ff86a9933e5aeb84d5354912119b3458"
  },
  {
    "url": "reference/hooks.html",
    "revision": "1796a2223069f06b95769934de8e7f58"
  },
  {
    "url": "reference/index.html",
    "revision": "6c24c117832403e6a375fed6e1f5fdb2"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "132047be785a1db28b77e69e67b49540"
  },
  {
    "url": "reference/services.html",
    "revision": "c3e32bf71611d4368fd38c5ac495945b"
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
