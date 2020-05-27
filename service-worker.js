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
    "revision": "7d564445c4d1b81e51cd035c24138fb9"
  },
  {
    "url": "about/contact.html",
    "revision": "528a7e70ed0a85747b356b003de49d9a"
  },
  {
    "url": "about/contributing.html",
    "revision": "911dbff3a17317c60baa0ed6cb0b467a"
  },
  {
    "url": "about/index.html",
    "revision": "09889cbcd2738e08d6d3e11977365d27"
  },
  {
    "url": "about/license.html",
    "revision": "3e0e99ef795e8271ad58b956c6ba884e"
  },
  {
    "url": "about/roadmap.html",
    "revision": "8fbcaf0785310e0294acd8539ed95247"
  },
  {
    "url": "api/index.html",
    "revision": "9b80bf72ab08d5f456f0518887384c48"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "10f7a560a2d43a1cf69371906b6402d3"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "35b0f99ede465ff302665207890f0cfb"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "6fc15b5a2706c2d3ef2443324e0d6b85"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "e46590d6f75f3c783b93b6683171d2ef"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "195a4d886edcea8d7fd8612f1f569500"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "3d99c1df6ce396371a6f4f21d1646c6a"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "1dcd3ad79ea656136d2f9613368092d6"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "c22e2b93f772cc445b1b6dab28434433"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "12fc2dc7c3496b43390d9e7cd8451896"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "fd3a87cb692d9ee4cd86f42925d7501b"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "f95afdbce9123f959c890e3ad83c72fe"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "d71ffb97ba920d13db3684fe006e8c93"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "c469308533df4de4b3dbad5d2d6aac8c"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "646365ae11f6e55b9536b6b51a3a5618"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "b08017ac4bdd41541750c1c9cdb65320"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "bfe5e58c5bbce87fe34d2c6919ee98cb"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "46f27d453e7f8ecc52886ac45e9cc1f2"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "2a54e2b0911af1c0020687b67319c69f"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "61953fbe6aee1b1a39b3d563a67e7b27"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "026ec62b000be011b65239fed144486d"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "4f4a004330e2afe1291bd2137d9e44e9"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "3a1a4c7a84b336e233fedd31b47bae91"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "6c808b5edb29e71f2a331b8d39d9d42e"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "c02931192072fa8c4cf5ca3a44b56ffb"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "782f4f1ea4cbfb8a34e29ae962143770"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "c355f22c769caf3383df824b72828133"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "861e7a1eb750ed29c94ecd2f05d7fcd7"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "edd7d06c7509976f8e679453fe2f1637"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "5fbce4ab4a069314ac5f5efacd85413f"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "6225811e00420cedb35c6a740fc22b0f"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "b5f3da8cc436a6f5767ea7cc045bbbf8"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "2c4069cc4ebe80b15332ef7da5624b00"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "ab5e827c3fea491f3f1bbeca57b9e464"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "d7e6f7744bc155f971f187cb64ab7c32"
  },
  {
    "url": "architecture/index.html",
    "revision": "4893124d34c32ef33b3e6e4373c656fd"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "0d5dadd8db4b2f76b1fa34f06ab11d1b"
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
    "url": "assets/js/29.47a5b60c.js",
    "revision": "2828c48d49903402df3bc89ece4a7228"
  },
  {
    "url": "assets/js/3.3355429d.js",
    "revision": "3a776af63e5f78b2fa731032c1820364"
  },
  {
    "url": "assets/js/30.46c5eea8.js",
    "revision": "03618045de0fbb4433b58cd596f123a2"
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
    "url": "assets/js/app.b52c1284.js",
    "revision": "fbe021fe1c40bfd660e334f004c250d2"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "d2c0a7f47910ef10029a200810e99e88"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "7c55c4e917cabe818b298402ea12a96a"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "85388d2473f2963905e4ba190a21ab5c"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "1e1780cc3c2c4b0e4a5c4027e009603f"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "f01dc371ce7a55dd702f783f403b5646"
  },
  {
    "url": "guides/index.html",
    "revision": "3791b31393898ebdd2d69890a5528210"
  },
  {
    "url": "index.html",
    "revision": "91b417cb9a77f419312de5a84713c040"
  },
  {
    "url": "tips.html",
    "revision": "41b9954b0584dacc9d9842f846aca3aa"
  },
  {
    "url": "tools/browsers.html",
    "revision": "51efc1eeafbf0e4a6f88a7cf63e14895"
  },
  {
    "url": "tools/cli.html",
    "revision": "92dade65f4f0d53bdfa0c9216538909a"
  },
  {
    "url": "tools/documentation.html",
    "revision": "63ccf2bc5e30083a186b362cfbdb50c4"
  },
  {
    "url": "tools/index.html",
    "revision": "2b5da84765a68434fa8621a12d19176a"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "677aa046d4f97f380865069907af9a8e"
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
