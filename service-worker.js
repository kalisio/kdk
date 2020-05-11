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
    "revision": "dd56b86c4769cb732643ae2763f88e9b"
  },
  {
    "url": "about/contact.html",
    "revision": "3df092f98c6ff2531676d67300d81fe6"
  },
  {
    "url": "about/contributing.html",
    "revision": "326f182ff1352abc04aa68db2df28f9c"
  },
  {
    "url": "about/index.html",
    "revision": "993379517d098583e9ebda2a42e03cb6"
  },
  {
    "url": "about/license.html",
    "revision": "d761fc1ce5d2beface966e49c0b5cff9"
  },
  {
    "url": "about/roadmap.html",
    "revision": "35bc8536aae3d04a6f26c43671934f79"
  },
  {
    "url": "api/index.html",
    "revision": "6fb624aa76325a632a9369ee36597d62"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "66d6cc9319ed6d272559c151468d7a72"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "94bbcf4f6d9dfa8eb1a0019cb9e5fe68"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "82e1a7eff865d38f115e21214a1be2bb"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "a30e4316fc4463896f70b1327de57808"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "840d8655bd08ea4260b4de0b93a9fd81"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "e44261c2dd6f3f8fe689b694cc302f6c"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "8d189c789cea2e377fc5434e57cfb963"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "b8a537b1c35faa6b76140591775ab8fc"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "f8e4d9243c1972723f37b63c9ddbd554"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "696554d123a964c836aa19b97db4363a"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "f709f9f7d0f7039be393a9edfd33d55b"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "75c30cb86fe4cd8ef9d0405a98fb250d"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "98d9938b036a8ddeb5bb895a9d6b1e2a"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "dfc99669be7b240cc5529f13b3646fb5"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "aa874d6e83cc044db48d19f501d74f00"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "9a144f07c4642b4b5d673c7ecdf46854"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "17a52adede5c919df852df3a97ed8ba8"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "b0293fca40fa08dee0c5e696801c556b"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "4426dba2ea48f43e5629a4b345cfc525"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "c49b7133588ba6fb4a63868a69889769"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "2aeaa924919137b9ee3b73ca268c30b1"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "607632f296a5e73c9e64c04b0323abc7"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "f0a38122a92935efbcb625d1a4607e27"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "1b56dd9052c7e6166a404fff8cb483ed"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "7ada684f1f0cd9f2835f5849ebf26856"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "2cb9acc3787ca0d14b45c16419776b27"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "56f4943b3a5aa1f7f39dd4f5752fc764"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "4e96001eaac8dcb1ee6105ccee58fccf"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "d22bf73863a4f8a63ac481f495cd97ad"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "ac6cc7b8da28106d6ae5aea517c405c0"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "43254e6d0c379e9d3165ed4884f5fecc"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "29ea117293255f013ec71e93e51902d5"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "cf41ddd2e5386ffbae141173352bc20f"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "4d727a7b62591c7f2b4bb3ab1e282f02"
  },
  {
    "url": "architecture/index.html",
    "revision": "02b43a8a01a6943fcc44902b7ffbca5e"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "595d4521af4818bdf77772bbf1941724"
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
    "url": "assets/js/41.e392da3d.js",
    "revision": "df4ac000f6fa2c607031312b8bb13061"
  },
  {
    "url": "assets/js/42.b29b7998.js",
    "revision": "72650b322fa1365d5243e87b00da6613"
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
    "url": "assets/js/56.f4759c8d.js",
    "revision": "5acb573b4f0301dab49607c6a4552a62"
  },
  {
    "url": "assets/js/57.6732d989.js",
    "revision": "06a9dc4883c911798c65a4062b048e2c"
  },
  {
    "url": "assets/js/58.12241b96.js",
    "revision": "2b266a9357c0082cdb2a055300a572c6"
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
    "url": "assets/js/app.0fd54c3d.js",
    "revision": "257776a21c72843f777bc5c42610e995"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "b0ada7aa6fb699de63501043324f8f72"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "5d1171f24e1ccd9cc3841094d9f6f171"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "4103aa5047c6d5f998609e5a91ee08c6"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "c2511664153caafa640f66f5cae7904d"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "49e5b9647a371dc4a61ace272962a82e"
  },
  {
    "url": "guides/index.html",
    "revision": "de6ac5bd51544ea4308804773e5f072f"
  },
  {
    "url": "index.html",
    "revision": "674388b3dc2be53bb437262e31782092"
  },
  {
    "url": "tips.html",
    "revision": "9259c2cc060d06e7e0aeae701229d72c"
  },
  {
    "url": "tools/browsers.html",
    "revision": "0643d1590afb7604d8971b026ac6f86f"
  },
  {
    "url": "tools/cli.html",
    "revision": "645bebba4e353ea1480c434089211af3"
  },
  {
    "url": "tools/documentation.html",
    "revision": "461c9a1a8fbb428f976b2e1b62b96635"
  },
  {
    "url": "tools/index.html",
    "revision": "62b265a5889068ceaa3c4bf4874299d4"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "4cf8ec7fa55ddd287f0bc8e1aa303879"
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
