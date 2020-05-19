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
    "revision": "6d77e4593061b41eb7edb40d5f86030b"
  },
  {
    "url": "about/contact.html",
    "revision": "29de9a82c828ecd47a7d7fe2a124c91e"
  },
  {
    "url": "about/contributing.html",
    "revision": "a50d8a05dac472d58327190ebeafe678"
  },
  {
    "url": "about/index.html",
    "revision": "afa2983bb439531d97d3d5b3027823ec"
  },
  {
    "url": "about/license.html",
    "revision": "be0666671c874fef46d144a2ac957dbb"
  },
  {
    "url": "about/roadmap.html",
    "revision": "1636f4f50d9ac9beb8b057032bc38a04"
  },
  {
    "url": "api/index.html",
    "revision": "b89726ac7e62619a1c72412844fd3b00"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "b31ae26fccc22f67f8fb4bab518f000c"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "27620a02916ff3719bd89c8a56f46f85"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "8b20c67975b2ca66a5f5cb7305e46e82"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "e917990c7094bb7c40349255ca5b8509"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "92809c1620051cb2cc18f0466344d9fb"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "ff31787d42eb283805fc88bf45cab175"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "d52fb73a702fdf19f362bc985ae8f0e6"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "39eec40bf2124ffb49215b75fd008ae9"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "7f900d5eb3eb379bc86981c9067a4500"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "be797bcf4fb02ee6822d287cc04c9611"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "3549ef6df88fc477c936ccbcdaed67c6"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "28964d9affeb0797e218909785e8e738"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "c518da0e1fcbca9eeac995e78bce670a"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "69b916d39575eae48d01a88804cc18f2"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "ed3066b5748d68b871fcb801407b7d6a"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "8d1e48f5ff83b6807cebcc74a705c6f3"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "1638940b7ae2b210405341e069e497c0"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "8dd1da1ce9b113da40814099e6961528"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "6ab61d1044d137c815132164a957b0b4"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "3758958905a6364b4498356a98db48b9"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "67262b3e2c041cfab392c611bc1b3007"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "14665daea998e2d734ccbe3ed553b14f"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "c502a6bdc42d58bd3b9046aaccb75793"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "55229eac7f7c65df9e7a09238a179d87"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "1cb715f3fce1423afa5d87e7b1066f02"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "3b66ea46469ee08869b449ea81ebf75f"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "d98abc93a7e77e4ba1478984ccd087d8"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "e5d1648aa74c916feb995d1c1924103c"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "88763150e232d7cc5113ca229c134463"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "ae10ce931405595b7632fde94788b452"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "f2c2c867e959a44286cc2be342b01fbc"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "0be1a2774353037fcdd1ee3cf669b420"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "6eddbf641934457e0b118376d12e68c5"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "0e8b4aacb2017a71e2a70bb3b70d0a0e"
  },
  {
    "url": "architecture/index.html",
    "revision": "5b47d12343e89d6817e74ab6fe102a8e"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "8bc01d554b709d501477316f3f0e827a"
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
    "url": "assets/js/10.77a70cde.js",
    "revision": "77f946a94a84c06858bef9862d698c72"
  },
  {
    "url": "assets/js/11.38bbfcce.js",
    "revision": "1d9d03220c79137c0dfc3bb7bcc90f0a"
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
    "url": "assets/js/16.257df35a.js",
    "revision": "1c7766b2e0c28f21c36309d252fb77ae"
  },
  {
    "url": "assets/js/17.a8a5954e.js",
    "revision": "b1709603246e18a9f800dc92dff9d304"
  },
  {
    "url": "assets/js/18.351df8e2.js",
    "revision": "8db7fd423457b21f965a8c31300dd0bf"
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
    "url": "assets/js/20.5948d941.js",
    "revision": "16f05f7656ea98ea686ce7b3fe4541cd"
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
    "url": "assets/js/24.4615da69.js",
    "revision": "b11266bc7e26fa21a7c502fa7e1871af"
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
    "url": "assets/js/33.eb2ebcf7.js",
    "revision": "4fdadd4a5ded1c04f9397b84f9675e01"
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
    "url": "assets/js/39.c6b575e5.js",
    "revision": "a4a0c2562c3d0b9909ee56f7a63b1116"
  },
  {
    "url": "assets/js/4.e2f1ab2f.js",
    "revision": "67ab3f04991ba8a2af4bc7c8bfb78c65"
  },
  {
    "url": "assets/js/40.90b4e571.js",
    "revision": "3bebd52197cc7cb3aae00b893a149fa3"
  },
  {
    "url": "assets/js/41.7b37b3a6.js",
    "revision": "62b726cd3c74f87f3ae4a4662576e146"
  },
  {
    "url": "assets/js/42.a600f4f0.js",
    "revision": "5635f0b2c5cabb4787b3163140e271d7"
  },
  {
    "url": "assets/js/43.02234de3.js",
    "revision": "834161d58e3006f623322bf0e24a3e94"
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
    "url": "assets/js/46.a988f716.js",
    "revision": "12c73c9608c4da2781ddba0b291af5e6"
  },
  {
    "url": "assets/js/47.f38613f1.js",
    "revision": "f110adcf1cccbd8169c6fae8a55d9ad5"
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
    "url": "assets/js/5.149c96b5.js",
    "revision": "0466631a39849d77f30f26a36cc9db65"
  },
  {
    "url": "assets/js/50.d36b07d1.js",
    "revision": "540d7bf7833573324721872a4720bbcd"
  },
  {
    "url": "assets/js/51.c6d64a87.js",
    "revision": "daccb0905f3f8ee5fd9faa936bf388b4"
  },
  {
    "url": "assets/js/52.39fb9f6c.js",
    "revision": "cf2d8e94c9bdd8d45695723ebf3fe2e2"
  },
  {
    "url": "assets/js/53.62166243.js",
    "revision": "160192f1c3e7ecb1f1099aee14baa2eb"
  },
  {
    "url": "assets/js/54.a0534692.js",
    "revision": "6c153349cc55745d455a161faf496eb5"
  },
  {
    "url": "assets/js/55.73d32943.js",
    "revision": "f18a8fb22587779be4e6c81225db754e"
  },
  {
    "url": "assets/js/56.f7f3db84.js",
    "revision": "648e21f9740f264c9af2d57e9f3fb8f2"
  },
  {
    "url": "assets/js/57.feeb316f.js",
    "revision": "9e555603d4162742f6c0f2005eb082d4"
  },
  {
    "url": "assets/js/58.5b6f64c0.js",
    "revision": "991e3373273fbc1b3a39a8ce9c6053be"
  },
  {
    "url": "assets/js/59.8f83f031.js",
    "revision": "c1ef620c4e0c3ff86da548409811756d"
  },
  {
    "url": "assets/js/6.25ec3b52.js",
    "revision": "3d32520bfbe3d343abbaede6bfbd111d"
  },
  {
    "url": "assets/js/60.4c5a1407.js",
    "revision": "999f01f0964dcf21303793d7173875ba"
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
    "url": "assets/js/app.669e34cf.js",
    "revision": "50667562acd9a8709be17c35af48a38f"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "bc75c2b846c9e342d5f15410fc83108c"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "a5d1b631cf74875075aad6be5ab17142"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "ee6ad41738daf400f0bdd45a3321c6a0"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "a4500e900211b44a7699e67fc797d148"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "b3cdbc31098d9917c49738772ee2648f"
  },
  {
    "url": "guides/index.html",
    "revision": "8e3923c90bf5b9703bc0d6d6a4bffe40"
  },
  {
    "url": "index.html",
    "revision": "a8a89e22e4ecae42803b7f208b373a24"
  },
  {
    "url": "tips.html",
    "revision": "3fe09f60adb23b12a09667808b0f4cb7"
  },
  {
    "url": "tools/browsers.html",
    "revision": "f521f98014e7cdbdf021746d02f5ab54"
  },
  {
    "url": "tools/cli.html",
    "revision": "776b2dd453eee0dd8df7695e5ec15ba9"
  },
  {
    "url": "tools/documentation.html",
    "revision": "a3064cd6671bed369ee06dd558fd5ceb"
  },
  {
    "url": "tools/index.html",
    "revision": "f67065441ba5a2897d4519435da97353"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "15d6883e8525ed4b126a0638a8273d13"
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
