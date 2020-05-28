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
    "revision": "676fefc828e5507610fa99a9535be3f6"
  },
  {
    "url": "about/contact.html",
    "revision": "78630f2be3592817177251dbbb28f590"
  },
  {
    "url": "about/contributing.html",
    "revision": "2ffaebd0abbba49f0abaa9e16b45c68c"
  },
  {
    "url": "about/index.html",
    "revision": "ac9a1e3aa46feb5bb05360c3dc0e5f6f"
  },
  {
    "url": "about/license.html",
    "revision": "75f750087aaeb3204cbf4b86c57d57e1"
  },
  {
    "url": "about/roadmap.html",
    "revision": "99c20cbcf15993a27c431f127eb21205"
  },
  {
    "url": "api/index.html",
    "revision": "eff69d73fae28eb73cf061bff80eabeb"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "2012a22d94cc80a962c7d60557d195fe"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "4ab9b03fb1c8095d0bc1f56c3cabe190"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "e5778025e670e8e67a472bd88c88db16"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "1ca8962842d51b95324d291ed0fb8492"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "3bffe1fac9e6a4df9663e71bcac95f80"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "863da61d715006463fc7b50cdbe2796c"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "42f557c809f4abba976ecb50b3f8b9bd"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "a41b36e82ad64842c9689d4db39f983d"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "1dda7c27eb28877907206753bcfc5ca4"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "e1c40080a20331f136b0af644f29fddd"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "d5982660c4f680e977a0dd6d3b4131fd"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "e989a4d2639c809c21e8c9c8060036b0"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "e5b7a677a6a65b6ed1cd058d33764dec"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "3bdd49944fe75446026b1db7374c30c5"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "e47454d328b3df415c512047b3c0a694"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "c7681cbf1185eece47e326652ddb6d26"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "2ed26029dca6dfe2b5530126a71e502d"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "df7695bc40d60973944da5c29fcd85c3"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "cd9a2ebc4d1a003420e99ac708ae08c4"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "8303368281bbdd0cc76617ab22dc0194"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "98e44528af50522dd6ca4068a6db65f9"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "3edb4e2de14d13f8ab18fb4f73f148e2"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "436b0e4757d4e2be54e7978a85bc6bd7"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "f11a4116591336fd0d5176055ff6442a"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "2ae4d1409d638b5e3584f3a9ef82a7e7"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "f8a425282c770e96124c1dfc1eee90ba"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "6bd3d51410b162dec1ca8b3594ea7125"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "36c8c82ff518dc5099170d93b9f4d0b1"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "a661d53888ce2330167b529141d3ba06"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "37a6b47340e43cd7d7511282a3688a8f"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "d69123cae0ff93e88370b32f67ec4cc9"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "c32432f16aba47051aecc78771cee74b"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "c2ba2aba47d1d8a09226d747a0b0034e"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "9c6491b2936a995387ebeaaf9a9b88aa"
  },
  {
    "url": "architecture/index.html",
    "revision": "e407808320b627f497be2e9ca53e7dba"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "2bac874a613fddd6a7e3ec1b27f08f43"
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
    "url": "assets/js/44.95142e7c.js",
    "revision": "59c205ab676de0f635e0a5b8116f6fd6"
  },
  {
    "url": "assets/js/45.c9cb53c9.js",
    "revision": "0bf27b959a7954b72a6596f6394610d5"
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
    "url": "assets/js/56.003abe86.js",
    "revision": "35bcc4e45a7b17a4a80e5f81524eed27"
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
    "url": "assets/js/app.48bf7711.js",
    "revision": "5e9e8e78ff2e0d31fc05472126067ba2"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "6b61d44e622b9eb50543297cbd382619"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "137b55f3b41e2b31270ab634c68df636"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "76b3541693d6e0bbe494457c6c84ccf6"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "182131627503535135a189900957fdf8"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "fcb92373b8cec00d40df6633cc0aa4b0"
  },
  {
    "url": "guides/index.html",
    "revision": "3676a37a6bf3ee4488d40cfd3a4c64c3"
  },
  {
    "url": "index.html",
    "revision": "2f515da6c97bebce08866ebba7d9afc4"
  },
  {
    "url": "tips.html",
    "revision": "9d25fa698d69121e086e18896e95563f"
  },
  {
    "url": "tools/browsers.html",
    "revision": "18ff57902421167fe8686d7d6fb842a5"
  },
  {
    "url": "tools/cli.html",
    "revision": "3fd5c9851d6b3a3efba37ec73a3afb1b"
  },
  {
    "url": "tools/documentation.html",
    "revision": "14b6dfda1f31d8b761ded8bc6b676018"
  },
  {
    "url": "tools/index.html",
    "revision": "5ab11ae42d684b70523d6aa736f571d0"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "48e8b2e22b8906c80105027def29133d"
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
