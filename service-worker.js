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
    "revision": "f71fa8c0f2f7a5a765509352cb5259a8"
  },
  {
    "url": "about/contact.html",
    "revision": "547884b33cc670edba6b59caa289a2a8"
  },
  {
    "url": "about/contributing.html",
    "revision": "991d8a10bacbab5b0ae332e2564e7c9e"
  },
  {
    "url": "about/index.html",
    "revision": "882df76ecb59c3586f7a602e84311989"
  },
  {
    "url": "about/license.html",
    "revision": "7069c12f9ec571f73838cce3820408f8"
  },
  {
    "url": "about/roadmap.html",
    "revision": "dde9c7f34cc4d2970a9ea87a152f6aa3"
  },
  {
    "url": "api/index.html",
    "revision": "9e04be14c8045616948713b05ba23890"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "4a6648b3cf61d23d5ac0ddb0bcc7a250"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "c439e7de70519d2a13f3a935aa78ff4b"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "7a8de8e68e89ef7e633bc4f746ff4559"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "34545271e35418f1f4caa380a11121bb"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "daf486a958ddc4b2f20cf6b4acd96551"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "d3f05791cf1dbfbac77b09a4b68a7604"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "6232fb4e387ac983e98d5b0543069569"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "3c2fab193f5726b97182fd9cc237c428"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "7c7ed9f7719f0b8223673b9d2da22365"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "14e4498ce8658edadd77876841f007fc"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "d9b97a685a93ebb7fb84123426907aa7"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "052f0a5988fd5b82ed56d8a479a9ed5b"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "fac40dc81635920768d8dca6471510a1"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "cafe95164a16135d1fbc6f8abdf4eb57"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "7d3781f26dc6460d2886b76ae3dce735"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "4c182d0ad919f192c06f443fec8e9566"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "37beaa8306beb8fb961a0d0b6af15982"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "3750b3e40c9fc2fdd3f5078350e1a26a"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "474af70ba8bbd369fbd4b8c7aee5b33a"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "0960630441abe8ed847886c068aba973"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "1907b5f076e9e953c8f42bfd4a8f0d3f"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "237503e77d0ef7950c697af27d9d278f"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "d732b61e1bdbc30c1af70d73332e3ad8"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "302a2c7d0d6da50170098fd4ad894e52"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "410d329612055ce807d71a0891f42fe6"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "1275f99a5d797efa7fbea8b59a087567"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "7d7819fa46bd548513a7730a151cbb93"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "6f6179d89cb44fdbd5b86986c054e179"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "e36b495b55ad3734d2ac9d5cfa668bf3"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "bc367e0dc2757df3ce1d1c8c7ae910fa"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "fe3c67158b1a44a319e6a5fdd5fbc150"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "9abe775b6936bc1b1ad02240d304815f"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "50eae1faf0704c29b356f12ca5ec4409"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "b6c66d67cc55f63a8e2285c45a86ec5d"
  },
  {
    "url": "architecture/index.html",
    "revision": "b7fd737f153bdbdb3cacd0640e2cad02"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "8dbcc28ee9f628ca7eee1172905d526a"
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
    "url": "assets/js/42.85ae0784.js",
    "revision": "b6ea5cb650e9377c13d9da891f5be37a"
  },
  {
    "url": "assets/js/43.0c0e06bc.js",
    "revision": "ac813132c49e4b9cc497dea8ee3106bf"
  },
  {
    "url": "assets/js/44.95142e7c.js",
    "revision": "59c205ab676de0f635e0a5b8116f6fd6"
  },
  {
    "url": "assets/js/45.c9cb53c9.js",
    "revision": "0bf27b959a7954b72a6596f6394610d5"
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
    "url": "assets/js/app.44006c28.js",
    "revision": "9321a459764ff7394b63c9f41c4ffc22"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "b2b1ac619930f28174601832f495702e"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "078315e5dd6a3dc97c83d00fc263d8e6"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "1a35a477be9fbc5f19c8d48fa11331ee"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "e570fc3583e59b22ea0e9836cead82a4"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "5b155b9169e16ca99d9207c73c1e487c"
  },
  {
    "url": "guides/index.html",
    "revision": "e13f46d0ec46336f047734fb8889562b"
  },
  {
    "url": "index.html",
    "revision": "4ed3d40202a3ed46e7ac6ff2cd286af9"
  },
  {
    "url": "tips.html",
    "revision": "8ebbcfefa61f8ce9d285045c1fd829d1"
  },
  {
    "url": "tools/browsers.html",
    "revision": "e934d9acebd943c098f25e0e915f8811"
  },
  {
    "url": "tools/cli.html",
    "revision": "68837b81c5fa5477edc6e7717d9e9099"
  },
  {
    "url": "tools/documentation.html",
    "revision": "8fe97bbb2eb06981945df9b1bf48ebb1"
  },
  {
    "url": "tools/index.html",
    "revision": "daf467c5cea0c67f9e9cd4aa755a803b"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "bbe2a7d35e60589ef332a23ae2d3dbd5"
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
