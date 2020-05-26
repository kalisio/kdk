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
    "revision": "d830d1e2b56507056bf444def0718c92"
  },
  {
    "url": "about/contact.html",
    "revision": "2da18003d1bef5f2ab6c9c66d0c956a7"
  },
  {
    "url": "about/contributing.html",
    "revision": "e4a4ad9bd7b752548390a0497cc9ef72"
  },
  {
    "url": "about/index.html",
    "revision": "04576d0900408cd0a35469edbd95f4db"
  },
  {
    "url": "about/license.html",
    "revision": "a8f9b512dd249573c1a6ac34d8bf2678"
  },
  {
    "url": "about/roadmap.html",
    "revision": "4e54a42e0bee702eabe7fcd2be91f63c"
  },
  {
    "url": "api/index.html",
    "revision": "d49f1050b7fb9244f0c7de717d802feb"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "025f57c46ca7a0a6d1f90c59a566731f"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "f6671813372744e1e1233e68898cd7fd"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "b1849a072f7217209b727aeaed1f8dd5"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "c3822eb2160de08857bb0693500cdaae"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "a61b3ef66f9675011f1501c2889ef746"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "f55dade994d276b9dc8d310a3d7e4eaf"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "af8c79b97477ed5805f727e8483a832c"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "b496e76984f8837c68f9e541595829d4"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "c0e42acc523a999a1ed91f2a8120235a"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "b4244577c401832867147e54dcf3868b"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "44b13d64b14f3842b25a5f790d9fbcb8"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "f9e2eed14e36a367b58a6817622363df"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "555029cfdb9d9ae4d1b0b9d4ce16ae30"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "3690e83dc15fe08d8fef33fc0c64d58e"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "cc27f39cee8f0424cd235f8bca813da1"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "cc5e4076f4f655943f475b2bd9f49955"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "8a40a662dee721ac38c4db05752a03f9"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "68ebae0d2491e936610fc1d1633c819b"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "a06dbf47cc5dd1235a37a94744e0f03d"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "742fccb2fa3dd762646b7200bf64678a"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "8a9e9df498b876154b31490feeaa01a7"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "438d8a3e7e8a19eb24d2aead60c4ec23"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "de135a125499222ed9eeb8e0c5faa42a"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "c3d74000e2696571371623f78c442ff4"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "013029fadd10de114565b2000bd1ba02"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "c8a34ed5245fc48d5998a4df6d3f9c0d"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "460c5e21a80190a084a0b2603b289664"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "248bba016903addb556d114bee116f34"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "e587cfe71cb0c0d974929105b3f4e5e7"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "c13d0c6c49df37b8a4d2be8166236289"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "c546e5b8edf78c449fbf29196a69b442"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "7c7c6885a9d845c17157f2e147e3ee4f"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "f9a854cfe6d980d60f91e960861cacb7"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "09df0134b8ad910a262466aaf407eb44"
  },
  {
    "url": "architecture/index.html",
    "revision": "2fa2dbbd828c571832968e33212f42b3"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "424189e27a48ef5b3f3eb85944e1ba48"
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
    "url": "assets/js/23.bfa80511.js",
    "revision": "8d0a21cf209c81811e0488624efad0c8"
  },
  {
    "url": "assets/js/24.3fb1a1e5.js",
    "revision": "fb1e361cd7af66d6fcc186283b738a0c"
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
    "url": "assets/js/46.78c69694.js",
    "revision": "54e1f99cb982cc2ce6123b956cf052af"
  },
  {
    "url": "assets/js/47.707c2ea7.js",
    "revision": "73529802e8a7982e47f6d6856e56dc3f"
  },
  {
    "url": "assets/js/48.3724f664.js",
    "revision": "20d078b90e046c017643553a9e31b362"
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
    "url": "assets/js/53.05d658a0.js",
    "revision": "e2f7f09ca0912815726472e9aca119b5"
  },
  {
    "url": "assets/js/54.219da59b.js",
    "revision": "3cf15201b3d4c10656dabbe1e8c99ab1"
  },
  {
    "url": "assets/js/55.69806b1d.js",
    "revision": "8b7ff4e219beac1751aed538f363a574"
  },
  {
    "url": "assets/js/56.e228d96b.js",
    "revision": "c2681f29ad9708d21c424218fedfc6a5"
  },
  {
    "url": "assets/js/57.c11147ad.js",
    "revision": "79de565026303a045a082def6122220b"
  },
  {
    "url": "assets/js/58.6a630b00.js",
    "revision": "76b38272fa0bd69e7b66d494f1fdb47d"
  },
  {
    "url": "assets/js/59.8715c455.js",
    "revision": "01a1c22916f0b8d221ef2dab78e2be46"
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
    "url": "assets/js/app.242c1793.js",
    "revision": "b25bc8b0953730e79ae5ac87d435e2d4"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "ca8d928953d5c21c23b8650a47de5484"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "f6f2a61d8215d562f6a1057f07114fc9"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "c0325ffb91a8d9c92cb698330940420c"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "5ce933b00ba3f7ebd1e65b617ce6bae2"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "20cae5bad68d2df11c04083b1261e3a6"
  },
  {
    "url": "guides/index.html",
    "revision": "bc9248b4c4dd6a68954f3eb9faef75c1"
  },
  {
    "url": "index.html",
    "revision": "2b8636b8ff0cb927cbedb44a724a0d9c"
  },
  {
    "url": "tips.html",
    "revision": "912f14f35f463bbf33608e11356d4491"
  },
  {
    "url": "tools/browsers.html",
    "revision": "be06c333fdd41ece3d0f8d32898dbcf5"
  },
  {
    "url": "tools/cli.html",
    "revision": "4181c50a2cfb37649f0c2873d9b3def9"
  },
  {
    "url": "tools/documentation.html",
    "revision": "1756a6e14ce03b0b1f227b052b7af58c"
  },
  {
    "url": "tools/index.html",
    "revision": "3f73be34f03fa4045f79f8e459af55fa"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "57d99a2accc7bc671d1c3ffd7f1497a0"
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
