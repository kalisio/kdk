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
    "revision": "ed7637aa698d28ab1c28ae76c46c0c57"
  },
  {
    "url": "about/contact.html",
    "revision": "85a3545781d034c12f3a2b5086104901"
  },
  {
    "url": "about/contributing.html",
    "revision": "f9db2eded99e5bf702b6b00d13d08586"
  },
  {
    "url": "about/index.html",
    "revision": "f1f0812e81b3f107662e5ea5bb4d7680"
  },
  {
    "url": "about/license.html",
    "revision": "ecd897a92a4c6e155d05cad50a66448c"
  },
  {
    "url": "about/roadmap.html",
    "revision": "9abae73209a92047795775ea45f309cf"
  },
  {
    "url": "api/index.html",
    "revision": "1be98154d8e7c76e46f1bf4f12817d1a"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "e95c9899c75759bf7ca9680f449a2342"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "7732cef6c86a168c5e8262dc8617daeb"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "a2916886522d81332bd967f80238fc77"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "5726758eea7123d55d2330069456960d"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "4c7f1508b410cbe6a071796c370754f1"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "c4e62180b4a2dbd5c01b7d011257bed7"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "d2cdae9e26f41b2c1c15936272f6b2f2"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "8214880fe96dc84afed91d75e87f6113"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "aaee0f470eb75bbe95dcb81b3e67a979"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "9e4beaf7e329323b3d1b9b2d4374ee8c"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "b89b5447608070c3b846dd27b185e9e5"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "112435f72d0518e2b94cbf8e3413dc63"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "dec10ada041526d3f849e9683a1d8f7b"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "f37019f82da4b9e956a8c529058ab038"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "62b5c052d9d63b1566d703eda052c33b"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "904f2584a25102cd320eb42493b06a14"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "5cabc4cade366db11ab4a2ed8b84e6ce"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "9c5d222e35414d5888d4cc86c510443c"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "c012f9d5df59db41f38ff39d54383943"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "0827781ba88f4e4c8318a66d72cb7a01"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "c032f8b1bc3e7028832d0d0d46b26cf2"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "c2780452db2a376fcff7dbdcb9cc8a3b"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "57a4fc952d29f6c2703e3d7772ad03a4"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "7afb619568b6287bf6d1269922aa974d"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "7fe08abc3bfad30914c70bf5fce7ec3d"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "5ee200ba25d0a5a96424a70974dc1c25"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "4be42ced2fb4fac006e8d43b7c1c5792"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "fabcd32523dce782a6cf9e84205d3cfe"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "6fd329f3d89caea7c3beaad6097eca5f"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "aa89f0631d11b6e66695ac93e0cf938d"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "feca446b5cacd98995dd1505b9c8c1ec"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "08dd269be990d6a1631e74bc5bf06558"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "9a420f85e4f753e557c0d0de49b7b6a6"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "10a567146a18eca7431458dd2c1a40e1"
  },
  {
    "url": "architecture/index.html",
    "revision": "66a667c57b975307f6a438e4b12cf01b"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "72931a3e5db6f4606175d54299255bc3"
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
    "url": "assets/js/21.e779e77b.js",
    "revision": "8cd58f3087cce1fdf43d312fa2375e70"
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
    "url": "assets/js/33.eb2ebcf7.js",
    "revision": "4fdadd4a5ded1c04f9397b84f9675e01"
  },
  {
    "url": "assets/js/34.baf134a4.js",
    "revision": "78c02890d26d3408af39c05c711c3130"
  },
  {
    "url": "assets/js/35.0c845d3f.js",
    "revision": "925811ad0224d211ec9053331cca4755"
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
    "url": "assets/js/54.219da59b.js",
    "revision": "3cf15201b3d4c10656dabbe1e8c99ab1"
  },
  {
    "url": "assets/js/55.69806b1d.js",
    "revision": "8b7ff4e219beac1751aed538f363a574"
  },
  {
    "url": "assets/js/56.eaf76464.js",
    "revision": "b2cc6a222b077c0d419e8afb327744a2"
  },
  {
    "url": "assets/js/57.feeb316f.js",
    "revision": "9e555603d4162742f6c0f2005eb082d4"
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
    "url": "assets/js/app.431cc772.js",
    "revision": "d7ba0598d4012f96b1fda34300a67768"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "34024e8daec8f55c94296005d557a616"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "6eea4778696e49172c159618eaf44628"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "c11ecf1be1b72ea583ebdba938921750"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "6c02c54add14bfc66b7f56cc9b2fbeb3"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "7e6f2115f6245e5911213d40d9dc7cfd"
  },
  {
    "url": "guides/index.html",
    "revision": "43b006285f48c8194860a92c8c2ef8dd"
  },
  {
    "url": "index.html",
    "revision": "57c6b35792ad4fd9d2079b2f1c5fb858"
  },
  {
    "url": "tips.html",
    "revision": "880228386eb37149472419f92d6317f6"
  },
  {
    "url": "tools/browsers.html",
    "revision": "0c01401dda214b268afdd898df768487"
  },
  {
    "url": "tools/cli.html",
    "revision": "bff420d73beec34ca550ae60314253b8"
  },
  {
    "url": "tools/documentation.html",
    "revision": "ac9b8b75ffc358d7d7f23506e79faebc"
  },
  {
    "url": "tools/index.html",
    "revision": "a7b7ff632881dff20848c219a1b039df"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "d84ecaf7ec0adaeb3d746b24e8c9956f"
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
