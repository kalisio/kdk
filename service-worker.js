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
    "revision": "3acfdf5b5f9940993d84252f39d26431"
  },
  {
    "url": "about/contact.html",
    "revision": "bc2de5a5cb731752ca2ba65ada40c57f"
  },
  {
    "url": "about/contributing.html",
    "revision": "b43460a284cbe2be3ff771d940427298"
  },
  {
    "url": "about/index.html",
    "revision": "a072851ea5b892512663c0947fc7c57c"
  },
  {
    "url": "about/license.html",
    "revision": "7e4da0f3a845fa8669b36c6fd53d6540"
  },
  {
    "url": "about/roadmap.html",
    "revision": "dc0ef0fd40c5a1ea448a18dd624d3c14"
  },
  {
    "url": "api/index.html",
    "revision": "4acb0ae6750a4f6723d20eb4f17f7032"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "50240a8809d019394ffc7c121c8df9c4"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "713b8b94de0a282b3b72569689e23721"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "d41ffce385f9d6284fbf6cbf60371207"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "45da2b1b5aba5684f400823eb572ff90"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "9455dbf8339c755caadf2b746e1d7fa9"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "c1d05ae3a079db49e44b71060758622e"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "df34a11a1b71619c6a1368a54f300ce7"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "bf76a67885677dd1c6df2ea7b35a614c"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "45e3b640b2c89fb0c1a71e9fcb897a5a"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "14a0003d78d35d6b2514d94993da6de5"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "d3e266e21fe6d6bca756d75e6d6b935e"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "1d456bf8457235fe8846ca670538155f"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "b82c0c4547e993c6eaeb4aeb71fbb9d2"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "8b7feedb3aa5a8d4408d7abfb46cac81"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "d5d0f796c9f4519e65e501920416d0b1"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "d8e1da5e8f025a260477381aaaf93513"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "afad2ef1eeebdf921d999ec6a9a1c3d8"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "8e510ae739c96f0999f4ceda9b3c4776"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "5fbec4e626754345053c496d1eb90f35"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "c78c9466157dd7a7a8743f68e8617019"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "3dadbf3d1a15f0656994063a67e591cb"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "df40c98c6260e61e29942779d437f464"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "c50a8bcf4c4ddeaef5b7ebddc67ff440"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "c4b330e5547a12c6ce4757559821bf08"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "96d5265f7f2ed2cdd27e641b82e0bf76"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "efbe7896ed4a68595a2b394cfdcdd322"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "f8d56819ad0eab923b9a00f3f1770330"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "ee6ca8c42f6144b75025315ee10ee26a"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "9020908530a05bf3782192d267ec4a88"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "2cbf2a40470c991464bd86f43181cd26"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "3e0fe3d26a216375daa32d0dc427a0dd"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "84c9a9b9b9c443416ffd8ef734039f86"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "9ccddb471db06423f8e42424ff640386"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "598b3a99e5ace229c6b6323b0433893f"
  },
  {
    "url": "architecture/index.html",
    "revision": "7800ff0e06c6c2f0b6122e07029441d2"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "27c3c4b41a7ff442715ec5c6926aab24"
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
    "url": "assets/js/36.a731998e.js",
    "revision": "f3c6cc4e3cb27e9803065610d13716f3"
  },
  {
    "url": "assets/js/37.7cf34f48.js",
    "revision": "a4cdc37ff4aa4fbe07c0b9d734477c5b"
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
    "url": "assets/js/54.a010df32.js",
    "revision": "a2ebcc24da36f880d02c2c09a337c373"
  },
  {
    "url": "assets/js/55.69806b1d.js",
    "revision": "8b7ff4e219beac1751aed538f363a574"
  },
  {
    "url": "assets/js/56.1932e4a2.js",
    "revision": "31c3ecc8790c13e45f61905d297272fa"
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
    "url": "assets/js/app.e3ba0e27.js",
    "revision": "88f9e5647acacba62949f2a52bca7a09"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "cd663299aead6bdac400d14d7dc76033"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "fd1bf028149aa538024dbb300cd195b6"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "a5489711205d83690f09592b0b42f054"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "9456890ce9ed6e2aad427d87c2b0f57b"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "da437c6128d076ff3a95f13f5074d5d6"
  },
  {
    "url": "guides/index.html",
    "revision": "45a0b6d92fee03b3309a3fbcdc79d440"
  },
  {
    "url": "index.html",
    "revision": "f2f1167be0158109ee8ca3be75b93067"
  },
  {
    "url": "tips.html",
    "revision": "002d1e38eafd0fd7ac5333014ba2217d"
  },
  {
    "url": "tools/browsers.html",
    "revision": "5dfac125635e73b93f47c83c64139085"
  },
  {
    "url": "tools/cli.html",
    "revision": "591f232fc733db1932ecd2aebf143460"
  },
  {
    "url": "tools/documentation.html",
    "revision": "81ef7d5f59141e61b34404c33ef477f2"
  },
  {
    "url": "tools/index.html",
    "revision": "087bfda496e1ace2c094bec068266c1e"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "e6a587d630aab8d50db1c534f3bdb410"
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
