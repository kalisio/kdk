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
    "revision": "fffbf1d43130025e8288162f6799fe26"
  },
  {
    "url": "about/contact.html",
    "revision": "ab8fe21270e21f40e78172c8b433d487"
  },
  {
    "url": "about/contributing.html",
    "revision": "aebda6f6a3c48f4b6979f1086c468103"
  },
  {
    "url": "about/index.html",
    "revision": "2623ee2d934fdfb6d8b02759338c8961"
  },
  {
    "url": "about/license.html",
    "revision": "de8e135747b2420835ad9b6237b617e0"
  },
  {
    "url": "about/roadmap.html",
    "revision": "7ee3d466ecaf08a519de43082d2197c2"
  },
  {
    "url": "api/index.html",
    "revision": "331d209ccd313890a0a877ab81555344"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "98d2c87172b1e54b6680bfa4e531040d"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "1b683337856240fa8e13f460811a368d"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "3d81c446f5edbd17e8a2b49d26b2eb03"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "a74822d4b8276973b13593f4117147ef"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "504e70aa430aeabfabc495257a8d7dbd"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "b77e075963412ea45900c5c5db73f2f8"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "10e1f633b7a1e8532bdcae259f6378ca"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "407f94c090e6540ee36cc6380df4d3d8"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "73892a31d83a9888d33bbebcca6afd82"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "8dcfcb284f4fbd2a193303148ce65406"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "3e92c693a3361a678da89885debc79e3"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "4f64479b7ddb92eccffef2dfa029c159"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "303c0fc5a1ce02680832277eb1f7e682"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "96f47e3b6227f3d4e21c42fe2a6502e6"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "7158cc95c1cad6267c1a7f9b47b73c97"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "fb1ec37e80405ef8ea42659785ebca17"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "f8f6d51392f5bbc91c1a5043f2c90bbb"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "a9037fe54d21f395e3d1c25d432aa80a"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "6761f01903fddd95368a82a141ebeb12"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "cb8e472946e9a8f174849ecc1b7221bf"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "3ef7ce65ac1007872329cff3b9ce806c"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "5a9303cc240b13e00539c679d2321df8"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "f7552a7526d87b4713698b885d0966e9"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "446efbefcf8ec75881c7105a908b3f79"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "51d792bfa941c3039ee961f95fb75a02"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "f4bbff0684fbbb7be6650cf638402213"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "687ad7ec9f18fa079f512b62378ff48c"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "747e6bbd4a913c5d63bc6c1ad66b9e09"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "0586e90c3212ad1b138b11da03fc9c52"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "0e92b40b67b922c4c145bb8f84f0acab"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "fd9a5d914f383308cd0d78679809ea9c"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "af6940ef49ae66da333f9ea44c31cfa0"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "a578b764fa4661db2010bc53c5d2dfab"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "3172076239fb9979f7c87d3b22c9ad9a"
  },
  {
    "url": "architecture/index.html",
    "revision": "277218ebd8d47d4102cc14c1448edf3b"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "8eb2e3610c647694969f0e49e9213de8"
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
    "url": "assets/js/11.0df38271.js",
    "revision": "8492b8d1d8dfe74bbbab2c48b7bde27d"
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
    "url": "assets/js/14.b4b813ad.js",
    "revision": "e564f4facb27dc031f8b78144e9923c9"
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
    "url": "assets/js/21.e779e77b.js",
    "revision": "8cd58f3087cce1fdf43d312fa2375e70"
  },
  {
    "url": "assets/js/22.bd078a52.js",
    "revision": "6fb4bf471264b3f38e4d0cd8972331b3"
  },
  {
    "url": "assets/js/23.316207a8.js",
    "revision": "28dda16f41431c155f84b0b05f34d275"
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
    "url": "assets/js/50.40673097.js",
    "revision": "daa314d40ec4d0ef36274492b6e8715f"
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
    "url": "assets/js/56.13422586.js",
    "revision": "c602022f280bf0e42b4f7645c45bc904"
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
    "url": "assets/js/app.d71f7269.js",
    "revision": "89ea091c6889ef6564913ee34326a4cb"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "c1efe9d7afaa7d89886383a99923a44a"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "f25595dc8eb8ee5f8dd301fa1dda9c3b"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "2f04d1924d48707270ef5a1cfad704a0"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "544fddfcd29d6a01354b4f5fde3223b2"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "6068aaaf32b84375e342386d45d74fc1"
  },
  {
    "url": "guides/index.html",
    "revision": "e771d563e164041e9042c48525107fb6"
  },
  {
    "url": "index.html",
    "revision": "790fb08949ddedad7002019b969d7f3b"
  },
  {
    "url": "tips.html",
    "revision": "47ec02e8014dab3af7ec2fb74352245a"
  },
  {
    "url": "tools/browsers.html",
    "revision": "8ce17a3f50df9403c8382e144e3eea2c"
  },
  {
    "url": "tools/cli.html",
    "revision": "0874e57d3d7c7d831ff243e1e1eef138"
  },
  {
    "url": "tools/documentation.html",
    "revision": "18475fa0c412f9c97f7c28034d29e6c5"
  },
  {
    "url": "tools/index.html",
    "revision": "359a4a008533916b10489eea770d4b00"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "27106667ed9158bb8797560618ce6d9c"
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
