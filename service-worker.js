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
    "revision": "59b93b7d5908a2e8339e294c671cc552"
  },
  {
    "url": "about/contact.html",
    "revision": "28e76a22ffb291fceb7b7342e9c3f1a4"
  },
  {
    "url": "about/contributing.html",
    "revision": "47f3e0ad49f4d7bd64e8a1877fc45763"
  },
  {
    "url": "about/index.html",
    "revision": "fa43f352da989794fcb1a82f1cb22fe6"
  },
  {
    "url": "about/license.html",
    "revision": "37c0210ec8973e65a2adebfd7fc7b385"
  },
  {
    "url": "about/roadmap.html",
    "revision": "48a98df919a907b3ba54dabc9f0caf4b"
  },
  {
    "url": "api/index.html",
    "revision": "122dca34509d1b2e55e0c3d6a732029b"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "5be94fd8d341a39b653aa5b1fd366d1b"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "569391fac68c15fc4b0d1cde10616ad8"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "edbd038fa5d44f2ced7b1b05099173c5"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "de9cadd6ad34f69cba9e5bb6bd12645b"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "e0c1bca545380342e3e27e0516bebc24"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "3d62070ebb5603eb63890ef0c5b11186"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "19fba8e80311b59d671b2af3963386fd"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "be2c39aaa6dca72a47a4916b179f3acb"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "baca9b281f91a47130d48f60b7450164"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "0ec8772f122d1a4b3b076db9fe68f619"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "3b7ce250d275ad88fe4b698303b77fb8"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "8b3df0723fc7ec12cf31cf79bbcb5a73"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "72363707e19768d5c0be14d463fafa7b"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "7a91f7a1ce9203f753f5c96615a218ef"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "3fec39b11660d6809122ab596713281b"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "2aa05b60e79e1ff23b657c0734c35f38"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "ad15bffc8da4dfe74eb4c60d1b15cd98"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "69f7f8fc57791aff2d8156815cfa62cc"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "e2ac370711aa7d40bcf32a94f9fe49a1"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "09dd22153992886dd5fdabca6beba609"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "331374e85dc3ea9d5ae5a5e2fe728cac"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "60575fe5712b5809fbbab0527ef7b15a"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "18e3e8e080c7e9d67f89c6e708b53825"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "31d68e15d28bb1046e04457d272bd99b"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "70a1b9979b2e6a25ddf499bc5bd2e9c0"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "5deac6a52bdb9a7a9428e5b1a7197165"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "149e461a0d52b514e4182510a16cbb74"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "ebf6f3d89e94f5b2110e71c3e7b1491d"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "0ca7513c8169d347e3c3b8f2b5d2c255"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "388c9cdca9e015dce3c7f7a8b91c7927"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "ed3bc04697ccb7e8bae8603fe82a8a8e"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "1dc1a4ff1f9708a4e437531423e900c5"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "32f0a52c6b40c1e69446d77da689cd89"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "319093a77f6b93609f9bcd43aba71b86"
  },
  {
    "url": "architecture/index.html",
    "revision": "69fd25cdf77a5c24f19804800360499f"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "b2685e2195968393e07403f22f83f7b1"
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
    "url": "assets/js/12.58e9ffa7.js",
    "revision": "206a34066e67b16d4dff229ea0fa59ff"
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
    "url": "assets/js/18.351df8e2.js",
    "revision": "8db7fd423457b21f965a8c31300dd0bf"
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
    "url": "assets/js/31.7a3ca012.js",
    "revision": "5bf5a06c5da37a9e26fdb7534b1576a0"
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
    "url": "assets/js/46.a988f716.js",
    "revision": "12c73c9608c4da2781ddba0b291af5e6"
  },
  {
    "url": "assets/js/47.f38613f1.js",
    "revision": "f110adcf1cccbd8169c6fae8a55d9ad5"
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
    "url": "assets/js/56.dfa390f0.js",
    "revision": "268bec73c0e1ea9d3efd8052458fc13f"
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
    "url": "assets/js/app.3a98138c.js",
    "revision": "b97280baa2c7168341593c8f37f929b2"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "28e4dabdad11c334975cd252455858a1"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "bef2c269d0e0b7b2fb4832b50ddb31a3"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "0395f8c78a91ed04f4b79b51c40fc437"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "d88dc6bbd302140182a328e3a4818f6a"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "8b474bb973ad398ce57bbad9f6f8165f"
  },
  {
    "url": "guides/index.html",
    "revision": "645727f645e97189a8f6cb68f5bcff96"
  },
  {
    "url": "index.html",
    "revision": "672bf1d00f37b223e7dd0e90dec95abc"
  },
  {
    "url": "tips.html",
    "revision": "f672668362a08755cff0d5c5d2763160"
  },
  {
    "url": "tools/browsers.html",
    "revision": "d6b7778e3d13b143fd19994ea517c59c"
  },
  {
    "url": "tools/cli.html",
    "revision": "929313b021225b4ccdda5b67a545ee7a"
  },
  {
    "url": "tools/documentation.html",
    "revision": "465e21dde951893e9c5b6463a5b5a5b0"
  },
  {
    "url": "tools/index.html",
    "revision": "965d497aad47167e6aa334c21db154b0"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "26c100c1ecec473f9c4eb711c377fb1e"
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
