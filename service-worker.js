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
    "revision": "7b52cf1a534e9d31e6c0560c2aa940f4"
  },
  {
    "url": "about/contact.html",
    "revision": "05889f6e91f538f90238d02b8cd9dc15"
  },
  {
    "url": "about/contributing.html",
    "revision": "4b32e51fd7580deef699343b9fca23b9"
  },
  {
    "url": "about/index.html",
    "revision": "be69accc188db299d16a48ac5507547f"
  },
  {
    "url": "about/license.html",
    "revision": "082c4971764d557827a673f750ec8098"
  },
  {
    "url": "about/roadmap.html",
    "revision": "023e0fcda965865bc4825cfce1c66585"
  },
  {
    "url": "api/index.html",
    "revision": "b9f48f18031749552387c5c4be05c14a"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "258e6dd03f385243c6652b3d26ca4b42"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "1831f14d6e4cdaa8d6e60263f2710d56"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "df487a781e39e76079495723547239ad"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "b55d259403485618636bbe7ed89aecfb"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "124477425cb8930990af90cfd6c5988d"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "f93dcb75fbb47fc11c2bd396a6ccacd6"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "dd832458576bd6553fbc4dd140a8b185"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "b0584eac33c99025d87d14054705b90e"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "f47f9b5a46d3d908f417be9b07767adb"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "385aa9515ba4c80e7229a1edd0d25e0c"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "2a1ebfd21e500ff6c577dfc7f67c6983"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "772a8bc0c78886c33171d7d61eb50937"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "25090b7510f31a9b2976efe558276e6a"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "8e8fb2889a081c9d3555c3bb7a51d67f"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "5536a425d5355044e66dbaa471974e30"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "94edefc8e3f9267414e11ca670567bd5"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "c7c95ee664808f7c8bd23f6a5b09b6cd"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "53eeaec3ed1a9d5764a975ca8edc1ccc"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "69e5092686421031be9b0a14c38ad0de"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "b81e3f41fb0183c05d8a0f0b3d269d7d"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "c9529cd1f7b99b76b7668e83ad1f7193"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "50c910d5babfffb144c164b57dc8985b"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "cfa388c481d0d77fb1da15c67e4fe56b"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "ae07dd94e9cac60eebfbbf9a310153ef"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "88c852a8d69ab6160b523ac360ea3c2f"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "7b7ae3ecca52e062d74d4c265dfc8fb5"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "acf2f100c40b20eef2fa62a40a34821f"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "002f03628a59ad3d2b8f1cec6ff87e38"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "b3ba41c41e3cb42741414ca21dcc4620"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "1b9e754d13f532a238e29bb309217d0f"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "594f7c78e7f69b8a7d4b5cb1676b7c65"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "fddb53059ea504c4c714d6efc84f810a"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "90b0972f395920c66886de3c9683d7fa"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "8f4371fb567343b555b0ad7410f6d8b1"
  },
  {
    "url": "architecture/index.html",
    "revision": "ad88083ee234787d140a973200425ab7"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "f1f042a4963d0775ed7b3a3893df2ff0"
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
    "url": "assets/js/app.59dd8c2f.js",
    "revision": "abc6ba9208fd20b29add1b0240b579ed"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "6fdc77e61ab8cd6cc844b1c5561d1bd8"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "767880afcb56fede68aa7ed0090a7cc9"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "414ff20abfaa0fded897b31b13bc1396"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "72ffe18123c7f0e689e11f66e0aeba2f"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "cc86d7eeb9c1deb9fa38e16b68295a41"
  },
  {
    "url": "guides/index.html",
    "revision": "bd35a796f3331ceb405670591f99ceb6"
  },
  {
    "url": "index.html",
    "revision": "7ed720127ce2a8a0ca728caa2627bf6d"
  },
  {
    "url": "tips.html",
    "revision": "44e727dc0aace3dec0025e48153ab636"
  },
  {
    "url": "tools/browsers.html",
    "revision": "d93713904e053acff328f8585ca24d76"
  },
  {
    "url": "tools/cli.html",
    "revision": "7ede6320d576e95aa92781650ec7fadc"
  },
  {
    "url": "tools/documentation.html",
    "revision": "4673dc26966632a2c2ca3b0bea8339b7"
  },
  {
    "url": "tools/index.html",
    "revision": "705716e610e36254884a9f86b8c536ab"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "105825d554c847a171bc3e2ddc90cb77"
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
