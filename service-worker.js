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
    "revision": "dfea815b3c5a39fed0a6b939f139160c"
  },
  {
    "url": "about/contact.html",
    "revision": "c244645f00599a42b2476599deb2ebfe"
  },
  {
    "url": "about/contributing.html",
    "revision": "fee957ead2f958cf238d174ac05ee771"
  },
  {
    "url": "about/index.html",
    "revision": "f378a6137e0a0c5d50ff6876f1c8c613"
  },
  {
    "url": "about/license.html",
    "revision": "551fec0c400a23dc2ec57ce550d79284"
  },
  {
    "url": "about/roadmap.html",
    "revision": "ebb682c402b177a21fc483c9eb7c12cc"
  },
  {
    "url": "api/index.html",
    "revision": "e5814e752985fbc1cf0334713a76f47d"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "d875399eb52490e46091d20c9b584da1"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "6ba3332cba2da0293878d0c62a382d83"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "ecf264bcbefc2c1615f389c4d8bbe437"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "cf1b379933947286f928e8129c10e415"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "f26ac2f3efd72a31eca3fe85b9abad49"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "7481d992acc5c78568e6906013562757"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "9a127bedb539e616ae086bf07ac006b3"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "b29e8fccc008b6039b2ed499be3c757a"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "07a05e0c92e1c54abc97c87d377f9d8f"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "8c65dfac788d743a937fe8a876dbd0b1"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "589145c4874117874768a609926b9cab"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "b904f6da6b522753058a21491b2ae7c3"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "eed921c41f309225fe4ef7374af9040c"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "2ff0d1bdc234dca3d19eabdc73b395b6"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "f6add5be6ce37db7dbf82342942015a1"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "a738536c1e3c3fb64549191f5bcb3d0d"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "518908c700522d2eeffa92050292d5fe"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "2c12f1041a74ff6726474d87dbb665f6"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "834749e2fab82ab5903ae8a329144c2f"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "18c2204f047130d57a7042e98dcddbe0"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "65f77be25c264c11f5964e6e4213f669"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "394c86949d0f73ebf504a45536587960"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "0622e7bcffafa9c1c2afb6b30b6e5dd4"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "dae36c5679f12e2cb32f3da4681f3825"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "a66f4d8790da96dedec2c43b8efdabd0"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "fd528690119442ecc58a3a18cfa6b7cd"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "44e1efcd34e21d573a04a27040afc307"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "86b18e3b200eb2c369d4615eea8e527e"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "467b9221da7b2d91e13a8d5a4b85958a"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "fd27ff87a3d0f3ed3ed9c9072b7dbb69"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "af94ed5d0bcff8fe00eac596e05120b3"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "f69b9a2e27592e85cc9f53b36c0cd0e4"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "2ff8eb03b406c0f1972ef212b44a1e01"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "1533fd13b71afee871f0112ac6b4c823"
  },
  {
    "url": "architecture/index.html",
    "revision": "32d6ff7568e70677ab4bf7ef3d1acfe6"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "afb2802692b75b40800daa6a73ea86ff"
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
    "url": "assets/js/26.8703900d.js",
    "revision": "0fff593c95ec09e538dfddfb68693658"
  },
  {
    "url": "assets/js/27.8237e82f.js",
    "revision": "11aea278383baef4669233d3b03516b3"
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
    "url": "assets/js/47.707c2ea7.js",
    "revision": "73529802e8a7982e47f6d6856e56dc3f"
  },
  {
    "url": "assets/js/48.3724f664.js",
    "revision": "20d078b90e046c017643553a9e31b362"
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
    "url": "assets/js/app.1ba21207.js",
    "revision": "820c48ee951b06a528f3f0ce760be219"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "ac6dcfc90bf39f953121319448d4a296"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "7b1e12bdfb8d93d911bbf8dfe1457184"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "ed1219d037345079ef9eabf28ebd5812"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "a8a99e40d1402149eb4d3b104d2eb084"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "95a1bdce585f7e14f93ed3c3af1f5bca"
  },
  {
    "url": "guides/index.html",
    "revision": "81a84078559951ca7a8a5970a6662521"
  },
  {
    "url": "index.html",
    "revision": "7ef2ee899a5631f9a39fdc50f5e36113"
  },
  {
    "url": "tips.html",
    "revision": "23201e08c8904b4373353297089b6eef"
  },
  {
    "url": "tools/browsers.html",
    "revision": "9c06aa323c994460c38a9b7abcf59b3d"
  },
  {
    "url": "tools/cli.html",
    "revision": "d61d3d563459ebfe9ebbe1c4c994317a"
  },
  {
    "url": "tools/documentation.html",
    "revision": "877e5e03f0d2049e3d32f75d283b6145"
  },
  {
    "url": "tools/index.html",
    "revision": "7b714376a3330d752d94d5dd0feaf936"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "dbe2209d7a7ea86a1a4f24a66b86f11e"
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
