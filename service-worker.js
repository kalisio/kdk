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
    "revision": "753274fa58589c0d0d0eaafe1ea43760"
  },
  {
    "url": "about/contact.html",
    "revision": "5eea2d4bfdae0adf3e2fa784aee449cd"
  },
  {
    "url": "about/contributing.html",
    "revision": "18b53f8f4db830755986d7430768c229"
  },
  {
    "url": "about/index.html",
    "revision": "0f45271a1378fbb311b237bcd8ee5637"
  },
  {
    "url": "about/license.html",
    "revision": "cdfdcf7227802768980d376e60b582a8"
  },
  {
    "url": "about/roadmap.html",
    "revision": "8a54b61cab91c4981e4fd2fb46f8e5f3"
  },
  {
    "url": "api/index.html",
    "revision": "865fe59faa545208cf6972256927c32f"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "ad59ed2bcf40afd188a931f1e7ac3d6c"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "1e94c8be6154ff13df275022d1145e1f"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "ee2406b466afc69bfd0c20f4b7bd1e5e"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "0358085e783d5f267f9cc1caf3aa16b0"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "75b9007044b31fbca9b24f08998cf3bb"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "89693bdd28c62ca5fdcedd76efd457fa"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "9cd3ef8083a4b169d8bf23e1435ccdfc"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "1c725d1da4a7782e3de5f74cb0db95b6"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "feceaafc605cf0022fbf43cac8f12801"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "6ee06fa9fcb92be1d50fbc29f8d0a4b9"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "3083c44058d2a051fa5522c67c152932"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "1c200a11347d8189dd14402cb1bd7cc5"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "443be2e77223b658a7003076b48cb548"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "3e3cad87dc49500192d098747e9427f6"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "2baa6bdb6bfa1e9f3b3f4050e6453798"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "ea177550e981566a8207f2ed0368cfae"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "1753bfaac8e8f4c03908edd21b12f3ca"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "b041da1ee7ee91f264d5f8330e483570"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "775b494a7973ccf74e12d8973b8b763f"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "24cee2200994f14912efc82c511095b9"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "e0d4ade551832a7d01d2bd1d23db3244"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "ecd3264254ef272d5c6762df89c5f261"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "b51cfdbef891a81e6a899ad83611dedd"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "52e188d67d110db218345a4c7e7124eb"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "bde9bf75824429809b7674fe01dde57a"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "e98af7d1cb3ee5828dfe334d6df123f2"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "b9aa5e60ca4c62c8a66a1977325ab39f"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "2ed00dbf717f30bcfdc609a35e1e0b2a"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "6c88d30ce1cf55ae1bbfd7fc869b8f3d"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "725ddd50688687802ebc64820d6345b4"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "07051daab76273bc988328373c2a61e7"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "3986b411d52d6966e45cb2b998e562da"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "cd3fddf29812c85deff3ff9e06d29477"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "4228898f6770d90854bbfd1951d3da68"
  },
  {
    "url": "architecture/index.html",
    "revision": "784ef389f4d0f86c8a662374df886d75"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "15dce7c2459fecc78dafae6d2fef56ad"
  },
  {
    "url": "assets/css/0.styles.9fa317d1.css",
    "revision": "dddc7c0257a7b9d7f4a81f34694ba431"
  },
  {
    "url": "assets/img/aggregated-feature-data-model.688823b1.png",
    "revision": "688823b1d38b25a2bf17ca95920def55"
  },
  {
    "url": "assets/img/aktnmap-layout.7dce3192.png",
    "revision": "7dce31929edd640a0491536514cbe7b9"
  },
  {
    "url": "assets/img/application-hooks.e15ca2e0.svg",
    "revision": "e15ca2e0e0ce1b30ac2716348e14cc33"
  },
  {
    "url": "assets/img/authorisations-hooks.223455bf.png",
    "revision": "223455bfff7bf51dddf7721b4a40d5f6"
  },
  {
    "url": "assets/img/catalog-data-model.998b319c.png",
    "revision": "998b319c85f0c564838fe6886a1aa5b3"
  },
  {
    "url": "assets/img/cd-pipeline.79fa1089.svg",
    "revision": "79fa1089efa2822bd40f57e6c9e6c20f"
  },
  {
    "url": "assets/img/component-view.de49f2d5.png",
    "revision": "de49f2d54005249f92b47c78e46776cc"
  },
  {
    "url": "assets/img/domain-model.0547d09f.svg",
    "revision": "0547d09ff803394e1f2d859c04728556"
  },
  {
    "url": "assets/img/editor-lifecycle.174bae43.png",
    "revision": "174bae432562fed4c258bc985253d0ac"
  },
  {
    "url": "assets/img/feature-data-model.de64ed49.png",
    "revision": "de64ed4936ffd7dc5ee67482f140cbba"
  },
  {
    "url": "assets/img/feature-hooks.c545f93a.png",
    "revision": "c545f93a07bb3da5d461aaf310813751"
  },
  {
    "url": "assets/img/global-architecture.62f2e9b2.svg",
    "revision": "62f2e9b23f59d325b00376982b49ea43"
  },
  {
    "url": "assets/img/groups-data-model.437e9630.svg",
    "revision": "437e963022b899ff09e989224a42ba90"
  },
  {
    "url": "assets/img/hooks-diagram-template.bf7579e1.png",
    "revision": "bf7579e1f6e36a2f9585242446149c20"
  },
  {
    "url": "assets/img/item-collections.59bf2c4c.png",
    "revision": "59bf2c4c802c8fc5c68c359ecfa95398"
  },
  {
    "url": "assets/img/kano-3D.65e359f9.png",
    "revision": "65e359f95783bb99097fc5b763ec4151"
  },
  {
    "url": "assets/img/kano-components.ad92b7e2.png",
    "revision": "ad92b7e2f4bf02c26bb9e24b67f19b11"
  },
  {
    "url": "assets/img/kano-layout.702937a9.png",
    "revision": "702937a910e38ce3e140ae86cbfd5b3c"
  },
  {
    "url": "assets/img/kano-weather.2b6d4bbf.png",
    "revision": "2b6d4bbfa0992bbbbaae5745b2a7db4b"
  },
  {
    "url": "assets/img/layers-panel.def38fe5.png",
    "revision": "def38fe54ce12f8b11b1d523eeacbaec"
  },
  {
    "url": "assets/img/marker-cluster-2D.63ae3032.png",
    "revision": "63ae3032f9266059c3d95ccb402b0608"
  },
  {
    "url": "assets/img/marker-cluster-3D.e8927429.png",
    "revision": "e892742919b7d249bada3f31153e11fa"
  },
  {
    "url": "assets/img/organizations-data-model.0d40de04.svg",
    "revision": "0d40de04d4ac06c438ad08de62bdbf6b"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/img/storage-hooks.f7cd9bef.png",
    "revision": "f7cd9befe2f959dfbe39b009dcda2ea0"
  },
  {
    "url": "assets/img/tags-hooks.19298e57.png",
    "revision": "19298e5708cae740717b9063f3f8868c"
  },
  {
    "url": "assets/img/timeseries.370f7197.png",
    "revision": "370f7197130302dce62fdcd4d3be49ea"
  },
  {
    "url": "assets/img/users-data-model.e037f5f6.svg",
    "revision": "e037f5f6dd66241e355c8f7b559237e4"
  },
  {
    "url": "assets/img/users-hooks.506d5935.png",
    "revision": "506d59353934862bbe3bb0fb5210ffdc"
  },
  {
    "url": "assets/js/10.0e9dbc41.js",
    "revision": "666bd55c2b7b6bed63ff6f3b4821712e"
  },
  {
    "url": "assets/js/11.5abb5e6d.js",
    "revision": "d856604ecd0395fc296c4b45510e0ab7"
  },
  {
    "url": "assets/js/12.8b540f47.js",
    "revision": "8fc1c753c60da09802a83a438ec2fa14"
  },
  {
    "url": "assets/js/13.3148f7ac.js",
    "revision": "abb9606f438eb40137622e5ced511364"
  },
  {
    "url": "assets/js/14.a3e27be3.js",
    "revision": "02b7198165fc585eea6be0d3e1a8fd4f"
  },
  {
    "url": "assets/js/15.518dd8e5.js",
    "revision": "879b409ea7f8316235c942668f27a39e"
  },
  {
    "url": "assets/js/16.28e315cc.js",
    "revision": "191548684ebd04f79fdbe6906bb6dc7f"
  },
  {
    "url": "assets/js/17.71dab417.js",
    "revision": "5b0347e6be70b2387082b3d85877b69a"
  },
  {
    "url": "assets/js/18.33f1ee78.js",
    "revision": "07e652af817ffb33e49bae84904e1d91"
  },
  {
    "url": "assets/js/19.76767d6c.js",
    "revision": "6cd4adf395148deaa8a3434b3249ce5e"
  },
  {
    "url": "assets/js/2.e6b7f245.js",
    "revision": "b784bc26b5a779e411e850bbebaf5a26"
  },
  {
    "url": "assets/js/20.21f9278b.js",
    "revision": "8639476cd5cced22e90f9294a410bda8"
  },
  {
    "url": "assets/js/21.1396f9ec.js",
    "revision": "2ea865e6da115c0ec989884c5879dc6d"
  },
  {
    "url": "assets/js/22.bd960c42.js",
    "revision": "a6306135cfd44f4424196fc3c8445d3f"
  },
  {
    "url": "assets/js/23.e114edfe.js",
    "revision": "0bec44ef87f4c3779a0c65c584c680e8"
  },
  {
    "url": "assets/js/24.7b3243fa.js",
    "revision": "7fa28c813c319c3caee86947e7f0fa4b"
  },
  {
    "url": "assets/js/25.863b31f3.js",
    "revision": "7a5bb0f2c3765be2d8d3b36485f7cdf2"
  },
  {
    "url": "assets/js/26.e63f3e4a.js",
    "revision": "38130029ca079f863fd9b043ccc36281"
  },
  {
    "url": "assets/js/27.60b6127b.js",
    "revision": "0188d1bbbebf20e2e7ffc6c3a135b910"
  },
  {
    "url": "assets/js/28.a89f97e7.js",
    "revision": "e894c2936fad67c2a160e028f37f49cb"
  },
  {
    "url": "assets/js/29.843276ff.js",
    "revision": "55d32cbb582ad02101718d4f57850a2e"
  },
  {
    "url": "assets/js/3.3355429d.js",
    "revision": "3a776af63e5f78b2fa731032c1820364"
  },
  {
    "url": "assets/js/30.51d9a20c.js",
    "revision": "96d2445db494b9ddacdf3dbc7f4b013b"
  },
  {
    "url": "assets/js/31.45c55b0f.js",
    "revision": "de5552701fbf82c1f9e76fbba8e4bc53"
  },
  {
    "url": "assets/js/32.124609b0.js",
    "revision": "8932ac1da31ee46f5e92d27de020f0a5"
  },
  {
    "url": "assets/js/33.6b1d6306.js",
    "revision": "47933deb755087f015fb2106e2be2df5"
  },
  {
    "url": "assets/js/34.1cbbee40.js",
    "revision": "88a15b79b97702d155337879a6da46d5"
  },
  {
    "url": "assets/js/35.43101a30.js",
    "revision": "9b0183ce2bd30069c6d3d5aecc46f30f"
  },
  {
    "url": "assets/js/36.215bc388.js",
    "revision": "d6221417cdda74d87efd49d7f2e70088"
  },
  {
    "url": "assets/js/37.ca79bc7c.js",
    "revision": "7d5e0b329045f0ed264bd25d7bc83fc7"
  },
  {
    "url": "assets/js/38.d70c1093.js",
    "revision": "279575630afc61162334e0390af87cbd"
  },
  {
    "url": "assets/js/39.e7820f47.js",
    "revision": "8345cb2924e105a989911b372e6e9a43"
  },
  {
    "url": "assets/js/4.05e1e30d.js",
    "revision": "4ec0a97fe5a3cf524ed6154ae05643a0"
  },
  {
    "url": "assets/js/40.b82b1130.js",
    "revision": "1ec620f55fe9d7fe91cb75dae799bd9e"
  },
  {
    "url": "assets/js/41.7b37b3a6.js",
    "revision": "62b726cd3c74f87f3ae4a4662576e146"
  },
  {
    "url": "assets/js/42.85ae0784.js",
    "revision": "b6ea5cb650e9377c13d9da891f5be37a"
  },
  {
    "url": "assets/js/43.0c0e06bc.js",
    "revision": "ac813132c49e4b9cc497dea8ee3106bf"
  },
  {
    "url": "assets/js/44.5e0456de.js",
    "revision": "6afbc80dbf8d1a4a04e29422671c06e7"
  },
  {
    "url": "assets/js/45.5bcb9967.js",
    "revision": "cf78a55baa8553fabeac7d6ce3c4d0c3"
  },
  {
    "url": "assets/js/46.78c69694.js",
    "revision": "54e1f99cb982cc2ce6123b956cf052af"
  },
  {
    "url": "assets/js/47.0c71973a.js",
    "revision": "cfca678ef24e15e0a13eeb61cd622716"
  },
  {
    "url": "assets/js/48.4f7bfdb9.js",
    "revision": "16075e3ba218a0d30e2a698150a0424b"
  },
  {
    "url": "assets/js/49.5c7d3349.js",
    "revision": "d65659efcc9f0d980a80b32a034f6cc2"
  },
  {
    "url": "assets/js/5.9a6b1310.js",
    "revision": "ff14c81e7c99d1fd513d03e5b51b2479"
  },
  {
    "url": "assets/js/50.d36b07d1.js",
    "revision": "540d7bf7833573324721872a4720bbcd"
  },
  {
    "url": "assets/js/51.e080ef08.js",
    "revision": "7a75d38bb4700d8d6c80116e41bf7e0f"
  },
  {
    "url": "assets/js/52.2a1ef113.js",
    "revision": "56aec456f3e9fc31926bdfd17d47ad97"
  },
  {
    "url": "assets/js/53.aae6472b.js",
    "revision": "e4bf2b15785f3823195499b4ec11bf2c"
  },
  {
    "url": "assets/js/54.219da59b.js",
    "revision": "3cf15201b3d4c10656dabbe1e8c99ab1"
  },
  {
    "url": "assets/js/55.7d1f1489.js",
    "revision": "ef198fb9e085ce6385a3a6c661f33262"
  },
  {
    "url": "assets/js/56.f4759c8d.js",
    "revision": "5acb573b4f0301dab49607c6a4552a62"
  },
  {
    "url": "assets/js/57.6732d989.js",
    "revision": "06a9dc4883c911798c65a4062b048e2c"
  },
  {
    "url": "assets/js/58.87daab7d.js",
    "revision": "0657770c6719cf58ee410a923cbbebbc"
  },
  {
    "url": "assets/js/59.8f83f031.js",
    "revision": "c1ef620c4e0c3ff86da548409811756d"
  },
  {
    "url": "assets/js/6.38e32613.js",
    "revision": "2d72e6b6bce0ac50ff94ec10fb2d82bd"
  },
  {
    "url": "assets/js/60.46f0530a.js",
    "revision": "be7a05b40b6c10a2bece96c9d7c10fd3"
  },
  {
    "url": "assets/js/61.9c935a85.js",
    "revision": "c7620be444870e5a2d46bac7e41aa3b9"
  },
  {
    "url": "assets/js/7.4c67a6e3.js",
    "revision": "c405d58fbd40163a1d1f334e93016622"
  },
  {
    "url": "assets/js/8.93a56dd8.js",
    "revision": "7917042f61dad2382c623fba3294aad4"
  },
  {
    "url": "assets/js/9.c80db7c7.js",
    "revision": "66aa02b12de9ef992b27b529758e4180"
  },
  {
    "url": "assets/js/app.c7f09099.js",
    "revision": "6c335346792a80a1a01c22a05dac0bbe"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "fb12576d6505dc304e0e79cd101a02a5"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "cc518ffc2b5a136a524b67974811b53b"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "9c827c2fc90166b64d74a19aa2c349bd"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "e396c844bffbe4c46cab85efe310d585"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "331c2e1aedc5a15176bf52f17db3ae55"
  },
  {
    "url": "guides/index.html",
    "revision": "8de2b45f1ced1446e4152571a88c9604"
  },
  {
    "url": "index.html",
    "revision": "439d0b0fbca56251ffb5310c0e5f7cd2"
  },
  {
    "url": "tips.html",
    "revision": "1aa13804637417f1757100b2d40670a6"
  },
  {
    "url": "tools/browsers.html",
    "revision": "6ac859115587cf973e92e756607af1ae"
  },
  {
    "url": "tools/cli.html",
    "revision": "b0eab4749e6584361826235c28f0253a"
  },
  {
    "url": "tools/documentation.html",
    "revision": "c755feb763953c155b2724f4c0a23f7b"
  },
  {
    "url": "tools/index.html",
    "revision": "364d96958365ca7750e70b2b497b135f"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "fb5a432402756e7547561af83a030eda"
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
