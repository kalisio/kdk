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
    "revision": "2ba910275f1e4b84594a47fa01227a02"
  },
  {
    "url": "about/contact.html",
    "revision": "38beb1ba68f8a7a4e2daf9edd090a655"
  },
  {
    "url": "about/contributing.html",
    "revision": "7b60154465f9af78b106a5e9f2ddb227"
  },
  {
    "url": "about/index.html",
    "revision": "02e3a91649dc00edac5b6faf2e53cf9c"
  },
  {
    "url": "about/license.html",
    "revision": "6d7e82c9673abb4d3284bb05ed0eade2"
  },
  {
    "url": "about/roadmap.html",
    "revision": "5bf5abcb575cf0abb02f6786835eccb6"
  },
  {
    "url": "api/index.html",
    "revision": "9374140f526c0587e846e5dc3efe7f7d"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "2120938080466868d52518a4d5c61110"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "d5454238b02092d8058c81263caac1b6"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "d980f87ed17f744248f29f961357a79e"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "e51dd82f493eb7f4edd147018820872e"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "6995080f7c873a194e6d3d7fca4601f5"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "21c0d04fdb18acdbc186007c5e8172f4"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "0df12951776e6528237cdee3e4b0ed5e"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "b4847f6f283f628e646aba02a56128d9"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "aa8c899b15cf5e5bcd29dbbe9ddc3505"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "ae8c38402df89f7558939d4321224b61"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "08a20d4abfed31556b9a3794632b8214"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "496639b7435e3d158d375f003d1358c3"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "90bac2be29e27098514ae9f90ae507b0"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "af56df03ff14038dbd64aa0a8d146e86"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "92967097fb2eb95d8aff54074d6c49ae"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "cf5cab1992a3b1911733e507d142a6ce"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "f5b66dd7957d868622193bf3a6e932e7"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "2352fa8f8c1fecb726781e769d3db51f"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "7cfb1257505f452138a9576a9fd707ad"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "df3a35983b4e4bafc5382a18e5dd9376"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "d26f2d87b04551a0b91c994a069cb2a1"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "1309879b6bf16a7fd8711cae0f82b758"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "e2f45acd21822f1d2e7326d1094455c1"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "885edad9f8501d3920bbbcd2ebcc6492"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "fcd0babb54996fc4116860bb80b55dae"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "42a24f6e63f4a34db88e2981ea9ec00b"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "6245c1ecc071bda966515fdff74657f7"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "2c0710a64ca02808dbe58dc7ea3ae4bd"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "5bc2d1b4da0848cbd621a83631484a68"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "8c862e0ceca1ea1d7600e348ef308332"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "b32292c622beb319cd4b050e746e72ca"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "12f04148d16f454c5cf437c2fe14a374"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "2f5cf3d19ce106f87b411c89e81a5909"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "dc432e31ea91084ad508cefd430fbfc1"
  },
  {
    "url": "architecture/index.html",
    "revision": "0e6ee759b13df5192cc05c07a32ed877"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "cde748345e0d5660646ff4a27332c0ac"
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
    "url": "assets/js/15.fd61017d.js",
    "revision": "dd112f62b97bf8e5e0fbb534455fc648"
  },
  {
    "url": "assets/js/16.910eb7ec.js",
    "revision": "bfa63706387026aaccbff7e20c843739"
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
    "url": "assets/js/39.e7820f47.js",
    "revision": "8345cb2924e105a989911b372e6e9a43"
  },
  {
    "url": "assets/js/4.e2f1ab2f.js",
    "revision": "67ab3f04991ba8a2af4bc7c8bfb78c65"
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
    "url": "assets/js/53.a8978ed8.js",
    "revision": "3d2d67519bef49bb87aab028704b1de2"
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
    "url": "assets/js/56.e228d96b.js",
    "revision": "c2681f29ad9708d21c424218fedfc6a5"
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
    "url": "assets/js/app.ef49193d.js",
    "revision": "b919c24cd7e8195bae633e590fe24705"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "bc46c1fb2ec6b6269bc5124906c55353"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "2772a4736cc19c5cb5108b78840842b0"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "377a349f9dd73bdd874a968b84cceb69"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "0418b4fb2dcd6641c4deee9881fd43b6"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "846064f660a124e729b89e9f1b03e734"
  },
  {
    "url": "guides/index.html",
    "revision": "e2bd1fd2726b02d10cca19c795b8c69c"
  },
  {
    "url": "index.html",
    "revision": "addd7a15a99f0059e91a04c7ba40c146"
  },
  {
    "url": "tips.html",
    "revision": "8615c9e2e9bee4d2c96cc0191f67f6ea"
  },
  {
    "url": "tools/browsers.html",
    "revision": "80e8e68be97200504ab3c7565baf0baf"
  },
  {
    "url": "tools/cli.html",
    "revision": "f64ff6c0a6021dd947f0f019908dc57d"
  },
  {
    "url": "tools/documentation.html",
    "revision": "91657cda4bce4c447952498e071be318"
  },
  {
    "url": "tools/index.html",
    "revision": "3e7e6517b682b405784e44cde0834854"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "c8b84cd9826ef7a12e011400d6fc216c"
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
