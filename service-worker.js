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
    "revision": "c67f8da90414fd096ec71f71117aab9a"
  },
  {
    "url": "about/contact.html",
    "revision": "3a2e00749e95d7f8a2409d47764d1752"
  },
  {
    "url": "about/contributing.html",
    "revision": "0cbc59c93d0880b903bdbb6120aec7d6"
  },
  {
    "url": "about/index.html",
    "revision": "76215d988d042eef85b135849d1bac18"
  },
  {
    "url": "about/license.html",
    "revision": "29806604cbed8317c89ac0d366a4f02d"
  },
  {
    "url": "about/roadmap.html",
    "revision": "b97924f16601094039ca3bce7a08d1f5"
  },
  {
    "url": "api/core/application.html",
    "revision": "2e8e2d7623c8288a4943916c939f1d6a"
  },
  {
    "url": "api/core/components.html",
    "revision": "7e9ceda90b04bfad80e5b0f01284a120"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "83970ef098dd284b0b7a4f0763abdc81"
  },
  {
    "url": "api/core/index.html",
    "revision": "a756c780d6c62473044d7928a6766d7a"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "03441243fcdedaf121249095f39a2f46"
  },
  {
    "url": "api/core/services.html",
    "revision": "ee8e1b7297c4f5d775d163a0e2ceb5c3"
  },
  {
    "url": "api/index.html",
    "revision": "11c973338535e85af4a47427ec23e533"
  },
  {
    "url": "api/map/components.html",
    "revision": "d48957b0d82225b465edefaaf4b5c641"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "3a1607b8ba4fd1b5bed1ad359819b106"
  },
  {
    "url": "api/map/index.html",
    "revision": "10ff68bfc5316648b2bce1fa48dd48dc"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "4793c061a5d46d2e9e30bcb5a6a6231d"
  },
  {
    "url": "api/map/services.html",
    "revision": "21c553604dbbc2e7a7c59e87bc8c5993"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "515331fea60b2dd6780c493f2d903fe1"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "19a3d76267b3ba6907e075c92c596844"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "85268967762665670719cd428942010a"
  },
  {
    "url": "architecture/index.html",
    "revision": "ae7e163ab7f03b549c1216e03ad9821c"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "a51249f65e3cf09f6c3713d7e2ffbbfb"
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
    "url": "assets/js/app.50827049.js",
    "revision": "d1dac5aed4dffd8afe198895b3af3c2d"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "5fce6128bbe10086ce553e110c1511ab"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "22cff87fc4a5347f6f62372f0c7850c8"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "746d2af109ce9ac35dbc6e18e5c1bfe7"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "7e1a42f7aee9aa86b4f1865680e5d8cf"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "c35e1842119a40bd6703c8ec80c46a98"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "62587a9130173e6e7d3253b446e37566"
  },
  {
    "url": "guides/index.html",
    "revision": "3c1414e022a17dcbe086e0624087229c"
  },
  {
    "url": "index.html",
    "revision": "c4460b2da2961aa49b68d5d097e71ac4"
  },
  {
    "url": "tips.html",
    "revision": "2650a7f684830bf8a9c6ef43f0a4dff7"
  },
  {
    "url": "tools/browsers.html",
    "revision": "5511283e2055036d7ab6a966838e3fcd"
  },
  {
    "url": "tools/cli.html",
    "revision": "a5508c3bbcf60a37ba09a9adca39db04"
  },
  {
    "url": "tools/documentation.html",
    "revision": "29fe7f9f9981b3cc3b3f57e4441d2723"
  },
  {
    "url": "tools/index.html",
    "revision": "f5e80f42f49f15ea77a4ea77b5efcc9a"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "1074740ffec3bf159c6291068fee8090"
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
