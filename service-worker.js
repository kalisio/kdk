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
    "revision": "d784de35f27cf10329cd9bddbe14807a"
  },
  {
    "url": "about/contact.html",
    "revision": "573fa73fdc1c1ae30125d8f2d7c70536"
  },
  {
    "url": "about/contributing.html",
    "revision": "c3f0ad74032f65b4b4d79071f536f030"
  },
  {
    "url": "about/index.html",
    "revision": "491c283de406e91961b42bafcd15c801"
  },
  {
    "url": "about/license.html",
    "revision": "f1278c7cdff3f3625eff7f081aacef0f"
  },
  {
    "url": "about/roadmap.html",
    "revision": "3ccdb3ad720d01132a77b77badf8284f"
  },
  {
    "url": "api/index.html",
    "revision": "2e6dbed5df694b0b94c4b21a0ca0aaff"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "29bc7fcd7761b5e384b67b405bf0b551"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "f90ad9543804c87fe9d893bea148c766"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "43244257402dd9964612ce04c3abcfb3"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "79e698ac5bed3b1544e20f8ae4ecbe30"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "71951ee85bb226114416807cad1b483c"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "be3e3f199487e0e840edc7fcee8921f9"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "bdbe6385cfa9f2fc447ee8b316127acd"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "99484c7cb5fb295e88d5f4d355c91220"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "3ed91311444acb5420ba4b649eb0c600"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "bb93313e05f6b12884e77ac1d3507604"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "d81ae66a31dc2dcca6b8bd4e3abab834"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "b99e80fc1dc22e536429ef501357ff1c"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "ed76b6506d1175bb5ea5b65fb4f426f1"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "79d6bac4cd2558f6bf61d2a816d70eb1"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "8a61c2ddb4e9b6f82466574a29c43b03"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "25fcb95150a698bb616611b884f1f7fa"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "2ef111baeb1c098a6fe518baff054791"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "8a36e565bd91d38e35f0044a89e70feb"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "74dcc8665f13bf096717055aa00eaaa9"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "ebaf71663791a77edfa0cd86801391a4"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "ad0b4722fc8680426e39b38e9f5b6c94"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "c0949bdfd60ee8aebfd11eeeb29c5047"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "c39b5f62f5ea66ef1d9c6d8417d5237d"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "19c276b124bcb25059db7ee83ec959ab"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "a07d3694107d395acaae0a1234e51889"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "34d4c383fe62d9e868b18678f650b3a5"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "8ec3fd4dd19180360df2492814603fac"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "7cbc04b64d2a62c16e425667416b6021"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "0f71f414c0549cfe0afc022df417c40c"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "a8a3236d67fa88a89380fbd191b58772"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "342ba1ad504c59562c8628f79e6f798b"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "a57f2cee77a5bdd4a6e4f034454fa4fa"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "424750e358cc933898edc1eba683cc27"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "efbf6685f460cf634004b1a91a7edea3"
  },
  {
    "url": "architecture/index.html",
    "revision": "a00d738fc9376ba19ca23702e99f9f72"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "d0bd5d5f11e6bd8d613994c17b9b6f23"
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
    "url": "assets/js/11.5abb5e6d.js",
    "revision": "d856604ecd0395fc296c4b45510e0ab7"
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
    "url": "assets/js/20.21f9278b.js",
    "revision": "8639476cd5cced22e90f9294a410bda8"
  },
  {
    "url": "assets/js/21.32f22864.js",
    "revision": "5e14fbd63bc234c25511704b7e93e520"
  },
  {
    "url": "assets/js/22.97e1088a.js",
    "revision": "9145c4e7f754467a2019f4b7466433ea"
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
    "url": "assets/js/48.5b8858e9.js",
    "revision": "ceb3f36beaf7a7615ca759e998301f34"
  },
  {
    "url": "assets/js/49.7a5980f4.js",
    "revision": "ea0be526aaf41df654a3c6ef251032d3"
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
    "url": "assets/js/app.15e893ee.js",
    "revision": "2f00f4b570f78b0fd7bcba34bac7f0eb"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "c7d8068333d983aa07b6f7ab901ceee3"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "d3a814c9d93b8c979705d4cf6ca977a2"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "68f00fb7ad4b6008d1f59b1a7c2519a3"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "2253b3f74ce0ecf29510014567fdbfc0"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "2263e783d892ecfef58d0fb39717bd53"
  },
  {
    "url": "guides/index.html",
    "revision": "1d3bd35044d90f052d033fab41f36e81"
  },
  {
    "url": "index.html",
    "revision": "1bd4503e31cadb7aafcacc985c8c1d71"
  },
  {
    "url": "tips.html",
    "revision": "71e70c21c8b61eedb5d7965acfb303e2"
  },
  {
    "url": "tools/browsers.html",
    "revision": "13b2a2841106d6b7242cfa4619bf234f"
  },
  {
    "url": "tools/cli.html",
    "revision": "54b8151b83a02679d561ba086b3570c9"
  },
  {
    "url": "tools/documentation.html",
    "revision": "35dbe35f227794b528cd423e154b3a83"
  },
  {
    "url": "tools/index.html",
    "revision": "219d75950fdd9a9704930641829dbd41"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "a5aa9d07ba28e517977c3fba94465e16"
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
