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
    "revision": "33e900393fab19131f242b52198128a7"
  },
  {
    "url": "about/contact.html",
    "revision": "bdd8b2b656c34ec46ac00b8ebf17db59"
  },
  {
    "url": "about/contributing.html",
    "revision": "6182ac2d12b06472b4bf023d3f565570"
  },
  {
    "url": "about/index.html",
    "revision": "370dbc6186a5cf010af3ca3a6be73fe2"
  },
  {
    "url": "about/license.html",
    "revision": "41715d7724a7ad6c32ba238cf4f515dd"
  },
  {
    "url": "about/roadmap.html",
    "revision": "41ad87033c19fd71ca81b76701f4aaeb"
  },
  {
    "url": "api/core/application.html",
    "revision": "e81db4b9ef50c79e2e441d1075e681bc"
  },
  {
    "url": "api/core/components.html",
    "revision": "5347686f9423605ac0f1bc64381573c9"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "50c08cf6b12ef0dfca33fa2bd3a0a018"
  },
  {
    "url": "api/core/index.html",
    "revision": "03f71e5e25f6eaf13432f6072a0c672b"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "a2e15252c8f88b27733ceaa2dadbfa80"
  },
  {
    "url": "api/core/services.html",
    "revision": "359d29a6fc324e5539eda893207d5a9e"
  },
  {
    "url": "api/index.html",
    "revision": "e2b2e9e2ac14bdcf928554a4260459bc"
  },
  {
    "url": "api/map/components.html",
    "revision": "0492188001efdb09652962f0424af633"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "347d3383003b88586a36e67c0fbae8d5"
  },
  {
    "url": "api/map/index.html",
    "revision": "baa3a4be4a819cc8ec27d033260ca83e"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "eb4d29770b2d505d42a84e03c3422cab"
  },
  {
    "url": "api/map/services.html",
    "revision": "9aac80376c8d221c4049076778c49161"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "aad5f4024ac622f09e180f443b83dca6"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "0fc41288960b7a14375ebca095f3d9be"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "fa74ac0f16a63d4e1489f3d8a6bc31e4"
  },
  {
    "url": "architecture/index.html",
    "revision": "fdda27c05f3f32914d2190b273aa4bf7"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "97e2011b8200b0b6a54dbd9be18edd20"
  },
  {
    "url": "assets/css/0.styles.be5e49f6.css",
    "revision": "fae068808c1c3a8f81a1b90be35d1766"
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
    "url": "assets/img/alert-data-model.77595bb5.png",
    "revision": "77595bb53c67ef3aa32e8455a15f4cd0"
  },
  {
    "url": "assets/img/alert-hooks.a29b1547.png",
    "revision": "a29b154748a226fbbe8e6a589aa14012"
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
    "url": "assets/js/10.f4dcd1a0.js",
    "revision": "cc8369e0169f7684013ecbd4beb7c8cd"
  },
  {
    "url": "assets/js/11.88b498fd.js",
    "revision": "53a58bdc0f4504bd4a43c639cff4c1f1"
  },
  {
    "url": "assets/js/12.cccb2871.js",
    "revision": "e9d3fc210b10c5926b79138707ea4a0c"
  },
  {
    "url": "assets/js/13.6eed20c2.js",
    "revision": "bc89fbadf319f76ce0393613b2c8e5e2"
  },
  {
    "url": "assets/js/14.14668525.js",
    "revision": "0ba1b6601f93c14f42c53d8e108b1ecb"
  },
  {
    "url": "assets/js/15.82e562f1.js",
    "revision": "3029c0771a41a88dc78424a87954875a"
  },
  {
    "url": "assets/js/16.3f18c4e0.js",
    "revision": "58b291edacb80a4ef492cf22713b404d"
  },
  {
    "url": "assets/js/17.3cd41740.js",
    "revision": "c088fe3ca867bb475a46d4a2e0cee909"
  },
  {
    "url": "assets/js/18.782edf67.js",
    "revision": "3a0cb7cc2961ee5ff5e7de232b3fd1e8"
  },
  {
    "url": "assets/js/19.3233b61d.js",
    "revision": "8afb5c5c14fa71315fb95cff81dcc066"
  },
  {
    "url": "assets/js/2.a75dded2.js",
    "revision": "b4964084f90a19819df0b6846eddbdbd"
  },
  {
    "url": "assets/js/20.ba33e89f.js",
    "revision": "044d26c5d253a4ae8f6f971f9deb177f"
  },
  {
    "url": "assets/js/21.71592c6d.js",
    "revision": "3b293b3d010130bce5e81f4d3e12755a"
  },
  {
    "url": "assets/js/22.a2ddba22.js",
    "revision": "168e1b5f274a258d38cc8ad954a209d5"
  },
  {
    "url": "assets/js/23.791e98bf.js",
    "revision": "434371a6329e63f05ed31656ee6adc15"
  },
  {
    "url": "assets/js/24.8511d883.js",
    "revision": "795682c22e997930f8036700240a0f7e"
  },
  {
    "url": "assets/js/25.855384f3.js",
    "revision": "e0d2ff094c6de9fea43f05188e05d24b"
  },
  {
    "url": "assets/js/26.eab57a1c.js",
    "revision": "7ac8a1460615dacb6d925d2f0413d865"
  },
  {
    "url": "assets/js/27.1261446c.js",
    "revision": "5d1def2911bc277be392a410ea68e7a7"
  },
  {
    "url": "assets/js/28.c5d4aa9b.js",
    "revision": "1e905e73df0be39c182e8bc1a909bbda"
  },
  {
    "url": "assets/js/29.143ff4de.js",
    "revision": "33522b149cb695ed4c322f49a5e64cdb"
  },
  {
    "url": "assets/js/3.18032616.js",
    "revision": "1a5713fd29427c262f11c72d49dbd933"
  },
  {
    "url": "assets/js/30.2660e151.js",
    "revision": "3915b6dbed37daaca9953b083b794c7b"
  },
  {
    "url": "assets/js/31.3c8093f0.js",
    "revision": "27e25ea95aadbf9be319840601f89a66"
  },
  {
    "url": "assets/js/32.23e22eb9.js",
    "revision": "e81c5401da2f750b215374fb06185976"
  },
  {
    "url": "assets/js/33.323f870c.js",
    "revision": "70755ad94d0e81763b2ce701a8605564"
  },
  {
    "url": "assets/js/34.23185fe2.js",
    "revision": "1979d9a7feafadc5631c736f9d3721a5"
  },
  {
    "url": "assets/js/35.d8f566c8.js",
    "revision": "74784fb6139517064b19205daa422537"
  },
  {
    "url": "assets/js/36.04310259.js",
    "revision": "0d67ec80c6803a1378d728f9a022bafa"
  },
  {
    "url": "assets/js/37.a42d14b0.js",
    "revision": "68e6c5a353777be24f529878a229f981"
  },
  {
    "url": "assets/js/38.5455551d.js",
    "revision": "fa43afcb2be8f7e8e6eec03c6c43f0c6"
  },
  {
    "url": "assets/js/39.241fafa2.js",
    "revision": "94af86ac33b47db71f10e17ab4246923"
  },
  {
    "url": "assets/js/4.9c795fe4.js",
    "revision": "10ed365b1290c6e27258e937c35badeb"
  },
  {
    "url": "assets/js/40.0d671c21.js",
    "revision": "689d7e2d9c17d2ae25564a0c3582b797"
  },
  {
    "url": "assets/js/41.deb10120.js",
    "revision": "c93b95dbdcec9e83a7c7011517c3cdd0"
  },
  {
    "url": "assets/js/42.e79217c9.js",
    "revision": "0b0a39b86fa830de478452b673e4dcd6"
  },
  {
    "url": "assets/js/43.1b149c74.js",
    "revision": "4d6fc7bc59d6b29e7002a70087a3e39d"
  },
  {
    "url": "assets/js/44.fdacd10f.js",
    "revision": "7ba6d924933ef5942521e2386326d1fa"
  },
  {
    "url": "assets/js/5.3d0b9f75.js",
    "revision": "240b42faf48ab851a6146ed9a321f7e2"
  },
  {
    "url": "assets/js/6.87bf1999.js",
    "revision": "105ecca8244dc930f63f54ff5e5f0fbd"
  },
  {
    "url": "assets/js/7.145a66b6.js",
    "revision": "6b5893f5cc82e25335087655f8719e8f"
  },
  {
    "url": "assets/js/8.56d6aaeb.js",
    "revision": "441ee85189a3b76f99355ba7a08973a5"
  },
  {
    "url": "assets/js/9.83ecdb5c.js",
    "revision": "74cadb40647f7a5a344d71c6f3c4d5fb"
  },
  {
    "url": "assets/js/app.1ceaada7.js",
    "revision": "d08cac940c8b9dc485a1584a4a41d128"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "70b38f61498163610cab4b082bd71e92"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "f651f01339c0f2a200e03bdbf92ad0f2"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "89ed75f026d240b1afcb1a590729dd10"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "b2e3c06a1298a0b0b1832d2d166617af"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "562d0930d98d5225b481b108b5205b11"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "78acfae3b1093850a6d8fa52e85550a5"
  },
  {
    "url": "guides/index.html",
    "revision": "cccacb519378dd6812b4429842c7c8ed"
  },
  {
    "url": "index.html",
    "revision": "fa2f57330b1facd4803f0f55a7ecdc4b"
  },
  {
    "url": "tips.html",
    "revision": "616269794bcb912219c0c1992469eb67"
  },
  {
    "url": "tools/browsers.html",
    "revision": "5c848456a2299f90d509f7d2a9f7cd25"
  },
  {
    "url": "tools/cli.html",
    "revision": "715eb5470ce946b178538b29676ebd9c"
  },
  {
    "url": "tools/documentation.html",
    "revision": "61505c1e23c2f15e69bea97ecfa34c1a"
  },
  {
    "url": "tools/index.html",
    "revision": "91c73a5e3ee79176ddb23aaaad452930"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "621d4bf000459455b0b27f60c129bb5e"
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
