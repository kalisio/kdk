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
    "revision": "716c5ae6eb2e97592c773496ba7e6de9"
  },
  {
    "url": "about/contact.html",
    "revision": "9b2a85f6227515f0e023d6c1c4ca6a08"
  },
  {
    "url": "about/contributing.html",
    "revision": "93c6d9810e11172fd68988d0420f315d"
  },
  {
    "url": "about/index.html",
    "revision": "2ff31ef9334c6e06ce74044c8136cdf2"
  },
  {
    "url": "about/license.html",
    "revision": "796c9ab336ea27161cc2c72782fc3382"
  },
  {
    "url": "about/roadmap.html",
    "revision": "cacf9addf911a359ae1ce7d75e775335"
  },
  {
    "url": "api/index.html",
    "revision": "bd2ce93c59da0d5bbd2379b1b9f9267a"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "202de98d74cfc573a0a95dd0cb30427a"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "727e89613f71888cd640e4e1c7a735ae"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "861b7f635bc81ca27c6eca9993c48ad8"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "f6f671e9b3897d91fc801dfeb54b515b"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "602f558df90c0ff87018173cce458d1c"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "8ef100887c6632a4d5e30bc4d10dfec7"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "e4f9916e3225ebe194a58ef1b92ba8d2"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "0401d229e63762c13895f16fcd5a2096"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "6cde86a956cb584165badf579fe5d92e"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "307674151ad6c1fcefa075ba78a58425"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "38ecec71497c4e9917cc3e781a1a4f62"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "768017a954686e897a4da89724db9a83"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "657060f35c495d08bbbba4406312571f"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "9a97d2440a584aec208621920c057459"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "f784c7c3aab5507e61a7653997ed5aec"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "d3ce36330aeb72d21bdc1ab49a73b6d9"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "8cb1242439e1c08b6f29d36bcee6bb39"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "59bd3e2c0317c2bc1d493accc1d07cea"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "0fc993d5593f8af4d483da9ba9a3a859"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "8df469883daf665431c3c5f1bd6b70a3"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "8a5786f2102b7081dee8bf149029f8a1"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "e7487c95c097cac9a54511631b29408f"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "f9416be9b4214d68f2d1d3f357aaedf4"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "2df180069d6ee0a26ef6765032a99f49"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "f34a9be130aba937f2c0d0a4d519b11c"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "1bcb44dc0b7651d8e6a31ac15a886bff"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "19f0a45235448d8b4db6d3248a68203c"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "4d267610338fd94d826ecd1d77c76aaf"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "375ca7b4404180d9a8df744a24d8ea39"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "d872ff0027e8f700471a2e9eef242780"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "98afa811a4fff9102757cf05a3224512"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "bc1bf98d8be964e95b005d1dc1b088cf"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "aa8d4598e8e62188f20e8fcff624f8de"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "f372a48fa822a18e6441d6abe8451324"
  },
  {
    "url": "architecture/index.html",
    "revision": "276245ed30b33241295a605a35894053"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "2821d69a2f0c540faed7db861f651803"
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
    "url": "assets/js/10.9cab8084.js",
    "revision": "14ea94417180d357e678bd86de4dc41e"
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
    "url": "assets/js/25.bd531102.js",
    "revision": "ddc792da152ceee48d8a04829cd5841d"
  },
  {
    "url": "assets/js/26.99d42269.js",
    "revision": "f7f169b01d8b7210d70f5abb147d1fa0"
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
    "url": "assets/js/3.0ef43070.js",
    "revision": "3f75189fffcfe0e62367795d62a123f6"
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
    "url": "assets/js/32.51e8994e.js",
    "revision": "effea7b025176309be796f2683d856df"
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
    "url": "assets/js/40.90b4e571.js",
    "revision": "3bebd52197cc7cb3aae00b893a149fa3"
  },
  {
    "url": "assets/js/41.b230960c.js",
    "revision": "0b4fd4241da25524d35292c8eef8a929"
  },
  {
    "url": "assets/js/42.b29b7998.js",
    "revision": "72650b322fa1365d5243e87b00da6613"
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
    "url": "assets/js/5.a1660827.js",
    "revision": "d5fc20d1a5b32b9caf9fc7e6adc8dccd"
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
    "url": "assets/js/53.aae6472b.js",
    "revision": "e4bf2b15785f3823195499b4ec11bf2c"
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
    "url": "assets/js/56.003abe86.js",
    "revision": "35bcc4e45a7b17a4a80e5f81524eed27"
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
    "url": "assets/js/app.fdcf56d9.js",
    "revision": "31d91ede25ccb73dee65b0d4e7f9099d"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "45733a2fb3f9e9e155d0482dc2b06641"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "578ef5e410db9e28d24c77c41846d98a"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "b251b3916d2780b2141c6528847fc2e0"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "ebcc9b01e4e72543392d33fa7a04acdf"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "9a46f11ef9ccec45dffdc1de27dcbfa8"
  },
  {
    "url": "guides/index.html",
    "revision": "a0818914d68a1e8a5f73bde55ac7f0d8"
  },
  {
    "url": "index.html",
    "revision": "674d0a8bd776f285cda4c3647c0a576d"
  },
  {
    "url": "tips.html",
    "revision": "ef13665359d3e24bf5f2936820458946"
  },
  {
    "url": "tools/browsers.html",
    "revision": "e34e45fe8f7021a694c02846120302e4"
  },
  {
    "url": "tools/cli.html",
    "revision": "78330c302b53d58f09d5e25ecce05523"
  },
  {
    "url": "tools/documentation.html",
    "revision": "437b90c998e65a53849bff84983d16a1"
  },
  {
    "url": "tools/index.html",
    "revision": "2a7be972b188d1450a9b239171b87649"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "cad55db4a31fe5b075217dfd6e202313"
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
