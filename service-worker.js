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
    "revision": "34f6a55bc99282f6449d0038eb71552d"
  },
  {
    "url": "about/contact.html",
    "revision": "1effc145bed3c558cdaf4fcf25ddb100"
  },
  {
    "url": "about/contributing.html",
    "revision": "2d4f67ecbfd522f60f0d959528814534"
  },
  {
    "url": "about/index.html",
    "revision": "e9bd806e0372ea0da7fa7b4c6355ea07"
  },
  {
    "url": "about/license.html",
    "revision": "418830931fdca5bd30dc8387c16e1798"
  },
  {
    "url": "about/roadmap.html",
    "revision": "b59a443e7d8f8bdf85850e78d4e72d48"
  },
  {
    "url": "api/index.html",
    "revision": "fa7ee964e25e9579539dc84272b4f719"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "2df80dcf8767d1fe95ec3a5b420e7a23"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "edede366b903f279fdf4982f6f0aee70"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "aab7d55b656e86a8c72eae771d2e7f3b"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "9bdcee4e4b11179f3e6081967050aadd"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "fba558d67d1b41009e8795b3141f0213"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "ce98164a2c0a255b96e99290b3607dbf"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "202a3ce6488bb9d93c575b650fcf9d1c"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "beeb0493c44698e3d94860ed9ec65c1c"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "e48e9fec3c2acf34d66e2de28f87c61e"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "ca6361c5b21d45c298297bcbd868554e"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "e427683c9f279b3a02fffa429bbafefe"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "196c6a5be3713965d52de604749da01a"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "9c8803705a205504932b8464b88e9140"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "49d702e937a71274d592ff3f3bac8993"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "221ce04096ddf19d1a6773555571fd75"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "08472348352d4c8e0c5d52c1ce514c34"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "079eb2843906fe3eecfdf57f3d7a2b62"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "da970d8b481a494d259f8f9af4223ca2"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "3eca59756f429e195437d119b6211fd3"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "213b78bc4e55f48f49e3f0a5e7f0b526"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "56bd636e812a48763ae74c80c9c264a4"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "9eb203d0eaa88a4b5c59547cd1500edb"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "b3255b2f848db98cbe172288cf190ccb"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "d85939ff95b6bbcfa92cd9da5088cc8b"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "66d492726c0f04b8816edec5ca5997e5"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "d63c1f38baa1b379c55a87c3fbe4678e"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "6d7f238c79321801bafec786efeb1df8"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "4d381a5a4cfea5a5ff2cafed3cb8d2b6"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "239cd02975549faecf6b7bd4b122c874"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "0053e90dbe13fc92def2ff625c52d729"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "bf0efdb2e99c5df8259fd70fd67f40dc"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "1e1a3b96a2e118a15446d8186ccd9756"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "a65562b4a1d0d2008770c7783e601927"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "9429165f975563e02b556a779bab84e9"
  },
  {
    "url": "architecture/index.html",
    "revision": "adabdb1e48715117a417e99f8fd6301d"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "e4dba7e49a8eb28d3712347ad932fbc9"
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
    "url": "assets/js/app.edcd87b9.js",
    "revision": "cda10d15cf1e2f1b74a0dee9241fd493"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "3370d3a07c31d9688527dedec0c379c0"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "63c79b2360144ea516172ea2175529b9"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "a885bc705415c6d039307ecefb78bb67"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "cfa95a3ac780f762e896d7378237b446"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "9d73fa3813224f8864a63c7feb64adec"
  },
  {
    "url": "guides/index.html",
    "revision": "7ff4d60a93dc5ffc09940e2fed097dc7"
  },
  {
    "url": "index.html",
    "revision": "55be360bc677d895c125b18eccb6e737"
  },
  {
    "url": "tips.html",
    "revision": "fa210d0ab6a498e1b77674dc3c78255d"
  },
  {
    "url": "tools/browsers.html",
    "revision": "72f7723ad2125ab0d65057330ce459d9"
  },
  {
    "url": "tools/cli.html",
    "revision": "05c4f69da7a28281b114563ea999fce2"
  },
  {
    "url": "tools/documentation.html",
    "revision": "75c4edb09183b2c9eedfdfb86427eb14"
  },
  {
    "url": "tools/index.html",
    "revision": "4207ddc5bb8da68e7e957a8421931303"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "ad16b7858a9f393666955ccd2233c7a8"
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
