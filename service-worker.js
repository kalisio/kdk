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
    "revision": "2b5f81ea9b4a05b47e4d4d461610561f"
  },
  {
    "url": "about/contact.html",
    "revision": "9e0a08751f97b388f40df6aeb13d6fd7"
  },
  {
    "url": "about/contributing.html",
    "revision": "0cbeea2f414725afabcebb21a86fc4c2"
  },
  {
    "url": "about/index.html",
    "revision": "def9832862ececfadb1bb11164a7f418"
  },
  {
    "url": "about/license.html",
    "revision": "7617f2c24c6f9cf818e5024a20e1cfb3"
  },
  {
    "url": "about/roadmap.html",
    "revision": "015329f05bfb2c9a0d07b7575899dd30"
  },
  {
    "url": "api/index.html",
    "revision": "e731908b524544a6c46ce5ed57465218"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "2428d56770ef68bed4c4cded70a1539d"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "52529c205033c31de0fa8898e9caaa72"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "f7218be8e2c26a8ae5c85798eb2c4cee"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "4306c6c76d67acf7ab54f859f24210a9"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "2875368458e03f58bad5f88384319fcc"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "55f3434fb2d6fe324ddde57421cc79b7"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "7b5b1874d3a3953e8ffbe563c7558a25"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "e5796e73d9d326ed1a35b3a2fbe80439"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "71692bb43f9afa79be0bdb309bec38b4"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "43b89cbb12e2ac9b6c9445bde231834e"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "e046e453659d4642838efac1bc523686"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "e1f240b38b316f0aca100c083dd0cfa3"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "a4e974dc8e8f2b25ade0ea65304ca696"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "f6a400712e42152993544b201e66f9cb"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "0c68a87cfc473d74d6f1d68a3d22291a"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "ef418c4b22161dc753e265877725583a"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "8030fb110fd83a891f33398baae6f838"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "8aabb3a5797548913a5e32f4bfa1907a"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "9ba24b848f720225bed67f82a06ba7c7"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "c2e0f3eca7d5e6d38690a9dc483c07fe"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "2dfb74009e7d2236ce12d6ac5e3ce47a"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "e33b3b7a6966d6afd7d8b986a437a645"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "583348f876b734ed8ea2ba0802f1cde2"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "5ee3fa1ccbc2b097abe7f621a02b5068"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "f656dce726da9c5c55ef0545d73a08af"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "f6d76768469447e69fda40fb5c129d2c"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "248830b95580914dca96c350c8197a98"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "908cea33ba6bbb3e7db27fc0c1aa070f"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "23a6aff306f1cf84a8045bf1de7f71d9"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "8057f2a83ba7c560b689e3f1c55c9fae"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "c939f2d2d5f241f7488b9cd53a4c30a7"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "dc086e6408c79637daddd3fce61bccdc"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "078e824a614052764854815067361c11"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "16da99bd419ed7c48e97be8ca71d7e49"
  },
  {
    "url": "architecture/index.html",
    "revision": "c11bbced955bce1ef4e65099eba917e7"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "16b83e55a8cdcf8ba9e4213c9332513b"
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
    "url": "assets/js/51.2583c975.js",
    "revision": "a8bd580989005cbf7b5f97f8d637fa89"
  },
  {
    "url": "assets/js/52.e8db8feb.js",
    "revision": "25418dafd9e56cd11c812df86d202355"
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
    "url": "assets/js/56.eaf76464.js",
    "revision": "b2cc6a222b077c0d419e8afb327744a2"
  },
  {
    "url": "assets/js/57.feeb316f.js",
    "revision": "9e555603d4162742f6c0f2005eb082d4"
  },
  {
    "url": "assets/js/58.12241b96.js",
    "revision": "2b266a9357c0082cdb2a055300a572c6"
  },
  {
    "url": "assets/js/59.d24162c9.js",
    "revision": "fa71b8a06441c0983975d14334a96167"
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
    "url": "assets/js/app.b755a320.js",
    "revision": "026a124947fa695d1a0c396a017ed280"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "3fcc6bb02e162a23e3d61bb3a1303829"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "4a311a24e9cde784617016f4655349a0"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "f441f0397ef558c22924d6f67db68a4d"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "1ce668f6895733eb8f695e24755ebacd"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "d42d4ae520fef74a4b62f5b767003083"
  },
  {
    "url": "guides/index.html",
    "revision": "72377d6228c0153d57abb9661b32bf14"
  },
  {
    "url": "index.html",
    "revision": "c5e4587b5de1acaf6472f371cdd902f6"
  },
  {
    "url": "tips.html",
    "revision": "9b9b1f1adad263f76191bc951767b337"
  },
  {
    "url": "tools/browsers.html",
    "revision": "bf126c1d6cbd73107454a371af06a16e"
  },
  {
    "url": "tools/cli.html",
    "revision": "d8a241e2cd8ca907c29d8682589fa080"
  },
  {
    "url": "tools/documentation.html",
    "revision": "c808556616a387cc0d395167a004d0e9"
  },
  {
    "url": "tools/index.html",
    "revision": "05fd49f6f21956cb3c9dac769ed76c83"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "0333fa704e1f58481d834fe8f2be5ac3"
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
