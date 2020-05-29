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
    "revision": "ce93468a4a0b0213c1c5bde022cea1fb"
  },
  {
    "url": "about/contact.html",
    "revision": "96dbd47db800d6b596b57c102a4f74f7"
  },
  {
    "url": "about/contributing.html",
    "revision": "aea4c634ed693b2a4a54cce363837a8c"
  },
  {
    "url": "about/index.html",
    "revision": "0b67243725ed64674598b6194742d796"
  },
  {
    "url": "about/license.html",
    "revision": "cd4ffca5a672ab57adc13b8724c18b66"
  },
  {
    "url": "about/roadmap.html",
    "revision": "2d6412280be3fd2fbb35c08324cd8d38"
  },
  {
    "url": "api/core/application.html",
    "revision": "ea579d7c59b8784da329405625a648b0"
  },
  {
    "url": "api/core/components.html",
    "revision": "b24aff68388840c03098535081f73c8f"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "31004be18d77dd27bcaa3c5975deb6cf"
  },
  {
    "url": "api/core/index.html",
    "revision": "0513c3d2bb955c6622d9515bd5dc673b"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "8579a87a3d7139c5641ef9bae8fd044f"
  },
  {
    "url": "api/core/services.html",
    "revision": "acc17dc53c3fbc3ded0da9aab798db60"
  },
  {
    "url": "api/index.html",
    "revision": "a3819d38131fdcb31a88c450029d199e"
  },
  {
    "url": "api/map/components.html",
    "revision": "d373776bc61f9209bc5d509f53e32d1d"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "69f43c463b0b79e7e7b4bce9d4e6051f"
  },
  {
    "url": "api/map/index.html",
    "revision": "1afadc949064751e851e766d8ed3a179"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "d9044bc0379d44867f14432426dfcb9b"
  },
  {
    "url": "api/map/services.html",
    "revision": "f766bea4760836aa1856b0f457ab07e7"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "537072efd92e99c306779b194b28cad0"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "36a63a2f5fda2d0c0e34d993b08039dc"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "6e72d15d3ac1ea425d62bdf385ff5b27"
  },
  {
    "url": "architecture/index.html",
    "revision": "1d325a12a1f641bea4802dd0f5677406"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "cf579f363f3719c3bb18fa65606cd4e8"
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
    "url": "assets/img/cd-pipeline-android.aac6a2e0.svg",
    "revision": "aac6a2e0ae4e0a08d62434fc4f9e700c"
  },
  {
    "url": "assets/img/cd-pipeline-app.f5ae4922.svg",
    "revision": "f5ae4922e9e2a5263b805ee8a1cd1779"
  },
  {
    "url": "assets/img/cd-pipeline-env.e2075fb1.svg",
    "revision": "e2075fb1bb069e7f46ea7f0a880df06b"
  },
  {
    "url": "assets/img/cd-pipeline-global.bf86d245.svg",
    "revision": "bf86d245695e16937bf9f6e08c38b0ad"
  },
  {
    "url": "assets/img/cd-pipeline-ios.b4f66a54.svg",
    "revision": "b4f66a5494f77e98899d44a066515ed0"
  },
  {
    "url": "assets/img/cd-pipeline-travis.5e40ee62.svg",
    "revision": "5e40ee62f8c213080bcd46106366ccbd"
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
    "url": "assets/img/kdk-workspace.d228efd0.png",
    "revision": "d228efd0427f5ee0027e9557bf11f9c8"
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
    "url": "assets/js/10.74768a31.js",
    "revision": "aaca779029d771f1563082676eb8ba71"
  },
  {
    "url": "assets/js/11.4fef0934.js",
    "revision": "614f3054990bae0e5d8f87cda2affeab"
  },
  {
    "url": "assets/js/12.e6c05e23.js",
    "revision": "15b1348dd55c3ef50773845ab8cc46c5"
  },
  {
    "url": "assets/js/13.ffedf90b.js",
    "revision": "255888cbc4cfeee97e971e69dcf2cb84"
  },
  {
    "url": "assets/js/14.51d9265a.js",
    "revision": "1f13f7a6cc00e1e017912f543bf84691"
  },
  {
    "url": "assets/js/15.9c1bdc55.js",
    "revision": "db440fc71da4ef40c03e2c1d1a73db0e"
  },
  {
    "url": "assets/js/16.b948ed4c.js",
    "revision": "402eb93b3b98f380d2bc14111c3c3e83"
  },
  {
    "url": "assets/js/17.3a4ac53a.js",
    "revision": "689819a56e3447753d3ea596d9b44a86"
  },
  {
    "url": "assets/js/18.c12f7e5e.js",
    "revision": "60e83ff0cabbf14a418caf3db955583e"
  },
  {
    "url": "assets/js/19.aa85194c.js",
    "revision": "2b9f85505c8dee9e7a64f542122e52b5"
  },
  {
    "url": "assets/js/2.f94850b7.js",
    "revision": "fabcb98c04e2ab3c6f1fd0d4032c8e40"
  },
  {
    "url": "assets/js/20.84fda26f.js",
    "revision": "45f2eb048731728614d4ec97b944dc7d"
  },
  {
    "url": "assets/js/21.2cfc6cd7.js",
    "revision": "2b8dffc8f8a0e5544b0156d83064dfe3"
  },
  {
    "url": "assets/js/22.642f0cc8.js",
    "revision": "d1e6fef096a8c5c24ce3b1982a05c2fa"
  },
  {
    "url": "assets/js/23.89d9ba1a.js",
    "revision": "2983f04e7a5c18f774c85e0661efe2d4"
  },
  {
    "url": "assets/js/24.0f0e5a39.js",
    "revision": "22be2dc09b9b6340acb5aabbd6987bdd"
  },
  {
    "url": "assets/js/25.ab345d25.js",
    "revision": "7592255800e05ad6d3ac1fc5816647cb"
  },
  {
    "url": "assets/js/26.a2a1a3d8.js",
    "revision": "9d15bca72bf1cf8ab774d3cc9d16783b"
  },
  {
    "url": "assets/js/27.e6333fc3.js",
    "revision": "7b8180b0722db2a67b22c1cb1f241965"
  },
  {
    "url": "assets/js/28.04c0d469.js",
    "revision": "5dc871e110edb3c582c4ef9ae143244c"
  },
  {
    "url": "assets/js/29.69a03c57.js",
    "revision": "c9303342ea50e92fd8ba26f6df098945"
  },
  {
    "url": "assets/js/3.98afe582.js",
    "revision": "7ee0648d647a9c2d4aebc1df8f414230"
  },
  {
    "url": "assets/js/30.098088a2.js",
    "revision": "fccb76661d8a753a9da3061f90fd3c81"
  },
  {
    "url": "assets/js/31.34fde21d.js",
    "revision": "06cfed9ccce3641175ff5955b4982e54"
  },
  {
    "url": "assets/js/32.57472f2d.js",
    "revision": "69e8a09bfa17a5d7c1353a3c31c60522"
  },
  {
    "url": "assets/js/33.5028b8d6.js",
    "revision": "6987e8bcdaf27fdf4148b480332e07dc"
  },
  {
    "url": "assets/js/34.a8d3e7ad.js",
    "revision": "63973938d89f130bd0eb25677270ce21"
  },
  {
    "url": "assets/js/35.a40edd18.js",
    "revision": "9cb0b2dcbb36df5dcb378e5ca27db01f"
  },
  {
    "url": "assets/js/36.2cd45299.js",
    "revision": "eaec0a7998cbc815d6b951bd175dbbb9"
  },
  {
    "url": "assets/js/37.7b970edb.js",
    "revision": "fe89cdc5976f58b02f23ba12a4579877"
  },
  {
    "url": "assets/js/38.d7c1395e.js",
    "revision": "b23e733dcd862f8ff07a25d26feac37c"
  },
  {
    "url": "assets/js/39.22af37bd.js",
    "revision": "31c5a2a540bf3e6cfbadd23438d9d802"
  },
  {
    "url": "assets/js/4.be43b037.js",
    "revision": "e33277668ceeb7e8f836b0e1e9e440b2"
  },
  {
    "url": "assets/js/40.13e84c99.js",
    "revision": "383c554b46446b47e7c83b9304099813"
  },
  {
    "url": "assets/js/41.56be9c58.js",
    "revision": "7fe78e2b1e0c2dfdadc5bf59ebce0985"
  },
  {
    "url": "assets/js/42.7d2d9327.js",
    "revision": "ad2ea11867a7b3e95783fe0037025420"
  },
  {
    "url": "assets/js/5.6426a20c.js",
    "revision": "4ab2c7d0b7e2f0ab368d3b03d5ec0783"
  },
  {
    "url": "assets/js/6.89a6af54.js",
    "revision": "ad7a7293bc3a32f31d124cc935c159f5"
  },
  {
    "url": "assets/js/7.f7b7a61c.js",
    "revision": "5e5400ae042b2e47fc9d038630492c66"
  },
  {
    "url": "assets/js/8.7252a3df.js",
    "revision": "7a573aefa86bab92edf58ee38612e02a"
  },
  {
    "url": "assets/js/9.06510067.js",
    "revision": "507d5a414fd100e2b04239e81051154a"
  },
  {
    "url": "assets/js/app.2c65d75a.js",
    "revision": "c51de0932e714a2b16434b80808c12c8"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "c47f7009e9317b1823cc7ccadac953e5"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "fad3a2268869a1a69bca12ae9ab3096e"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "84c94c7b2a14a2df43d16bac936dfeda"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "74e69216984ba465158718b155abab11"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "fbac15b10a4fa801a6e3ef84951cb754"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "0bae714515a74dee916107c3611d97ee"
  },
  {
    "url": "guides/index.html",
    "revision": "0b1ccbaaa19e62bc6bfc3a70c23edb37"
  },
  {
    "url": "index.html",
    "revision": "2d2596b8896f5c62bab0865255555f8c"
  },
  {
    "url": "tips.html",
    "revision": "c97addcb17089563655cbb869fc8a0d7"
  },
  {
    "url": "tools/browsers.html",
    "revision": "db61807d9f7c46c852be21f594a98ba8"
  },
  {
    "url": "tools/cli.html",
    "revision": "1085052cbc7f1da0c7783ceec0e0e4fd"
  },
  {
    "url": "tools/documentation.html",
    "revision": "c6c0ade398294caf4745a472014c0418"
  },
  {
    "url": "tools/index.html",
    "revision": "e01369efd70cf4d7f6012224edc7a630"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "64be25b717f06d9d92a0487b8f8eca34"
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
