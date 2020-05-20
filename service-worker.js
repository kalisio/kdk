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
    "revision": "39b70ed4c76064ea707b3f94d406944e"
  },
  {
    "url": "about/contact.html",
    "revision": "c8013c3cd37d54b49c6c2e750ed81888"
  },
  {
    "url": "about/contributing.html",
    "revision": "9b56badf36c2399731d9161ba936561f"
  },
  {
    "url": "about/index.html",
    "revision": "105f4c5f4420095113d42723f452608a"
  },
  {
    "url": "about/license.html",
    "revision": "c35c8ad50ca588b6131005603e7040f5"
  },
  {
    "url": "about/roadmap.html",
    "revision": "f57290bc6556c0c5ad7e4b3082fc30b8"
  },
  {
    "url": "api/index.html",
    "revision": "0301cfc36833d705e0243fe9788767c4"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "ad8ee526381b17ca2dffe60d5325e7aa"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "3c0d2bdf1fd2add27d707de27852289c"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "6a2a6472d485a36228cfc5f4f510251c"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "9140db435a71b3be4c8b7f14f14af768"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "06af246b942293a48b6266a914f23292"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "6174ca2699c3560f156be63987c45a64"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "77a93854825a0c9d0739f3a390a4190a"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "aa12ad73edfada0da8107c26848bddd5"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "0fb6cd027506d75433da2482c3351ed8"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "6be0e24c36cb3052d19df57b3864284f"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "22b9d41380f89e445a806f76eab4af21"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "4c51f3ca42cdd0470c2a27bc9d08f203"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "a941bf7e9e08984cafcf0b8ea44fcde1"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "d3a7699f2f52b430e8c421df5242c24d"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "65ea365012115672b5906348a1553b82"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "f2f20f6a4255f4fdafdbfec4df67a02f"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "d0e0fa51ffe8407e2610305ae1c6e575"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "dadb707274cde9f7fa3bb528c8e5c05e"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "e14aad8929a9fbfa8f8a86df76cd25e8"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "ec054fb30578974741be8dbad809106f"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "2ab89d72d1f54ec6742d7d561af954ab"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "1878fa1a1644638895b84f40581a0ba5"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "a9ee1b07ae75ecc76e5a07313aca1954"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "8e3f2d77fb21f933a9c42a8ddafc87d0"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "e854b81e83e027a13b9e9fdf82b92a14"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "c71e8aa05c20eceb35b6bf453e4e740d"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "3a71c20fd01c62cde327d23545e0e7f1"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "9d0014c1551f13d90d727c941ebcd08f"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "c9d6e755177f93afd4e7d13b59c0640f"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "c86f539fd4db334622e8374789405c92"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "768dc817c2d764ffe22ea89a16f877b3"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "7d3049b140b83e2615689aaace4b93e4"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "ac1f4c7d9205dc535365abefe34cdf9b"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "cb7dff0879b54fc8c2e49247e99a9eeb"
  },
  {
    "url": "architecture/index.html",
    "revision": "e3cbe8283de628249451f338069ca7b0"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "11240a996fae13b009f1a3a28d26d515"
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
    "url": "assets/js/14.b4b813ad.js",
    "revision": "e564f4facb27dc031f8b78144e9923c9"
  },
  {
    "url": "assets/js/15.f50630b4.js",
    "revision": "17882742696de81fe92dc4ee2292a200"
  },
  {
    "url": "assets/js/16.912aee1f.js",
    "revision": "bafce3724194862ad71aae67fb2e733f"
  },
  {
    "url": "assets/js/17.a8a5954e.js",
    "revision": "b1709603246e18a9f800dc92dff9d304"
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
    "url": "assets/js/49.503c9310.js",
    "revision": "d453cbc88d0e246b554299cf1dd62990"
  },
  {
    "url": "assets/js/5.9a6b1310.js",
    "revision": "ff14c81e7c99d1fd513d03e5b51b2479"
  },
  {
    "url": "assets/js/50.e8557c2d.js",
    "revision": "45e800ad9a571d64cb5f76046d4527fe"
  },
  {
    "url": "assets/js/51.c6d64a87.js",
    "revision": "daccb0905f3f8ee5fd9faa936bf388b4"
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
    "url": "assets/js/7.eb005050.js",
    "revision": "5220ad13c20af1640b2c03c2e13e4780"
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
    "url": "assets/js/app.19944e01.js",
    "revision": "4bd9be24ed7eb0ee2548dfb7a5be211a"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "2c5e35de603bfcc07f193a65fe62b251"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "a512f4da21fa988559a1f23dbe621d1e"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "4a65d836e67c9ea027368220ec746ccc"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "9f1a4549c529b80a0d9ba78698dc0162"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "fd6e3768b0639e960f4ee3a69aa549a1"
  },
  {
    "url": "guides/index.html",
    "revision": "a3bddca5eedb5199135d676857117dcf"
  },
  {
    "url": "index.html",
    "revision": "92679a34539a399cd59d5b49860e2313"
  },
  {
    "url": "tips.html",
    "revision": "37dfbf758083f8c96e3723f1bceac6b8"
  },
  {
    "url": "tools/browsers.html",
    "revision": "f0297a05b36573dab586e3979935d028"
  },
  {
    "url": "tools/cli.html",
    "revision": "1f041eaaadc3b3306c12a3c5db762b7b"
  },
  {
    "url": "tools/documentation.html",
    "revision": "767b4794b392bcd19c5bd1a6bc04343f"
  },
  {
    "url": "tools/index.html",
    "revision": "4bf50a37a60eb4e56e6279f10104eacc"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "a85f8a8fb036640b65ed8b3813623c22"
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
