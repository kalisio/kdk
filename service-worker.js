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
    "revision": "299399f93c8b5f966d6dfc9521e3abcb"
  },
  {
    "url": "about/contact.html",
    "revision": "69746dd6dbd03817d1dcd393d061871d"
  },
  {
    "url": "about/contributing.html",
    "revision": "6696f8b7076238a3f1fd7fde25cefaec"
  },
  {
    "url": "about/index.html",
    "revision": "66bfd8e0a53e69c2a38cd9cb22a9e64f"
  },
  {
    "url": "about/license.html",
    "revision": "fb2e74c7115fca046dec656ce0bd1f30"
  },
  {
    "url": "about/roadmap.html",
    "revision": "814ea2dc2410e00c638b777316085862"
  },
  {
    "url": "api/index.html",
    "revision": "a98587b5f34a033d09f98a47d2e20f0f"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "5af8e198db2a46581ae6670893dc44b4"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "7e09196c1a6f8b45d031beb848a1f155"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "9d81b823f09c5788a98058ad8423de40"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "9d9b6cdcf5e4e5defd4d2f0a456d448a"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "fc2222640439b33cef5cab2ae96a7ff2"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "094fce6b43843a7b74d24e2a7469deae"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "c289bec13f21831151c224c80b04ce70"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "2ea3ecafc9df84074f3acb4173d03434"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "fc2e228dc9207e94fa384592b18ad64e"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "8012068eb9ffc3003ea6f9ef66f70ceb"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "093ef4a9c95def1c2c38dbf91c6ecc4c"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "d51580c16823880b06f06874a153c896"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "4615e367f53d5f50221bd1a3451a9312"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "4818dcaf4ff6a0f7916753bf23c3dc88"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "0f4c06923b2aaa2d6d64f18970812595"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "1ec67b2219c1e77ea9a64a1ef23d3f12"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "e879f0beee297c3860792858bd392711"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "33706ef0073ebe14c6cb236a161afed8"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "95d049bca6c031d45fafdf3919b948fe"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "00a8a12452f70649b99ccd4c3b173289"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "e2ed7f4bd7981558102bcbdc0cceaf85"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "98fbd187e0088b3e13995dacd597bf07"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "a52e0b96aa0ad238afa0d16c2fbeeade"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "3ffb843550b762bbb46a48db9d9dc0dd"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "703c389644cf0f9ff6be9132154eb2ba"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "36605a1e0edc11aa14335b42285e25c5"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "48c939be2c49a7b3c49b55adf07f78cc"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "836112483f04a10aeb7ac1f1f5140244"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "ca818ab8d20bf45ce835d16ea20d3aa9"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "9d51810889f3cf41c940ffa48510b349"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "f550b1aa6f6c24a1bd17fb4531a5c6f3"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "ab0285c3df355a6eacd1802c38f81e9e"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "4bc6f519d909a097540d222c3b5aa3fc"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "97a12ccb25db77005e1d81329507c934"
  },
  {
    "url": "architecture/index.html",
    "revision": "3d3aae38206acd7bb81d5e412dcc7909"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "e68cf267e9ec2c0ae8e7756ce308c782"
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
    "url": "assets/js/14.b4b813ad.js",
    "revision": "e564f4facb27dc031f8b78144e9923c9"
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
    "url": "assets/js/20.21f9278b.js",
    "revision": "8639476cd5cced22e90f9294a410bda8"
  },
  {
    "url": "assets/js/21.32f22864.js",
    "revision": "5e14fbd63bc234c25511704b7e93e520"
  },
  {
    "url": "assets/js/22.97e1088a.js",
    "revision": "9145c4e7f754467a2019f4b7466433ea"
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
    "url": "assets/js/33.da17fbca.js",
    "revision": "76782419cc29501f21988fd3c13fcf3f"
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
    "url": "assets/js/4.4bcc6c5e.js",
    "revision": "ce6cd542361fda4c1eb0272c9d52f192"
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
    "url": "assets/js/5.9a6b1310.js",
    "revision": "ff14c81e7c99d1fd513d03e5b51b2479"
  },
  {
    "url": "assets/js/50.40673097.js",
    "revision": "daa314d40ec4d0ef36274492b6e8715f"
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
    "url": "assets/js/53.a196e5a8.js",
    "revision": "f62a31a5fa48dcd68b0250308944007c"
  },
  {
    "url": "assets/js/54.a0534692.js",
    "revision": "6c153349cc55745d455a161faf496eb5"
  },
  {
    "url": "assets/js/55.b665f674.js",
    "revision": "ef751f521d4688c3d298caf409f2bc6f"
  },
  {
    "url": "assets/js/56.f4759c8d.js",
    "revision": "5acb573b4f0301dab49607c6a4552a62"
  },
  {
    "url": "assets/js/57.c11147ad.js",
    "revision": "79de565026303a045a082def6122220b"
  },
  {
    "url": "assets/js/58.5b6f64c0.js",
    "revision": "991e3373273fbc1b3a39a8ce9c6053be"
  },
  {
    "url": "assets/js/59.d24162c9.js",
    "revision": "fa71b8a06441c0983975d14334a96167"
  },
  {
    "url": "assets/js/6.25ec3b52.js",
    "revision": "3d32520bfbe3d343abbaede6bfbd111d"
  },
  {
    "url": "assets/js/60.1213e009.js",
    "revision": "880ecfd1a74112eb996c81e72b8b735d"
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
    "url": "assets/js/app.1c6097e8.js",
    "revision": "61219b486eeed19918ad22a6266e5840"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "e67032154e88edbb3c2b061aee4c0f76"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "b36c61ff1d3d0de58e9894000411e223"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "c623009caac7ff186015e9122bdca126"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "69e368daf1e4d13d723dacb3af3e3785"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "ba17e09e719aed4c98dee4f09cae0142"
  },
  {
    "url": "guides/index.html",
    "revision": "08bdeb83a0a299bfd54e2360d20748ed"
  },
  {
    "url": "index.html",
    "revision": "a649fee6dd6d596ff327224eb6664835"
  },
  {
    "url": "tips.html",
    "revision": "ff068c49be3316169e72f7e6474c2eee"
  },
  {
    "url": "tools/browsers.html",
    "revision": "354ecc492d1c663940ff1f1d292d6fd1"
  },
  {
    "url": "tools/cli.html",
    "revision": "128facd020795fa2746ecee5ad78989f"
  },
  {
    "url": "tools/documentation.html",
    "revision": "2c85ffd7a49e3669dd70cecb93d15643"
  },
  {
    "url": "tools/index.html",
    "revision": "351e366c9b6053444d9f1f3102a6047b"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "e53bddeadf86c2315a8fad3a34ebf019"
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
