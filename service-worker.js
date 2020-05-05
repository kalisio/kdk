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
    "revision": "cb98ae835e57f4fc458f66b46c732e63"
  },
  {
    "url": "about/contact.html",
    "revision": "5685d626e6485b0f2002dc729479d337"
  },
  {
    "url": "about/contributing.html",
    "revision": "42ddb2a1fd0b4939a77af1dda396ff12"
  },
  {
    "url": "about/index.html",
    "revision": "a5fac298e5c8049436733b69d668e055"
  },
  {
    "url": "about/license.html",
    "revision": "49f2cb953e62774e7b6f98aad195b795"
  },
  {
    "url": "about/roadmap.html",
    "revision": "c8f118575fb1b1c2b4a2146f540bbf93"
  },
  {
    "url": "api/index.html",
    "revision": "8dcc5fa340bf382ea9a52ed587bb4883"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "be6600ac3e9026ba56b737573958a22e"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "5b8dbe3b72dfaa3d4c4c174cb9b82ab9"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "3aa720b493e7187cab98e768c75a25af"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "3eb0f1608f269f13cd5538ffdbdf861f"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "e190bd1184f21a0a66b4278d6c272ad7"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "b50697f54ceb86a3682595e11b432c7c"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "0722811c131e239fcf7b78cf2e3f06c4"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "6c45c554a6c8a1b647b1718e02f3e49c"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "4ea3df0af017d79e5a9d4d4b2efa73c6"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "96a965b19600989646529ba05f1c324f"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "b213752a94dff7facf6e9b04102ec2cd"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "ce33436784445bc0cf7b4b78249c3776"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "0571ebb593c8d7302e589a33302d3949"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "b79447b752cd68384854484489fa16f1"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "cd92ac647c6b8a4c7eefe9ba23620f34"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "d3592625f07e48669c91efaa4efe80f6"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "9efc72b885b44dad58222570456685d6"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "7c0de46e766894e70278287b252a0705"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "629ffae9ea85dc41cba2fd41bdf0f534"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "8697b056614c1e7d216dc1c5ecaa09c9"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "932643fde58a7bdf79da314443019f40"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "438588eaee9fa0dcec0b01bba15d3c17"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "dc1be49edf52fb12ae2e31f2489c732e"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "9c3bfd50d8ec404431abe3ef79d866f8"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "5e50520fb1344f1b8392007d3b7bbe6d"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "4502c3c88bc4b51298fb0908b4fdd212"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "de46718fb00abc8b63b878874fa93eb3"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "5e6b5db52855111c31144f4b963132c6"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "e7436960979ec045da9fa1e24426b6d0"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "b42d6f590c1153ebeadd5e799641e021"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "7b498baa3c6b930777f5e268271738e2"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "5646962c283d1f0619c33fcd9d521d7b"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "eaad49e1ef2283aa4078999d7d1f2abe"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "1a2cc569aeb2e66299135e23cee1e7c1"
  },
  {
    "url": "architecture/index.html",
    "revision": "527d54a92477bf9874c071f51f97e047"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "c086aeab7fdc40341c0c94cc7079cd42"
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
    "url": "assets/js/16.257df35a.js",
    "revision": "1c7766b2e0c28f21c36309d252fb77ae"
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
    "url": "assets/js/42.85ae0784.js",
    "revision": "b6ea5cb650e9377c13d9da891f5be37a"
  },
  {
    "url": "assets/js/43.0c0e06bc.js",
    "revision": "ac813132c49e4b9cc497dea8ee3106bf"
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
    "url": "assets/js/51.c6d64a87.js",
    "revision": "daccb0905f3f8ee5fd9faa936bf388b4"
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
    "url": "assets/js/54.219da59b.js",
    "revision": "3cf15201b3d4c10656dabbe1e8c99ab1"
  },
  {
    "url": "assets/js/55.0e7d1fff.js",
    "revision": "05d65b913bf091bdf99694c12c381a27"
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
    "url": "assets/js/59.d24162c9.js",
    "revision": "fa71b8a06441c0983975d14334a96167"
  },
  {
    "url": "assets/js/6.25ec3b52.js",
    "revision": "3d32520bfbe3d343abbaede6bfbd111d"
  },
  {
    "url": "assets/js/60.fde9de4a.js",
    "revision": "448f89474295dc9573c7af3195c88366"
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
    "url": "assets/js/app.e978d7c5.js",
    "revision": "710817a950b60b4d53df9db5c51e0d02"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "d8eae1247810a11a45a28929ef524b08"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "dd326d442544b4d0981c4168a1af540f"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "f4d5c26b2bc76d187dc5219b36b05f64"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "be57a5f7f884e3a974053e340f1883a2"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "7376e0cfae13ca7dac4b6adb44f61ae2"
  },
  {
    "url": "guides/index.html",
    "revision": "ed2ee67c12fda76982660c6257059d95"
  },
  {
    "url": "index.html",
    "revision": "6de4ab6e0c066d19ed9a194f53e42484"
  },
  {
    "url": "tips.html",
    "revision": "a64d0fdd3f4eb495bef10fcefa9e3205"
  },
  {
    "url": "tools/browsers.html",
    "revision": "291a8288b5b0659a74a2bf2a540f3920"
  },
  {
    "url": "tools/cli.html",
    "revision": "1a2fd098c443d9d3d47c138248100de8"
  },
  {
    "url": "tools/documentation.html",
    "revision": "71b991a7a2106e9777ddd7591b1f9898"
  },
  {
    "url": "tools/index.html",
    "revision": "4a8865b6aafc3b94baefeafd9889bad9"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "563f1d82cb4260e65be63d21eaf92d3f"
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
