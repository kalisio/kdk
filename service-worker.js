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
    "revision": "7ac592d163eff1ecc84c1b0e72665f8a"
  },
  {
    "url": "about/contact.html",
    "revision": "dd2926f8ebe016b5adb49a16fbfd56ea"
  },
  {
    "url": "about/contributing.html",
    "revision": "337ffa5446c828f8ae07b5b771a14dab"
  },
  {
    "url": "about/index.html",
    "revision": "9e713adc42088f0866be40ee1af7f62d"
  },
  {
    "url": "about/license.html",
    "revision": "afa69d7f942181ee1abc5c497947189d"
  },
  {
    "url": "about/roadmap.html",
    "revision": "51904db6f6606108247e9b5b76ebce1d"
  },
  {
    "url": "api/index.html",
    "revision": "fef6f659927f0a3951a3ed8749198231"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "8c64c7c6b3ea62170213f42705e47380"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "6d23081d36ff674f4efcc9c38dc037c9"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "4fb07408fd803be9014b3164918ec8e4"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "2f5e267e9f4e42915645c6594b704696"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "3e148488f4c5068dd44f0c819b269512"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "cd200d660f0159774114bf3dcfd4dd14"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "dcc5380d78d42710a615d92b3bab5565"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "60c4b55ee8cd866197219ba1cd039567"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "91fcd52b7d3585a18262bd4bce49bf20"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "2633aafa68488699f1214767e37aeaee"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "80b407c5f2d3920fd9bd2f070004a317"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "71027381d6db33fb09d14006a097d94d"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "d23a17dac10a1e4c6d0c0231f44347e6"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "63a150cf6eb5c0fddf8e4547450e22b6"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "4197c19b9c71c81797c45d0b209d0732"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "09a6255ea95de1407df137d010448ef2"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "e3b06598754b34b972b7a3f7d447f928"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "3c1405b5d9ae25910bb343632f1645c3"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "cd3586ca44b2571d5695c8866696dac4"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "033cf6d8c96494c7f734c20e0d3d1425"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "cfa71afea2fa9b69aa33b7c805a44c90"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "0447c8e6dfc1d5d44e1243a508b07dd4"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "b2b309abb52043d8e24bb8f72ffe11c7"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "d63537570a2381d84c45d99d29dc96f3"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "d6b9b00c689a5d184abdecede36b5e92"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "41ba893f9769aca886e2e91d64e8ad36"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "78929fb1fbe0ddf2ff517948a47b39b9"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "54e6b4283f17f3d906a7d111633ad59a"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "7f4e164f03826b03a04f5395eba1b05d"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "4ec2cd83742d71d250e12f6561700445"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "b47be3c0b32051b855b92f23ceec4613"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "e5565daf331ad0c5e0a8d5c5f463b574"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "d822beadc5c9e866dfe515f55df30ede"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "f2d85dfac31510bd98d3fb67c99db612"
  },
  {
    "url": "architecture/index.html",
    "revision": "2b0ea15661bb6431e9db632d5b91b19d"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "7a983e36f4c5f87c2f6203eab7555586"
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
    "url": "assets/js/10.45023682.js",
    "revision": "89b9a5293c1d0744b2980b8468f47901"
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
    "url": "assets/js/21.55d47ef7.js",
    "revision": "77c0f004897c80e9189b0cd3f7c19622"
  },
  {
    "url": "assets/js/22.97e1088a.js",
    "revision": "9145c4e7f754467a2019f4b7466433ea"
  },
  {
    "url": "assets/js/23.316207a8.js",
    "revision": "28dda16f41431c155f84b0b05f34d275"
  },
  {
    "url": "assets/js/24.3fb1a1e5.js",
    "revision": "fb1e361cd7af66d6fcc186283b738a0c"
  },
  {
    "url": "assets/js/25.ba93b642.js",
    "revision": "b093c786cc54406e5d87ff548d8e9c27"
  },
  {
    "url": "assets/js/26.99d42269.js",
    "revision": "f7f169b01d8b7210d70f5abb147d1fa0"
  },
  {
    "url": "assets/js/27.8237e82f.js",
    "revision": "11aea278383baef4669233d3b03516b3"
  },
  {
    "url": "assets/js/28.79984ecc.js",
    "revision": "c3a9cc3955ae6affcdb38cc9f38384f3"
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
    "url": "assets/js/app.4081a94c.js",
    "revision": "b4472a6f175b0621024d493cc5f15c5a"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "93bde7bef2506c872cf1c33ba5c86282"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "98e6537e32a01113e39440f1dbaae331"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "29157bb8fe2dafff557aad5eea6f5f35"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "4692bfa4b2443c116735623ec0a5fde3"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "1e784cb27b38b5bc38065b2db0c85bd9"
  },
  {
    "url": "guides/index.html",
    "revision": "e4c85394c5badcbb795cfab52cdb842c"
  },
  {
    "url": "index.html",
    "revision": "1ea40bbb14c78deabd57cee77b91aba2"
  },
  {
    "url": "tips.html",
    "revision": "4393c63de3a20b969a7137eb2d794863"
  },
  {
    "url": "tools/browsers.html",
    "revision": "0e3bbfe26b551360b1b8db6f94bbee0b"
  },
  {
    "url": "tools/cli.html",
    "revision": "d24669339f438ff8210f878cf971e7e2"
  },
  {
    "url": "tools/documentation.html",
    "revision": "cd77926a0699e0b0168715c9ed8a9586"
  },
  {
    "url": "tools/index.html",
    "revision": "5be494153acb852f962fa92dc6f60a30"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "0858533768bba212d041806ec4140ea4"
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
