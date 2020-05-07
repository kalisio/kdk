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
    "revision": "ebd3c38dc5fbbcea066c5d31abc91935"
  },
  {
    "url": "about/contact.html",
    "revision": "4e9331ce2bef4ed50c6c0117fcab3408"
  },
  {
    "url": "about/contributing.html",
    "revision": "1c7af59354f7579bcc4f5598f3d5e2bd"
  },
  {
    "url": "about/index.html",
    "revision": "87a94db6be0f808099c8860609a67649"
  },
  {
    "url": "about/license.html",
    "revision": "e87b65b148e313840f5eec48d74adf5d"
  },
  {
    "url": "about/roadmap.html",
    "revision": "d95552c54618ba93575f2705e0ed090f"
  },
  {
    "url": "api/index.html",
    "revision": "4b5ec761cbd3414ebc7c0e1f50216475"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "118083e7adb685ab321536d74733b14c"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "cea3e6df7550a38c2776507faa1f82e3"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "c1fac7857675cc05e2c72c1bef6f6c8a"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "a6d48628f3beeaaf8fcac45b1f314a0e"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "8c9bc5fdc3334dfe899ef2847a231b4d"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "94316c6df5bdb81480198008cac298af"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "0d556d7ffc5f986098e812ef460e9401"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "6f8891bfd3fa2171c88ca479d185689b"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "e62c1915b2fdf9844f15395230a953f6"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "5cde48212456f5fcbdf4833880955ffe"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "aebf24ca52067d7a656be1c5a4f32b9f"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "4b7c01ec3ea59275bfb302fc0456b084"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "3681f1af68ae57fd166eff310af7f1c7"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "4cfe79fbf89c29a36bbb7e4c4e822b88"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "542ad3442c0aa548c4d514ca29abd5f7"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "1ffda078caae120892a652059c09ef61"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "2200c4aae65f99e0fbea75ba344729c0"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "95223e19fc9477e87da6dc0aace121f4"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "3950b4c3638b0ef72b5272a524aaa4ab"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "b79eeab3069535e93902434f17f8311a"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "8e7dbb25d9aa63838576866f20e053e6"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "b3939abce99c69cd0ffa89b2fda4e67a"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "88b238073a733b7147038cbd72c5730a"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "4a69272b8599784d55c58a3026c7d7e2"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "fe84b4c8c89187556705e8d0eaa8069e"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "dcb99d41341a14bc79d2fd33a9d8304e"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "8b8896aa3467ae67962a9d844f91662f"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "31c7bbf497f3cebb900af6354af7beb3"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "0bcace8149e8468a57360d2fafdc2007"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "d3a42e3540bbde08351dbc0ee4b61e28"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "5e2f471890a725b68cb943ec75bc0868"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "6dcecc3827a0bec15b61b1d1e8dd4c1e"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "4c92bc3ffcba3afcd68bb39e7926df9d"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "2cc4705d0b6b0538035b699b442ace10"
  },
  {
    "url": "architecture/index.html",
    "revision": "4e04fd91ca5a23b5e790c0c62eeecdc6"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "190025d9a1a9e78c5acb913cb4eab050"
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
    "url": "assets/js/15.f73ab194.js",
    "revision": "1c0147e942dbc567473a283a4dcb748b"
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
    "url": "assets/js/28.57d8a8c0.js",
    "revision": "a37aad25a72abf3a0a9caea4b802d4b7"
  },
  {
    "url": "assets/js/29.57a4508c.js",
    "revision": "c7725c6151fc5ff0ac7f81fdb5cb7766"
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
    "url": "assets/js/54.a0534692.js",
    "revision": "6c153349cc55745d455a161faf496eb5"
  },
  {
    "url": "assets/js/55.73d32943.js",
    "revision": "f18a8fb22587779be4e6c81225db754e"
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
    "url": "assets/js/58.87daab7d.js",
    "revision": "0657770c6719cf58ee410a923cbbebbc"
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
    "url": "assets/js/7.23bb164d.js",
    "revision": "224004da6d7a7397432847d42438477e"
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
    "url": "assets/js/app.175b6c85.js",
    "revision": "c1bf2602e4fdac46a4a23afd77e87b0b"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "4c42bef9eda253034869a5c1c0ea4f23"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "4175dea26b28d6439e4957ebf1e9ccfe"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "489fa93f80e240d63f5c308e4444af4b"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "d284431141abfe103df9651918e74e65"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "36379929321b201c79436e61eef97def"
  },
  {
    "url": "guides/index.html",
    "revision": "d626097d612cba704c0ad00c841cfb28"
  },
  {
    "url": "index.html",
    "revision": "ec3a490773f5b53ba1cc61307cac7f1f"
  },
  {
    "url": "tips.html",
    "revision": "475282084df53ccc17d6f0ff3aeb9008"
  },
  {
    "url": "tools/browsers.html",
    "revision": "d235f8a82ac63e5c0d8cc8951b55b0df"
  },
  {
    "url": "tools/cli.html",
    "revision": "1b5b96916e562293fe861e172c262325"
  },
  {
    "url": "tools/documentation.html",
    "revision": "14e3f9170990ae0670856b1957e6283b"
  },
  {
    "url": "tools/index.html",
    "revision": "fb117130dd64eccb024c203cc4e1c98d"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "401042bc8d46bb52b9fb6ab001e9af1e"
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
