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
    "revision": "490f9aec446558403062c88d1172f62e"
  },
  {
    "url": "about/contact.html",
    "revision": "83f94219a44af1df6d7c16cf04764124"
  },
  {
    "url": "about/contributing.html",
    "revision": "149e0e9590700f7a487a82fd7ba417ea"
  },
  {
    "url": "about/index.html",
    "revision": "23c7c1bf7f89251c07592061ab7fd59b"
  },
  {
    "url": "about/license.html",
    "revision": "9caa2fa1c5b2f268f0659644a99a8701"
  },
  {
    "url": "about/roadmap.html",
    "revision": "fbd6449ebc45bdd806aa63c9d458ffd3"
  },
  {
    "url": "api/index.html",
    "revision": "aa00618604e508d01a57af7c1d12e534"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "c0530366039383580026cb338b2e174c"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "e004f9dfe6e8824abcf21c6451a6e456"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "a4f6988906efa238852c1dcc46d37627"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "82dde449df71bbca7312776a698eb5df"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "81e57a96eff5d12744901f9f2e6444c0"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "f3522ff36dcd766a50f74229c659f0d1"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "0e61126c46dd6fd0208a4c2ff665cc9c"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "0e6cd0429751d0422bb76f221f7f20a7"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "d9f89b7643d020cc2d575ea11f2432cc"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "f6023b763240eb140e56538a4992735a"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "5b70ce00d102fa37389e43f4246176b9"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "d488e5f7dfa4aac763f43848cb5c283b"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "a879bec4f3eb509a0b9c8f217e1e88e0"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "d5218a5ebbd34438b8a848ae0b2fec44"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "c86e44263af8d246d98ca77aed0eec22"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "c57b4a31d28158c4b728e7a67049948d"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "8446c6dc587e6399a17f56b3f01db2a7"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "2c0e4212ccb0bc5e6277910129cc447c"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "f2a990a2bb3f1db884c9482d7a15862d"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "60f129c62575bd669ab507cfe5c138ae"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "1c4bb6fa10883f4b5eea389dddc7af77"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "ce3ba947dd7417441c86f9948192a708"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "2966cb0ce029927a67b8dd8232fdf4a5"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "7bf1f37aca7612a4b753e3d9f944d3f8"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "8a40214bf7a70b7ea8c7acf0a7fef4f4"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "a18b453f22bdc1ef22580095a92b4beb"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "9258e4600759030dedc2bce893368fa9"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "056aadb7d35cbdc3535e18136722ca6d"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "823645373e62f455d97f00bea506dc77"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "aca1292086144971243b6d6bc674a922"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "c0a727d3bc26574e02ede642d1643623"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "28e2183393bd74b7138e03377ef660f0"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "bf7b1aed6444110363e981696b5a3a6d"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "872c63938141d705dbcf1b19d60d2ad5"
  },
  {
    "url": "architecture/index.html",
    "revision": "ada67d81efa5655f3af193a9d1637f89"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "7d38e3e534fcabe1a892c029ff9ca528"
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
    "url": "assets/js/27.16afb931.js",
    "revision": "b4f6a9efd6083a6b00a8d5e191e7d19e"
  },
  {
    "url": "assets/js/28.79984ecc.js",
    "revision": "c3a9cc3955ae6affcdb38cc9f38384f3"
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
    "url": "assets/js/47.0c71973a.js",
    "revision": "cfca678ef24e15e0a13eeb61cd622716"
  },
  {
    "url": "assets/js/48.5b8858e9.js",
    "revision": "ceb3f36beaf7a7615ca759e998301f34"
  },
  {
    "url": "assets/js/49.7a5980f4.js",
    "revision": "ea0be526aaf41df654a3c6ef251032d3"
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
    "url": "assets/js/54.a010df32.js",
    "revision": "a2ebcc24da36f880d02c2c09a337c373"
  },
  {
    "url": "assets/js/55.73d32943.js",
    "revision": "f18a8fb22587779be4e6c81225db754e"
  },
  {
    "url": "assets/js/56.3ed01714.js",
    "revision": "0e994aec28686c874fd89ab32e80309e"
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
    "url": "assets/js/app.26ce369a.js",
    "revision": "9f96ab3b209f26ff79b51566c3d41a81"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "34b9b8c57e7efa96c71afb055a99068d"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "f889ae822fd765822021318c31defb07"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "269f71f2920a18046f0a6f52279162d4"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "ed4004d4322ae154944412e20194878d"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "a08939a285ffafe6e5cbdea3ddd70cbd"
  },
  {
    "url": "guides/index.html",
    "revision": "d49d7e8dab818d68a25e3491945689e9"
  },
  {
    "url": "index.html",
    "revision": "cc8df226ae35252ce2da9a9cea2cf810"
  },
  {
    "url": "tips.html",
    "revision": "a65a15f2d3e0b40610a58e2ae2676b99"
  },
  {
    "url": "tools/browsers.html",
    "revision": "73b95a5de1c175b414590d668e750cca"
  },
  {
    "url": "tools/cli.html",
    "revision": "28a715579bd6fc4e6097ec53bee2e6bd"
  },
  {
    "url": "tools/documentation.html",
    "revision": "d1bfba73137af489914dea3c663679be"
  },
  {
    "url": "tools/index.html",
    "revision": "0b59f003c3066bdc1fb971cb8c150676"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "99e1d36f0463765c08672fd31fa41493"
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
