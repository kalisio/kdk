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
    "revision": "b287826af82b469b21bb988bf5d4034b"
  },
  {
    "url": "about/contact.html",
    "revision": "99bdcb05854d8436080b7308a379757e"
  },
  {
    "url": "about/contributing.html",
    "revision": "d4c331846487f3ea5d3c43b5e89257d6"
  },
  {
    "url": "about/index.html",
    "revision": "df7d4f580920f717f2555b287aa6619f"
  },
  {
    "url": "about/license.html",
    "revision": "6b1249b0a34d6ca9b1470fa0d779622e"
  },
  {
    "url": "about/roadmap.html",
    "revision": "f725d04faa67f3bbcdff54a02043f608"
  },
  {
    "url": "api/index.html",
    "revision": "638bcf45ddd1d02921ae5b2fa83b8c8a"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "9dca0005802185a0515504efa459657b"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "a833fa474e68fe6b52ab0337e5d019f4"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "f380c0145357470fb8f7ec0ef52688f0"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "57c3eac3a3f3516b6bc2fbdcc238ffb9"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "a9bea700748f406dc4f3fc76fb2696a2"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "feda9e4c777736b313678fee6184a101"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "142b3d498487cf294c65144074aeaaa8"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "76b1180ca1fc2f9591bf33731d193e6f"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "d17cfcaaada7e752722bf1f3818bcb6c"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "11442e2aab9a9b122935eddbe9295bd7"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "cff60b1c29b564b314aeec3825416ee7"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "7bdb0bc98601bb2725e64a2d73ca20da"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "55891746a2adba5a9e582e5ade9ef95b"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "fd9802bac555f2bf7112acf0e9c8c721"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "e423549e91292e9684049c8f636e467a"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "beab2ffc19872578ba79dcdfea1e42b5"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "9fdb757099a9021648a1f485180bfc73"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "2c282d4239d7a61cb81174d4f71fd33c"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "67c8fd5f3f920ba56361096dd77b7200"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "efa6c8ba05e78824908eea7c11b5c59a"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "24153360e0870ce431acefc8c303e4d7"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "ba4ddafdbe64d0f0fdd6bb039359f06e"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "846c20f2b81a67e9e83d84e1ffc13173"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "7f9c071e1677345e20bd3c031baf3a8e"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "190a073c36490c58ef500cb5af12d871"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "22ae3b71324ef985a2bc9e2a5811ecc6"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "a6d0d80211cdf9ddef143a3b9bbddb8c"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "c2e39404c822f62c830b4033f50ea92a"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "b098402b62e5de4e8cedeed69588c32e"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "54f64518bf1a274aed89e7d6c32d277c"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "382ff75d4836c51c14ff122192565376"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "fe1f2bef1cd7d66e98ec97ee560a490d"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "4b0f6cab0db4805ed66f185108d54c50"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "8c598dabfa80ee8bd6ccdc93b995c54b"
  },
  {
    "url": "architecture/index.html",
    "revision": "166fc0c8360b4efeea6cc5bda263d6c5"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "3160e80c6da7d53a00b4d869ab7e2c35"
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
    "url": "assets/js/16.257df35a.js",
    "revision": "1c7766b2e0c28f21c36309d252fb77ae"
  },
  {
    "url": "assets/js/17.71dab417.js",
    "revision": "5b0347e6be70b2387082b3d85877b69a"
  },
  {
    "url": "assets/js/18.c130f3a3.js",
    "revision": "a8a060a9d7ec3f36c2be719173ca9e3a"
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
    "url": "assets/js/21.32f22864.js",
    "revision": "5e14fbd63bc234c25511704b7e93e520"
  },
  {
    "url": "assets/js/22.97e1088a.js",
    "revision": "9145c4e7f754467a2019f4b7466433ea"
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
    "url": "assets/js/33.19cbfbdd.js",
    "revision": "59340c7229380d9d5d2faa542c162789"
  },
  {
    "url": "assets/js/34.f47a217a.js",
    "revision": "a8c4514121226fc615f2659d9abeb157"
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
    "url": "assets/js/4.26efbbb5.js",
    "revision": "54014b3979b111f199bf6e8ea8704cf1"
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
    "url": "assets/js/51.c6d64a87.js",
    "revision": "daccb0905f3f8ee5fd9faa936bf388b4"
  },
  {
    "url": "assets/js/52.2a1ef113.js",
    "revision": "56aec456f3e9fc31926bdfd17d47ad97"
  },
  {
    "url": "assets/js/53.6c0cc7f0.js",
    "revision": "6480fc5c50456df4962d19fe714620ea"
  },
  {
    "url": "assets/js/54.a010df32.js",
    "revision": "a2ebcc24da36f880d02c2c09a337c373"
  },
  {
    "url": "assets/js/55.7c825fe6.js",
    "revision": "3b3d64752b199ae88c32ce8f0160bb1f"
  },
  {
    "url": "assets/js/56.3ed01714.js",
    "revision": "0e994aec28686c874fd89ab32e80309e"
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
    "url": "assets/js/6.38e32613.js",
    "revision": "2d72e6b6bce0ac50ff94ec10fb2d82bd"
  },
  {
    "url": "assets/js/60.091bbf83.js",
    "revision": "f74e0b9edb4d491d7acc9a48722949bc"
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
    "url": "assets/js/app.b9c79671.js",
    "revision": "5a07fa8518340cff19f404554c948447"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "58d76218e187081fc68763e8a4dd879b"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "675b81b2272785c808687f56fce0461b"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "302e7d411aa97fbe79f56ac78d1dd0ae"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "587da0a22f6a84d782bcb14647d2690f"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "60b28dbf8a82839a004d9f9f4f68ff7f"
  },
  {
    "url": "guides/index.html",
    "revision": "2304846c1991a7121051b642e3454670"
  },
  {
    "url": "index.html",
    "revision": "1b9a452ae72fca327e9fdaabb1b1fcad"
  },
  {
    "url": "tips.html",
    "revision": "624e754154f1f72fc80c7d72384a0261"
  },
  {
    "url": "tools/browsers.html",
    "revision": "8a02b086b1de686ee32a338e04463c38"
  },
  {
    "url": "tools/cli.html",
    "revision": "6a4f920cd2f27df95ecd44aad2b2799b"
  },
  {
    "url": "tools/documentation.html",
    "revision": "e2002e5802e50ad1c20ce663fee160f3"
  },
  {
    "url": "tools/index.html",
    "revision": "e2a7ce4706bd99c6cc5816d92318d0ae"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "a698cf9949bb206f3a45ddeabe9e318a"
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
