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
    "revision": "a87e6b32a94d892425fed992d1c4d93d"
  },
  {
    "url": "about/contact.html",
    "revision": "d72fd0cf075f95b4f0e70b14a1676fa3"
  },
  {
    "url": "about/contributing.html",
    "revision": "64131f37a2ea7d2339d01fc2dad9c551"
  },
  {
    "url": "about/index.html",
    "revision": "af73818e46f78889f57fd30e2cb92ee9"
  },
  {
    "url": "about/license.html",
    "revision": "9e2d0a262c6e1ef0d8aa65678b842e1e"
  },
  {
    "url": "about/roadmap.html",
    "revision": "932d067229096151874b545653563196"
  },
  {
    "url": "api/index.html",
    "revision": "bb10af0f96444586eac8c3d45a7dd023"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "e82fe5a7731e97cab6c13d9d9d880cc3"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "f30e7cade3865f57261694218cbd5c59"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "5bdc852abfb30475e0e9d7f56acdb6f0"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "580c208a70199c8ead327d5f8f1a82e2"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "92da70ca8bb1df64c5e2f54ae1ef7840"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "d8d546c2280ad0d2b56ba5c7c61092e3"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "3bb0e7441eda66be48cd26646ab4b485"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "dee5b7a774bcc177694f72d77264e2b9"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "f9c00c617b8f752ff570aae2b5873bff"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "971086429e97db349580fbaa30950dbb"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "e9cea0934649bc0f2b18fc3482aa42e7"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "069d1f3cc46e7facc62d28e7e2ac3259"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "8862d4e9e5d38ef438439d17f512bac9"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "6e4ed75784fb525f290e17abd82b0506"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "56cdd0fc000d7b62a38423c681ee6199"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "e9820a92d9601bcb50385fabf9b46f8a"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "2b8f5f55ddfe0e2d09962aebf787d096"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "660a112efe074c6b466b553ebe9f51b8"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "3f6d7cb6eb36264a7091628038b60cb7"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "c83c77b310602a5e20c97eba4e955d02"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "87f4564007df7db57bffad87a61f93cd"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "a24664326db114206334ac38a082ff12"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "302bf95ac65ad27a1c0a84b76846d536"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "103490725c606d7eca75c5f1dae42a5d"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "554e726e87037e1d5fb90bcda76305ad"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "4f9a38a5e742ec7490209c688d0916c3"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "bffe78f2a3f70393db78ba559b5df85b"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "c2d21c2065d24ea9a4ae27e4c0a68606"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "9ba5d18ed299bd9d311af727e2140aa5"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "301ad61bcbbc8afe7af4f3ff464f17ab"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "f44f6811efb76292a6332682d64bbbeb"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "a65ce7ae819121ffa604a2b4a3a58708"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "20a2ec3fb58b7c0f149594a1413b7e8b"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "1edcf67aeeebb06991a48ce1ba23ad6f"
  },
  {
    "url": "architecture/index.html",
    "revision": "fa21b5eebb75bda4213a8fcc32e2d7bd"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "d42073852516e7964116dbf55f20b2e6"
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
    "url": "assets/js/30.97bd8507.js",
    "revision": "b9b268afcc894b8ec3c4355c633e2f34"
  },
  {
    "url": "assets/js/31.80f7e6d5.js",
    "revision": "b19d7d3f3b0123ca6db49d86c5282866"
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
    "url": "assets/js/54.219da59b.js",
    "revision": "3cf15201b3d4c10656dabbe1e8c99ab1"
  },
  {
    "url": "assets/js/55.69806b1d.js",
    "revision": "8b7ff4e219beac1751aed538f363a574"
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
    "url": "assets/js/app.d3efe105.js",
    "revision": "bd59a404b3340bb7eda530e2f75a956a"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "d330013e363ccd927abaf73890987d38"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "d71a448533955c32dfda91ae9d9dd657"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "e9f33bf58818cc89126e1ea327ecc6be"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "6e82e0d79c40e8416be0f3995627c6ab"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "b2311f82b3c8b637037ec3c09b895171"
  },
  {
    "url": "guides/index.html",
    "revision": "f690a4215407a8ee376224bd17a47f5b"
  },
  {
    "url": "index.html",
    "revision": "aced581075f27aedfa47c49ebef9dcda"
  },
  {
    "url": "tips.html",
    "revision": "ebd46419736efcfb135482a4772e7135"
  },
  {
    "url": "tools/browsers.html",
    "revision": "7974874dc830c4df01fbc7d008e6d992"
  },
  {
    "url": "tools/cli.html",
    "revision": "979d32ca876af704da6378d8d1ca3db1"
  },
  {
    "url": "tools/documentation.html",
    "revision": "ff29de15c326ef782377f9c8321a2fb6"
  },
  {
    "url": "tools/index.html",
    "revision": "c9548948cda37e337653d400c558bb79"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "b0582f5a79ec1581121526c6c55085f5"
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
