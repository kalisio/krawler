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
    "revision": "2947388bf33179105a3b1449d59de967"
  },
  {
    "url": "about/contact.html",
    "revision": "72075550887ea8f8b416d65f0b446361"
  },
  {
    "url": "about/contributing.html",
    "revision": "feaf7ad2d8f648ae44b9cc535e787e51"
  },
  {
    "url": "about/introduction.html",
    "revision": "2a7e51d52505c953f7dc3a9c5432744f"
  },
  {
    "url": "about/license.html",
    "revision": "135862de0e5fb5950f92ddef90ad8a3f"
  },
  {
    "url": "about/roadmap.html",
    "revision": "d6f6070efeef92a6139d255488096cb5"
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
    "url": "assets/js/app.5cdb9baa.js",
    "revision": "b86d25f2c0b3199c68da21f79fdc1257"
  },
  {
    "url": "examples/index.html",
    "revision": "3d7a7527d89033057658f3c9e9a3661d"
  },
  {
    "url": "guides/extending-krawler.html",
    "revision": "7be594d78dcfe01af7c56619ec5805bf"
  },
  {
    "url": "guides/index.html",
    "revision": "4528ea7f83d59fff2a01c00a68550065"
  },
  {
    "url": "guides/installing-krawler.html",
    "revision": "05cec75a37eac61cf17da8332497534a"
  },
  {
    "url": "guides/understanding-krawler.html",
    "revision": "1ed24a50aad2d06fc6467ea699315192"
  },
  {
    "url": "guides/using-krawler.html",
    "revision": "dbb04d8b3858cb5273b72aaa3411df91"
  },
  {
    "url": "index.html",
    "revision": "ddc55288f74e649598e0f658594a7073"
  },
  {
    "url": "reference/hooks.html",
    "revision": "0bbbdc9563e36ed86b5d6eb179a8f5f3"
  },
  {
    "url": "reference/index.html",
    "revision": "3fc01d13c1ece5f5e2ae8e1946507498"
  },
  {
    "url": "reference/known-issues.html",
    "revision": "f784f16e2b6b5bcbe75f92d350ac8da7"
  },
  {
    "url": "reference/services.html",
    "revision": "02c16a50e7f3d38a2998311ff7430e7e"
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
