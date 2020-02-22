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
    "revision": "e5b87b05b34fd470ac7a73d2452315b8"
  },
  {
    "url": "about/contact.html",
    "revision": "38f0fa2d320a4b4738ab3ff2248b2e4d"
  },
  {
    "url": "about/contributing.html",
    "revision": "4d94483f90b7fe61c3e62de9e283e0ae"
  },
  {
    "url": "about/index.html",
    "revision": "a502c4c7e5975e585c5c2841d1195d14"
  },
  {
    "url": "about/license.html",
    "revision": "ca70763d3b0a521185c5a33696a0b10a"
  },
  {
    "url": "about/roadmap.html",
    "revision": "bcf6fbc74e72ed0e7f4dbcb030083262"
  },
  {
    "url": "api/index.html",
    "revision": "ed9e90c95607d156ff99651a533d6d0c"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "a68b06c64f7f147a460a6dc4c8147e5d"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "de301ff57ec3743132659bf3b8edab35"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "a5704ecef588b8d1e55c2468e3325ed5"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "837a2f5ecef4a92e633086166fa7572c"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "562b12cb3c4082ec16013a1b63210d80"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "9044c6e7daf6073267e7c9555e0f6e36"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "04f54b8bf2b4070e23d9d50a7179022e"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "1d88f3447f3fee14c839f1eac25fd8d8"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "e1a581ccaa88da8a768c91ff76cfea28"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "12cb49d028ff3bf56de198b69e3fc091"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "0b8eeb001c08168d9d2ebf39632f5ec0"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "d16d67a2375b38f60d80723c5389fce4"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "9f8e761d333ffa37c4232ac90813c865"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "f3e0d917de1ae386065da6328487de0e"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "328f6a7f187394494f9f017f8c54cfaa"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "cc857f97a5ab9088889af81e53bc0e9c"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "94b8313847e5adb158ce7263948c507e"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "d8c9d6baf71912b067d595599829c9ad"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "27f42b56e5624c4b699e2b39ae77d732"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "51ec076a42624ce43d5b7f92ddf16a3d"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "afc3e515a20252e88366f41038ddd02e"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "81cb9f8e4e05df6972a943493b706603"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "1aa0d1f952d720a1937039225b977cf8"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "afd712835a393ca6364a1e8f7f9f2306"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "26026ba58d9e7234e76dc1dbb2a59018"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "f554ee19f918bbc6a549884e689ed10e"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "cff7525757c7e86a05a7c925b9e6cc3c"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "6e434465d3c8edbccbd58d10deb2cd95"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "bbea18b71e959a4c2b5a109933a3def6"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "cdc481a7eb135abce92c4e05ed4dc18c"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "21a07592e64c9bb4fc1ee83514dec42c"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "113c18e83d485485e6bf49757a707677"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "9a2e2aec504167be20cf2f1bfcd8925c"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "6624de1587386b41a041d8a0bb52c00c"
  },
  {
    "url": "architecture/index.html",
    "revision": "1180701788b28628a913f32dd20b62b0"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "9aa5f5d9e05da753051b1f3cebdbbced"
  },
  {
    "url": "assets/css/0.styles.1bc60b28.css",
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
    "url": "assets/js/11.9db54c5d.js",
    "revision": "7090aa5534aef4996326f4b751e8e632"
  },
  {
    "url": "assets/js/12.704e0e34.js",
    "revision": "d078ec69561e97cfa8af7f1cfb4d74bb"
  },
  {
    "url": "assets/js/13.a59a3625.js",
    "revision": "f674cce795255b71e0a42362ebac0533"
  },
  {
    "url": "assets/js/14.92653908.js",
    "revision": "164976178238431b8aa6b4e8c6d33929"
  },
  {
    "url": "assets/js/15.bdf19c05.js",
    "revision": "60ad59c09ee686167c81cbc62b2bc810"
  },
  {
    "url": "assets/js/16.24ad186f.js",
    "revision": "d74ad45d48e1ccdbac6d537c372246e4"
  },
  {
    "url": "assets/js/17.d4638bfb.js",
    "revision": "0fe4f9a646102d2f8bb33ddecf83593d"
  },
  {
    "url": "assets/js/18.ed1b9b65.js",
    "revision": "aa090bcbf11c0776b7678230d4bb8778"
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
    "url": "assets/js/20.d1c2dffc.js",
    "revision": "1bd8656b76cbf7e9db6317b277453e6e"
  },
  {
    "url": "assets/js/21.b6c146f1.js",
    "revision": "1f364fd8dc63ebda03b82d21226a2bf2"
  },
  {
    "url": "assets/js/22.0f7d9836.js",
    "revision": "4133d23c7089829a0741846e2c5be09b"
  },
  {
    "url": "assets/js/23.5817e569.js",
    "revision": "c49e310d455416542f79ea9b0ffb2269"
  },
  {
    "url": "assets/js/24.69eee396.js",
    "revision": "e57c6e8b9f2850eb16739a5ad28cd65f"
  },
  {
    "url": "assets/js/25.18fcad0f.js",
    "revision": "c47a1e6033a845c2406408f80552b48a"
  },
  {
    "url": "assets/js/26.4a49b7b8.js",
    "revision": "253eb8a3a05f6eb2cf1d37556a46e8af"
  },
  {
    "url": "assets/js/27.33cea648.js",
    "revision": "a80925b6c664eebe22730e1141e25b94"
  },
  {
    "url": "assets/js/28.1a2f515f.js",
    "revision": "9726f8cfa4829152d93857159fc4ca28"
  },
  {
    "url": "assets/js/29.ad3308a5.js",
    "revision": "2d7952bc4332b8e46d880fd4808530d3"
  },
  {
    "url": "assets/js/3.4657eae2.js",
    "revision": "3b77801a8f704a53204b15ec3373de0c"
  },
  {
    "url": "assets/js/30.90181622.js",
    "revision": "376123a835acaeb45946a983e1e56116"
  },
  {
    "url": "assets/js/31.c7f6648e.js",
    "revision": "b90e64b97f2a7b2395fd6bd3749ede43"
  },
  {
    "url": "assets/js/32.f66dcf60.js",
    "revision": "559323943941e0db9760dd0212f3d291"
  },
  {
    "url": "assets/js/33.52243ade.js",
    "revision": "db853e5049781802bcb02240bb7cb7e4"
  },
  {
    "url": "assets/js/34.8509b0e2.js",
    "revision": "d84175c8875693587c18d27b63608c52"
  },
  {
    "url": "assets/js/35.cd8237ac.js",
    "revision": "4c0b5c1688ac5043677174c0fb9587be"
  },
  {
    "url": "assets/js/36.bdb63855.js",
    "revision": "5c836e1167fa6138f8b4c04f8658a71a"
  },
  {
    "url": "assets/js/37.dbb3b628.js",
    "revision": "3f3a1faeb7eb644e38354689bc22a111"
  },
  {
    "url": "assets/js/38.cbe4a852.js",
    "revision": "0e59418e11e4d7b07ff4cfc463196a1f"
  },
  {
    "url": "assets/js/39.66f0824d.js",
    "revision": "e82635416888577e41189339254e1a3d"
  },
  {
    "url": "assets/js/4.9cbf7c44.js",
    "revision": "109d39bd4029b1da0309d6717d43a6f7"
  },
  {
    "url": "assets/js/40.4696d793.js",
    "revision": "44037e2ea71ac0a01688c04fed5f6262"
  },
  {
    "url": "assets/js/41.0a960f8e.js",
    "revision": "26a16afdea38e1862bbb956c4f76f79b"
  },
  {
    "url": "assets/js/42.cace9dc2.js",
    "revision": "39ad50cf62edc64f00d3f848d2b38578"
  },
  {
    "url": "assets/js/43.c9335255.js",
    "revision": "a76e0208cd3a0c5ea33af135c539ac20"
  },
  {
    "url": "assets/js/44.bb658ff0.js",
    "revision": "c5ea42d37ed43ab5a8a927ce18572841"
  },
  {
    "url": "assets/js/45.6ad5b445.js",
    "revision": "fac76761e6f17bc6d5b9dc8a3ff4122c"
  },
  {
    "url": "assets/js/46.b6ea5d57.js",
    "revision": "2e523e59084ea26a88b4850d2b1b6a8c"
  },
  {
    "url": "assets/js/47.7823adbb.js",
    "revision": "d41f0b9191b08af3c554a1f9a2b324a3"
  },
  {
    "url": "assets/js/48.5b736648.js",
    "revision": "5ec97aa4517fa8baeb7323d55bddef3a"
  },
  {
    "url": "assets/js/49.80f39f38.js",
    "revision": "bef5691132bc5e3b7834097f311d9c8c"
  },
  {
    "url": "assets/js/5.64ce21b5.js",
    "revision": "8f2b03374bbaefbf92104f67e0841263"
  },
  {
    "url": "assets/js/50.4117acc8.js",
    "revision": "3cad4ebf08cac8f3f88ed1bfd702e131"
  },
  {
    "url": "assets/js/51.16cd68c2.js",
    "revision": "5b7d2438a8e548153c096af6e89ed1b6"
  },
  {
    "url": "assets/js/52.a9d6be1d.js",
    "revision": "db0c1dea0cc93f1ed428052c5cbd7c64"
  },
  {
    "url": "assets/js/53.da082373.js",
    "revision": "e1575a225b4ebe3f1ccd8f447be94258"
  },
  {
    "url": "assets/js/54.b6d78715.js",
    "revision": "d0aa40ad6178b143392d1f31777efed7"
  },
  {
    "url": "assets/js/55.2f75098d.js",
    "revision": "42437282efc1265ce1e57c2f3e851a25"
  },
  {
    "url": "assets/js/56.30bbb581.js",
    "revision": "f97a348563184b1e3319bba7b5cc9b67"
  },
  {
    "url": "assets/js/57.765b74c4.js",
    "revision": "73290bc3ff04c6ff0813f92904dc8be1"
  },
  {
    "url": "assets/js/58.6a630b00.js",
    "revision": "76b38272fa0bd69e7b66d494f1fdb47d"
  },
  {
    "url": "assets/js/59.a6b3ca85.js",
    "revision": "f19e09f1af3750de11370559e4300d27"
  },
  {
    "url": "assets/js/6.fa4fed56.js",
    "revision": "a71b2bfabf07a76512b3997fc8cb6735"
  },
  {
    "url": "assets/js/60.85ae165b.js",
    "revision": "b117968be2f1c6a478deb914aede535a"
  },
  {
    "url": "assets/js/61.9c935a85.js",
    "revision": "c7620be444870e5a2d46bac7e41aa3b9"
  },
  {
    "url": "assets/js/7.9f4cdb42.js",
    "revision": "4855d3dd0909443144f54858b3762f7b"
  },
  {
    "url": "assets/js/8.93a56dd8.js",
    "revision": "7917042f61dad2382c623fba3294aad4"
  },
  {
    "url": "assets/js/9.a87d5c2f.js",
    "revision": "814a6051a8c3700a1580a984f9dd80fd"
  },
  {
    "url": "assets/js/app.eab2142c.js",
    "revision": "bb700ad316c8684cf33c4cacfa144a9b"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "87b7638158e5139e9b05e4399b6f9466"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "a58d2e9c2f512100022c78583645fe5c"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "783cfe5f3106fe88d06b1a32a185a128"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "73ea8b20b7434a66d2cc28bc0e1c4c90"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "63593401c730ba0b17894be214f9dd0c"
  },
  {
    "url": "guides/index.html",
    "revision": "1cdedd6515479b99a772279da667fe02"
  },
  {
    "url": "index.html",
    "revision": "10b0e87ab23cf3da82510b73f55cd25f"
  },
  {
    "url": "tips.html",
    "revision": "c09ce84b3f3649a9ae93539e6c12a634"
  },
  {
    "url": "tools/browsers.html",
    "revision": "d8696904d94d30d11ca43da64d2b6fff"
  },
  {
    "url": "tools/cli.html",
    "revision": "10f5daf1bc41b0b131963ae84b9316ec"
  },
  {
    "url": "tools/documentation.html",
    "revision": "65a2300808409970694267397ff65e96"
  },
  {
    "url": "tools/index.html",
    "revision": "9dbdb0418d8f8ec84141a8c6ac22f19d"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "250b471d81d2747921697ed21248158e"
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
