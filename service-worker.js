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
    "revision": "a1a520771b31df3eca237a22e2571043"
  },
  {
    "url": "about/contact.html",
    "revision": "62179a2a7047dbdf486293017be786e0"
  },
  {
    "url": "about/contributing.html",
    "revision": "255745727e1b6e17d0feae4e768ace8f"
  },
  {
    "url": "about/index.html",
    "revision": "7d9142a6b93549b27537510a6ff5d9a2"
  },
  {
    "url": "about/license.html",
    "revision": "2f0aad2cf0ac1165e2207ca3326c351f"
  },
  {
    "url": "about/roadmap.html",
    "revision": "774897b3b3608099ffd0777a6407071c"
  },
  {
    "url": "api/index.html",
    "revision": "6a7ca3898d684afb65baf568542dbcb0"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "e2c668a71d43b7325ddb1216a148dbcd"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "642f96dcc147800ac8194dd1a139b10c"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "b62d8295a270cdbd0c51a524c2897b18"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "287154127271a401c8628fef177f82ab"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "3ceca90f76f7398b9028b04c92a3f3dd"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "79c1e176c6e08a5d3c2f0d18d4bdc64b"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "08b13f40c2322978bf06a24654212bd6"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "573645d607d3f3e450c0297d4a6d7b59"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "216b069b33f6823736dd970830c52aef"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "4a5db83ce439377b0a612dd261c246ad"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "3cf45409b7d06c477e19b59f529ebea1"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "a20914361052e0a65501a6bf90c908f0"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "3e5d804a2264580a86533c4681250288"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "5ca6a824e854f3a9e03131975a51a439"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "cbeacec64a3ebe95b39bc95ea6e29f18"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "49818fb45c92c8d47d4979e4a4420728"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "28f9956e3f23df2ef44677e6018f197c"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "5a9c8cfbd5006763cf3ba5cd5a74e2b0"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "ab4257e34f7f72ef19a0a1536d3c0277"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "a492d738703060c3ff9a92b439e144b3"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "57c0146f8bb252f6d191a11cb166fcd4"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "270e18f82792373a63bc2133d58b7417"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "ee55f27c6441a71d73a555c5e881755a"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "87cba313ecf8c90f815968b3b94bc1dc"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "87b5e3bb0f87880b73c57de3108c964a"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "efacd8ed6a87db8717942c63416dbad7"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "5bc064a1b23d65a2b726bf5fc8a4efb5"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "d2fd019c7b9740a446affc2ea9342770"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "4bf089b914b40a485109fe0c6deb1ead"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "c6dcdd99abd7e567064ac0379ef4372d"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "86400f9f7d7068b73e8fcda4ff39c734"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "1cd1fbe51324e03ee55ddc6110d85589"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "b98289298c220916b4ceeb7edc598c86"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "185a3486463a7b7db0c9921eba66dd38"
  },
  {
    "url": "architecture/index.html",
    "revision": "1b5f1e02289381948f1fc6017d2551b7"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "0c19ae45ff091f3604f643518d9f7202"
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
    "url": "assets/js/54.a0534692.js",
    "revision": "6c153349cc55745d455a161faf496eb5"
  },
  {
    "url": "assets/js/55.73d32943.js",
    "revision": "f18a8fb22587779be4e6c81225db754e"
  },
  {
    "url": "assets/js/56.f7f3db84.js",
    "revision": "648e21f9740f264c9af2d57e9f3fb8f2"
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
    "url": "assets/js/59.fc7e5e23.js",
    "revision": "c2e90b144138f077f462243b598593d1"
  },
  {
    "url": "assets/js/6.25ec3b52.js",
    "revision": "3d32520bfbe3d343abbaede6bfbd111d"
  },
  {
    "url": "assets/js/60.4c5a1407.js",
    "revision": "999f01f0964dcf21303793d7173875ba"
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
    "url": "assets/js/app.48bc336f.js",
    "revision": "7da419a1ce1704bb3ce31902fad069eb"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "ad46f0b1569965b74137055fd538869a"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "ae8efa8f7945fea8ee5937dd86cf4443"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "774971bf452e699531fa72b3b6f52abf"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "8846fadf020739ec80ac3c47c66ea51f"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "5e188fbc9ababce3f907b85f4598022c"
  },
  {
    "url": "guides/index.html",
    "revision": "7db00da75369aa730ecabda555574fd9"
  },
  {
    "url": "index.html",
    "revision": "abfea729fcd21028767ff88d686ada10"
  },
  {
    "url": "tips.html",
    "revision": "868956a9efe5a5ce55e66373b7bffb0f"
  },
  {
    "url": "tools/browsers.html",
    "revision": "11ac65469a7112deea487c9625728800"
  },
  {
    "url": "tools/cli.html",
    "revision": "af3017d3a1eaba4e1b40810bebe9dcfb"
  },
  {
    "url": "tools/documentation.html",
    "revision": "998212b4c89987b902b90c3b0959e8f6"
  },
  {
    "url": "tools/index.html",
    "revision": "c7dd52074f00b6b206b2704f27563483"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "84dcfa1476abb2a8ac4d2c9d33ec75e6"
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
