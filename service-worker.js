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
    "revision": "af2a9471f40171c244ea5da2ce39fb59"
  },
  {
    "url": "about/contact.html",
    "revision": "eb2a41b55c05e5137ed29766aefa19b9"
  },
  {
    "url": "about/contributing.html",
    "revision": "909ae71bf3aa857b67a0840668f73afe"
  },
  {
    "url": "about/index.html",
    "revision": "74b3b8b1a6bc4f0ee50b3bc91435cf66"
  },
  {
    "url": "about/license.html",
    "revision": "7239311aea13ea5f16e4ff53284f4802"
  },
  {
    "url": "about/roadmap.html",
    "revision": "7c69e15d5668714fc60371cb303a4c98"
  },
  {
    "url": "api/index.html",
    "revision": "633c2295a25dbb9883b55684f08ba709"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "bf362228be5ae87849ea672ef79409cf"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "67feacd0c1d04e52aac71171638f44e9"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "8c41652c4088729a729033239a4ec6d1"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "2ace9ee6a3f44853b12553f98c4c225f"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "a70bfaa550ef9e1a35f1eaed333f8323"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "02292992dc4247276476bc137688bcc5"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "2666fbe290f048b0968d7d59aa31dd7d"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "fc6d0c712e5263a3cd710fd3a4ec3925"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "5f8f9b4498db460fe500caa82578302e"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "8cb932852cbbd2fdea8b9c93be98dcc0"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "860b45297c90c05fae76dc56f0fd2297"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "933c421a61282d1a53fefd2e26441b71"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "a1a31f99a664938052a9a6e72d349c16"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "a6c433bc4ad8791bf24fdc4d1b5fba92"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "6fa4ae4bd07e16def2f0ffbee7354ccb"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "be4e4ba0a6bbed554c1ded781d7f4dbe"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "da00446c9b62b73ee360ce41164ddf3e"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "ab15985c1a106ceb2f403c2cccbf97c1"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "052ec9a4c9a033ca835abe1436ca4d2c"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "5bfdf4b0ec0ccab8a0a3721eaac48379"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "89a5b3a32dc75183eb9116c710c2c680"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "0e3040f21025c22ba9243eacc6a04fa8"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "126801802ac391c2d9d96a3859b5d5e1"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "8b9afd4ec9f9c86b1834324696b091a4"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "36767a30fb5c9ed64b960d52eb9e62ff"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "d9c69ac39ee581a2243b2d25c6b60f83"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "ec1f71ac68491652d9a6fe64cf5ac9f8"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "bcdc37532b072296c7ea19e71d3b7acf"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "2ee685f5f758a54fb7c74964caf88398"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "69fd5b5ae749144192891950643b5227"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "1fef7934cd902e6b3cadb3dc0bc1e465"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "e0ff04ffd08952cd0c12ad6558b4b7d8"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "ae66f5612be7545eade8a10b2cf60fc7"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "b6e641f7eef280c806f5559ed6a82680"
  },
  {
    "url": "architecture/index.html",
    "revision": "5f8dd09eb60220c72ba9e8462e11f1c6"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "2cb0c8cbb353ecdd0c355f7388218012"
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
    "url": "assets/js/54.99feed97.js",
    "revision": "b50b0e0f983a83dc47a2a46627a0716f"
  },
  {
    "url": "assets/js/55.73d32943.js",
    "revision": "f18a8fb22587779be4e6c81225db754e"
  },
  {
    "url": "assets/js/56.3ed01714.js",
    "revision": "0e994aec28686c874fd89ab32e80309e"
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
    "url": "assets/js/app.271416bf.js",
    "revision": "6b38f5a4390e27fbc3b6093622a084c9"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "62a564714281da88e6c8a356c522ff0c"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "a56087d4b8eef70294ccc401deb0fb3f"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "e0660ce658dd4a79faabd544704d7625"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "69ce430b4117642a5016c58a414ca552"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "ac7bb1597428691c5766e3021f7b99ae"
  },
  {
    "url": "guides/index.html",
    "revision": "4f385699b08d0290807363317add9133"
  },
  {
    "url": "index.html",
    "revision": "f4edb0b3766424229731c1319c91e4dc"
  },
  {
    "url": "tips.html",
    "revision": "232ee17fab0d29028fde06b3e1bb442c"
  },
  {
    "url": "tools/browsers.html",
    "revision": "46f3105ac82f747416a70973bca52354"
  },
  {
    "url": "tools/cli.html",
    "revision": "192f6b6c307b58f4bc923fa787391ff2"
  },
  {
    "url": "tools/documentation.html",
    "revision": "d5146425676797f5fca4061141b9a7b6"
  },
  {
    "url": "tools/index.html",
    "revision": "e584ea47b4882131bbf63207c57d2837"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "0e36a636ed619610e59f591d44ce649b"
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
