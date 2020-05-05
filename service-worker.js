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
    "revision": "865883ac07bfa967b2c76d399facd990"
  },
  {
    "url": "about/contact.html",
    "revision": "8b28a2ef7f573bce2a55509cdf72ddfb"
  },
  {
    "url": "about/contributing.html",
    "revision": "6047f7f6a30a241cbefc04fce1c4aef6"
  },
  {
    "url": "about/index.html",
    "revision": "958a5cf32ccd702ff93544b13da89c1f"
  },
  {
    "url": "about/license.html",
    "revision": "8c61d188bf9f3d1939191fe1f5cca5f3"
  },
  {
    "url": "about/roadmap.html",
    "revision": "6aedb13074e69a96867a0cb6775a25e0"
  },
  {
    "url": "api/index.html",
    "revision": "d681437d9a82f10ff54aa49a8a1ba4cb"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "1fb95ed9cc4e9973af28442fb6cb67ea"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "c418d457998a3c8c60c26c79e22f07d3"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "dce4400ee533e962e9f789f08cb065a8"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "931c8c1b03fb258c0e7b7f5a575daa7c"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "b8ac103372204167bca515df0bf456bf"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "e86f66d56926e9ebb57d7366a4b5428e"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "5ea2c190fdcde5ed3d205f2b4a3a4ae7"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "972c96e9bed9f42f7c2acc16630b8c03"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "e4939608bf0074562ec2c12abd369531"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "6d479eeb4cd0c45e7b77e5ad1184edd1"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "fca449fe2d2d91c7ca192ff824b0f5b6"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "f9eda6a46d3dc6205251f8a23053c44d"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "5cec55512d6a6f075740f7363de1dc9e"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "94f5fe7b98a558460826afec67df567a"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "d29db7bd32ae59eb1eb258cb130a1364"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "0f0e4f958bc475beb61ec9279403aa4f"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "516f3c8ed5e814a5c963b04cc84a6dc9"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "670fdd6ec5ef1419a743cc208a87441c"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "7382273a19c31b767e49c0bb48924592"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "a4638a9d102636557b5c37e81234484c"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "62c3d8f1ae856fa52d7bcc55dae1e780"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "75276a40de19386ae03bfa38b4fe290b"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "d06d0df72b8df883b0ea22582f49e610"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "81d9356be144109ebd1c726076d9ba8a"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "5a1592900ce65b46cd8befceeaa54322"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "d70471da7b3210b28a667ba994de4792"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "400480d1736b093b2c140875369a39c5"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "3ee6f2d602b53009ee04b91f889b6e19"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "cbb75919481ae927f463ade02b0f3534"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "bb317fcbc7790a22ba83915779739bfe"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "362cd41c66f710c9da418b25967984b3"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "92078db4d7c5cdf98217c3b5f2b07e99"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "745f382a2cb2726d85336f33bcf7bf21"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "c7013994e0be66ef7346bec62d346028"
  },
  {
    "url": "architecture/index.html",
    "revision": "9ee1869dd7f1a3486fb85d8412f70a84"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "17a5857aa2e556fa29d5db30c29695a9"
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
    "url": "assets/js/14.1e9ccaf8.js",
    "revision": "215d5411f74179f756eba429216f8af2"
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
    "url": "assets/js/33.eb2ebcf7.js",
    "revision": "4fdadd4a5ded1c04f9397b84f9675e01"
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
    "url": "assets/js/4.e2f1ab2f.js",
    "revision": "67ab3f04991ba8a2af4bc7c8bfb78c65"
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
    "url": "assets/js/47.707c2ea7.js",
    "revision": "73529802e8a7982e47f6d6856e56dc3f"
  },
  {
    "url": "assets/js/48.3724f664.js",
    "revision": "20d078b90e046c017643553a9e31b362"
  },
  {
    "url": "assets/js/49.4fe332ca.js",
    "revision": "4167465da9f0de916d27b14da58a35b4"
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
    "url": "assets/js/51.2583c975.js",
    "revision": "a8bd580989005cbf7b5f97f8d637fa89"
  },
  {
    "url": "assets/js/52.e8db8feb.js",
    "revision": "25418dafd9e56cd11c812df86d202355"
  },
  {
    "url": "assets/js/53.48e3fec2.js",
    "revision": "7848c58111073f72e89e9944a52266b3"
  },
  {
    "url": "assets/js/54.219da59b.js",
    "revision": "3cf15201b3d4c10656dabbe1e8c99ab1"
  },
  {
    "url": "assets/js/55.b665f674.js",
    "revision": "ef751f521d4688c3d298caf409f2bc6f"
  },
  {
    "url": "assets/js/56.f4759c8d.js",
    "revision": "5acb573b4f0301dab49607c6a4552a62"
  },
  {
    "url": "assets/js/57.5027896c.js",
    "revision": "8f4315c6fbf9785926f6d1cb0bced97e"
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
    "url": "assets/js/7.e56bf397.js",
    "revision": "54013126eac0c3286c1c7d3fd0169887"
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
    "url": "assets/js/app.f8e5520f.js",
    "revision": "18fe8fe048736f36bba45ec16e34666d"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "4c12d04b8a7087f68dd2a8a59badf9d1"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "f979e992bf1e219a3e9024a956321b50"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "1353db2a71628fb6bc9c5e79c07b2db1"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "bd567d727a047c16bca7ce59a1c4707f"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "98de9577bac03c38f8b3023503677204"
  },
  {
    "url": "guides/index.html",
    "revision": "0527dfd3bca2f23b0e4ee372bb6a147b"
  },
  {
    "url": "index.html",
    "revision": "8931f827e2394a6f6e23751c80d97969"
  },
  {
    "url": "tips.html",
    "revision": "18ddbd0ec669ca3e1a437a3d1d0aea8d"
  },
  {
    "url": "tools/browsers.html",
    "revision": "b0b3801eda522b6097b10434df751ac8"
  },
  {
    "url": "tools/cli.html",
    "revision": "da4a6a201776a5cd7c4d0083a731fdac"
  },
  {
    "url": "tools/documentation.html",
    "revision": "1e1f9a914bb2e281953bc7e2a3db1114"
  },
  {
    "url": "tools/index.html",
    "revision": "ffd310fcb49957f1382fe51e76acd3ed"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "9163682d7fe50de8cf3db512971da007"
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
