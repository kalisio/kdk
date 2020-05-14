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
    "revision": "889febe8475577d1ad48f8f59ab1f1f0"
  },
  {
    "url": "about/contact.html",
    "revision": "a3df454d2cfabb138b853563e2d16bbe"
  },
  {
    "url": "about/contributing.html",
    "revision": "7f8869caa661730b450c170f4d292963"
  },
  {
    "url": "about/index.html",
    "revision": "e789457d0c61a56d4c259f50c8f66372"
  },
  {
    "url": "about/license.html",
    "revision": "2b396fe25e4cc5d4051e9f1cc2b992d7"
  },
  {
    "url": "about/roadmap.html",
    "revision": "18b60218096f9e2f70cf7bbf0dcf4e8d"
  },
  {
    "url": "api/index.html",
    "revision": "a381181b9ca98dc11a56b0f582b3d826"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "24cfcbf0585294f2bb8bd28d1676d729"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "3a8f20feab230eba61fa99340171b527"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "7eb26ff70736e4f2006853eb78cd977c"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "4166e523dfd4c50dba36496cfd11f1c3"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "d50585041057b987e6695b43f91d3b99"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "3971035e02fdd440d48c52bd64f01758"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "469e798632771b34dff4b77abeb58728"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "9c87ab4b3348febdfe8d8f450c218a28"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "f220461e2ffd48aad8fc45ae6e83e1a7"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "3fd5e6af845919a77fb6dec92cc4b016"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "8f4c6c8ad544d05fd182d1e6d0ff4395"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "b99aae8ecc947ba88246e087439c7f92"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "41953251d25001a5739baca21cf46aa6"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "70f5d8f57dcf80eb0d32eb198aa3f207"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "61b1ca2af56c3b693f1809e4a98c9cd9"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "084e9502573a1550ff599f6c55305fe6"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "989d6a53252e25110228f892d87c9b9e"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "d4ada321433008e08d3bdcd626ad4571"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "91c8af30932e6081757d158679531ea8"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "2ac22ebc52e35cb0376fa30b1c2b01bc"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "66c63fce81c732a37657dc73ebeb69e5"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "771db16668e57dda7f9e580c1d46dfaf"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "421e628d9e254d3cc212f3d98f8b1b68"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "f2a89a252bb371bcbd9789b222bde018"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "cb2be0ede07f4797c93d74da982eb4de"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "12df26af0314b9cab2b3cd3c3a34e8b9"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "36508162cbfed15d0826821e2087d997"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "3692dfb638dba8cea42155ef697fb6f7"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "00f3f3be8284dabfbd1281d5cbd1179e"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "3c65ca1dd8ca4ffcc49cbb5d2b64b880"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "292546a5d2c2fb8bed23f802b5634b82"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "c8cb9b23e38d2d53633231c48bbf7ff3"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "7422d95fe63ab0e5e86e7917257e5370"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "31cfd528a8c91d8771a7be3ebc2c7bf2"
  },
  {
    "url": "architecture/index.html",
    "revision": "66702c986291e5a7729a1e272e256544"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "9c0f88597d3b6951a59329565f9ff027"
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
    "url": "assets/js/10.45023682.js",
    "revision": "89b9a5293c1d0744b2980b8468f47901"
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
    "url": "assets/js/39.8be109e9.js",
    "revision": "d8de65e29a3f7b0a3b4130adcccb4ed5"
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
    "url": "assets/js/5.a1660827.js",
    "revision": "d5fc20d1a5b32b9caf9fc7e6adc8dccd"
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
    "url": "assets/js/6.d0827de9.js",
    "revision": "fccf2b63b2c30775d50bb610d607a32d"
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
    "url": "assets/js/app.0c06a435.js",
    "revision": "422c9f1cb5577fbc2546b86209ce1ed9"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "f9ac27280bf9562c5cfe411ac4611851"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "fd2ff9c725e7e43437db99a3a3b97aca"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "4ec5c4428b99c2279884153c04dc0581"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "f007a02c75dd9f9d1a31fc9710a2601a"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "12762baad58abb906db14abc31bee2b8"
  },
  {
    "url": "guides/index.html",
    "revision": "9889610258814f0c3855cf8ffe931717"
  },
  {
    "url": "index.html",
    "revision": "97bc6d15e0c8f0c592252d6a395deeef"
  },
  {
    "url": "tips.html",
    "revision": "0a02e231cfc319ddb8dcc8cd5dc63241"
  },
  {
    "url": "tools/browsers.html",
    "revision": "f914f057b9b1fd6c7217c6b261340be8"
  },
  {
    "url": "tools/cli.html",
    "revision": "172930a83269dd4a4e8c40f4119bb953"
  },
  {
    "url": "tools/documentation.html",
    "revision": "516265ae4b2e3b1c992ceb9c3dcec43c"
  },
  {
    "url": "tools/index.html",
    "revision": "2bf2645fd5c70308bc69015ecd72e442"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "bb84a52a01e8e9e17c7cb67f0ea69f36"
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
