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
    "revision": "587dba3d648f1d27bafb6af7ed543ed0"
  },
  {
    "url": "about/contact.html",
    "revision": "e8e5bf744497dbc833186f94cfe73fb0"
  },
  {
    "url": "about/contributing.html",
    "revision": "c310847d04de919c289131d18ca0cd14"
  },
  {
    "url": "about/index.html",
    "revision": "9f8e925b139bef46b01727224457f1ff"
  },
  {
    "url": "about/license.html",
    "revision": "5b1b67196da59297e81ad730a1e12046"
  },
  {
    "url": "about/roadmap.html",
    "revision": "336206c058e7702a270b33c26a18359b"
  },
  {
    "url": "api/index.html",
    "revision": "b3c870c17134cf6ef6609da158f454d9"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "d48506c42f412ebf8605a6099fa27823"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "b6f2b0c385b3a8638c5b3bd25bc557ae"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "b880b434bf57e9f846ff12e058f75906"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "488c0967ea8e73f9a3c12c97d7c53a1c"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "0ab4de63095cbdb605da2f27f0186038"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "3945756edb45107fca2bf03d8400b993"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "fbb7b464fce216b1403572000efcf730"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "c11c4b7dd572b80a626a47dab7d6c192"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "bc28d6e92c7c664b6e61cec0efe7dc03"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "d01afff31b911e865973e55b412490b9"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "74e9f051a5c11425726e685d149c19a4"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "c2bcb2bacf5949ae8be99f94a51e3836"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "e0f58b45cc0c3dd8a8a71fe96c3d5b31"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "15993d5fecd78bd6279df76b71635289"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "8eb3bd01f4aace27b9befc40c3da2b38"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "042c9184e4caf9536bcba8c261f9e95b"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "487fa1138ae7b364ceebdd660de1645a"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "5e438fc1fe8c31a8bb44c981f89ee5a1"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "3c307a67bb742950069fd7d1a410e9d5"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "06696a7f4d61f18f00cfec661a64b49b"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "4fe8b782b3daa7ce3d5e082916f85a53"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "e57e69def909959c1815501aa57b21e6"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "e0c3fffd83049e927d06e83f069b2e47"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "3a408b3a6929f043718a4b57247d1149"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "b7d1697bd81474ba98e81cade42489d5"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "35545eef4d7ae8a16193ce75212ab90d"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "6048d6568748c534eb94cf24a354233c"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "061834f294660b4f388c669763f2393b"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "c8085b65be8be355c39497de9e5d4856"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "a4620a2ee50b0001ba55082a49389db1"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "e60d1894fbe0225c20e89c35546a17af"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "9dd19c9b18b8add8ad815bf331f113c0"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "a3f4075066126c6f9c72c2b620b86d1c"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "72ad4a215f92bf01c9018baddc4a4bc0"
  },
  {
    "url": "architecture/index.html",
    "revision": "1eb1e0d28e99375f8f795841f9dbfe18"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "4cac9af35f9a4c4ccaad33b1f6871902"
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
    "url": "assets/js/15.f73ab194.js",
    "revision": "1c0147e942dbc567473a283a4dcb748b"
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
    "url": "assets/js/28.57d8a8c0.js",
    "revision": "a37aad25a72abf3a0a9caea4b802d4b7"
  },
  {
    "url": "assets/js/29.57a4508c.js",
    "revision": "c7725c6151fc5ff0ac7f81fdb5cb7766"
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
    "url": "assets/js/42.85ae0784.js",
    "revision": "b6ea5cb650e9377c13d9da891f5be37a"
  },
  {
    "url": "assets/js/43.0c0e06bc.js",
    "revision": "ac813132c49e4b9cc497dea8ee3106bf"
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
    "url": "assets/js/53.aae6472b.js",
    "revision": "e4bf2b15785f3823195499b4ec11bf2c"
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
    "url": "assets/js/56.13422586.js",
    "revision": "c602022f280bf0e42b4f7645c45bc904"
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
    "url": "assets/js/7.23bb164d.js",
    "revision": "224004da6d7a7397432847d42438477e"
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
    "url": "assets/js/app.175c6073.js",
    "revision": "c7f4c9465f9cfa66f1fd0dd064e3627d"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "a74599db841c57d4982d799f2c68d8a3"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "2b91ca66a7d19c7faca41e0729656918"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "246f4e3f4bc56ac6cd43b5b2df705dc2"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "84de2c1f89bb36b2b42aa9d368fefa79"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "d645c85a9047bfe69682b4ead188e025"
  },
  {
    "url": "guides/index.html",
    "revision": "0a91e5c9e5e3e3bfe2ee24c16c535b73"
  },
  {
    "url": "index.html",
    "revision": "dc7c24b99abe1bf13df0e82bee09a442"
  },
  {
    "url": "tips.html",
    "revision": "10ab4e8b4fdc472e6064f3ff710ca742"
  },
  {
    "url": "tools/browsers.html",
    "revision": "a6cff8ab8764a3e52bae7bc15582b374"
  },
  {
    "url": "tools/cli.html",
    "revision": "cb1c892253b6a2ea1bd7dd013bb2c7f7"
  },
  {
    "url": "tools/documentation.html",
    "revision": "e073c9962124d4f9e3ec4ed5a5366c55"
  },
  {
    "url": "tools/index.html",
    "revision": "7882e734251ea311ba797a6a60df89f2"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "057b421e8ac944236f430c99f3220f1e"
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
