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
    "revision": "89f3e34e0d0b0de7a2f5edad72ccd089"
  },
  {
    "url": "about/contact.html",
    "revision": "af44cc52a9575900c3ec8cfdbe0d5f77"
  },
  {
    "url": "about/contributing.html",
    "revision": "e1d35ff5d1ec74f1650fba57ea1ae9d9"
  },
  {
    "url": "about/index.html",
    "revision": "748c7ac63478e6a9471ed96e91dd3c47"
  },
  {
    "url": "about/license.html",
    "revision": "ea588647ab4f3eb948d535825900b40a"
  },
  {
    "url": "about/roadmap.html",
    "revision": "bef62f1a3bb1b24e5c3344ac908ad288"
  },
  {
    "url": "api/index.html",
    "revision": "5fc064cf47afad93b89d1ffe9e631607"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "a79ec28693dbb8effad743400ac599d0"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "39c764cf32dbcd23325ca96548300f23"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "458fc8c0f2f5ed1972c5713ab4094436"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "51a8a57ee1c92214c3f7b3a408b3d6c6"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "442b00c084473cb6b02fc05d77ace709"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "6ed0c9f9548a43eb03429dc4f1ab4b3d"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "51430103b08b44ccf22cd4a34337e88d"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "68858ef33dc96e61f28998188dd24f5f"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "244e3f38312752b86f592a413163fd31"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "762df50d33deda07d58e92b16969bcc0"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "289246bca305d508bad33fafbde9511c"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "7e8544a67c877e409f6a9c8db2ae89e6"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "539d1ea077e405bdd3631fc0fa8a619b"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "9ecfbbb6b7ced96a0e9de13ee76f0213"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "af442ff34a93915352073678550e3051"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "455264d8c4d82010f3b98561b96b1417"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "cca43077bdb0ba3732a0d5c358633d22"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "7d52645a59497806b4d573f145c8f594"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "94f9fdbae45ed39854cd23e57da22015"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "f207a2d2323ef0ba062774494054ea3b"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "ecf875035781042d76f8903ac824cbf7"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "680d6f0a5be3af9da82e5075aa65ae38"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "2f3a655cc0329596ad43cf8661c3cccf"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "00d87c771aeb4140ee4e9c8e979fa091"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "c08b6a4305cb0c38a1511206951b661a"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "c2844715445bdfa5b2080619b872ebf5"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "7c0865417eb4bb416e040fd96c7c2112"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "89fc8a8f4549a5b51b74d949ad11a563"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "02b8a501b855d80701c08d45f1671094"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "d88133d3f4555538e4d6457063c57f11"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "f00a06e52ae6f954e3db400a98326a15"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "c0b4d3c1142506b4c77c38df4c97e107"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "d6d0f2d41eb75c04bbe394c5308795ae"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "a4d8bbb34c12b4ec0a1a3ab4dba7fc6d"
  },
  {
    "url": "architecture/index.html",
    "revision": "924a303db03d96454e8e77112631c5bb"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "ecc82be26eae67ef36bfb753e3207712"
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
    "url": "assets/js/30.97bd8507.js",
    "revision": "b9b268afcc894b8ec3c4355c633e2f34"
  },
  {
    "url": "assets/js/31.80f7e6d5.js",
    "revision": "b19d7d3f3b0123ca6db49d86c5282866"
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
    "url": "assets/js/35.a32c2d5b.js",
    "revision": "5642ace43c7ab6f5b65a67309b0755df"
  },
  {
    "url": "assets/js/36.e1910177.js",
    "revision": "a006f0221b8ad8dceb8e64399235d876"
  },
  {
    "url": "assets/js/37.51a8b902.js",
    "revision": "186824e8be709a940dfaa569d890529a"
  },
  {
    "url": "assets/js/38.e4525f92.js",
    "revision": "3a2eeeb236a08f298324d1e2bc8b9d47"
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
    "url": "assets/js/54.219da59b.js",
    "revision": "3cf15201b3d4c10656dabbe1e8c99ab1"
  },
  {
    "url": "assets/js/55.69806b1d.js",
    "revision": "8b7ff4e219beac1751aed538f363a574"
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
    "url": "assets/js/app.cee0318b.js",
    "revision": "2a113b408e03719ef7d5ddf3d56435fe"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "06cb209b8b9ca15752353b71de334b05"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "4ace10857ac4ed55f209fcf4b7582fa2"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "f506888f2419241feefe0c2552d2ec8f"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "9d958acc6eff45f489f05760b3f23392"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "821bb993983687eb6e1323e5878948d3"
  },
  {
    "url": "guides/index.html",
    "revision": "1a4ea3e69b4d19a1e6512d0db331b957"
  },
  {
    "url": "index.html",
    "revision": "52e97eb4beb7d4ffa1d35b4bf4346090"
  },
  {
    "url": "tips.html",
    "revision": "cd90bc83820871ef0ec0a678e76fe69b"
  },
  {
    "url": "tools/browsers.html",
    "revision": "5f9504b497e35a476ec3c1bd8667ea33"
  },
  {
    "url": "tools/cli.html",
    "revision": "e5e2aed2035cd662a1678c79c561cc83"
  },
  {
    "url": "tools/documentation.html",
    "revision": "7b5d374b1da63388d7dd9e71623014db"
  },
  {
    "url": "tools/index.html",
    "revision": "c0c4944fa57d1db2e48afa0ff1b52fea"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "b41654db0f7b8833e55006f6f50ec44d"
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
