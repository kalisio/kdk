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
    "revision": "ac3576bc08e584f1c6214e2f6047512a"
  },
  {
    "url": "about/contact.html",
    "revision": "a368966650c3feafc8ba0ba31d9c998b"
  },
  {
    "url": "about/contributing.html",
    "revision": "3aa166cad587f2fddb483a3f9690ab2d"
  },
  {
    "url": "about/index.html",
    "revision": "28ab34da19be05ad2319caa2acf18356"
  },
  {
    "url": "about/license.html",
    "revision": "661d6f250c814183ea86af9326a8ff7e"
  },
  {
    "url": "about/roadmap.html",
    "revision": "0e29e0045123a48a878e4f46aecbb612"
  },
  {
    "url": "api/core/application.html",
    "revision": "b96970f2473bf65f1c90b80e0ebddff4"
  },
  {
    "url": "api/core/components.html",
    "revision": "583b8107aa03efca0032ef25494f3093"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "bad35cefa886248df77893685f27bcb8"
  },
  {
    "url": "api/core/index.html",
    "revision": "098b977f94fd4f07bbcc2e5317ecabf3"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "67529d7572d0e0982882fa632fbf36f8"
  },
  {
    "url": "api/core/services.html",
    "revision": "9fefcf2770237ddba7dbd42c20e2ab0a"
  },
  {
    "url": "api/index.html",
    "revision": "ee9f57a9a388f34b6bd42ecc178a31c4"
  },
  {
    "url": "api/map/components.html",
    "revision": "e744351fc23634c5fa6644811930cf21"
  },
  {
    "url": "api/map/globe-mixins.html",
    "revision": "ea80fef936b27fa94a11f7c6041b617b"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "382934adf400aaddbe50a0bdcba62426"
  },
  {
    "url": "api/map/index.html",
    "revision": "95982eb1e207c1eb1cf25a5f2287907c"
  },
  {
    "url": "api/map/map-mixins.html",
    "revision": "2a06b4b35febf171e2528ad059fabc01"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "a08a9be2087c970393c85be7f07645c4"
  },
  {
    "url": "api/map/services.html",
    "revision": "0bd63e0f3f77d095c8741812330cac12"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "a0bef0d8f3a31487713c5fab92b4997f"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "2550f247dd29ee92548aca00bf69e426"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "5b1685a28354002a22a00fb0052c356d"
  },
  {
    "url": "architecture/index.html",
    "revision": "5e15edf565bd44ef476f55f1bff34b0c"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "2806128bbf29b859efd9e6aebeae4d49"
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
    "url": "assets/img/feature-hooks.725395b0.png",
    "revision": "725395b044879fab8bcffbc5b4c012e0"
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
    "url": "assets/js/10.df94f51f.js",
    "revision": "1af18275a1e4383098114cec639d1ac6"
  },
  {
    "url": "assets/js/11.288a047e.js",
    "revision": "41c2bc9966e0b42927c707e34dc1f5f0"
  },
  {
    "url": "assets/js/12.be4330c5.js",
    "revision": "f8dc7998ecdc9a802d8dc16e9fc377eb"
  },
  {
    "url": "assets/js/13.893dbb92.js",
    "revision": "7f70bdd177cdc1acb84dacfff24f0dbe"
  },
  {
    "url": "assets/js/14.e02b2f7f.js",
    "revision": "52c5ffb20d2cb4fbd92d2e8a32068456"
  },
  {
    "url": "assets/js/15.fbcd425c.js",
    "revision": "ec48f5197d58e4118d29b40a0f2f55d9"
  },
  {
    "url": "assets/js/16.f2926829.js",
    "revision": "b0ab220637c2b0bc141a748111ced695"
  },
  {
    "url": "assets/js/17.8432ca96.js",
    "revision": "86a72d3086f6adce376f79d900a46629"
  },
  {
    "url": "assets/js/18.b0b69d45.js",
    "revision": "d6a1ead75a380c93d761d0cbf517c221"
  },
  {
    "url": "assets/js/19.a0509b6a.js",
    "revision": "7983d95d9ff2dea8318e3cd9e40778c0"
  },
  {
    "url": "assets/js/2.a75dded2.js",
    "revision": "b4964084f90a19819df0b6846eddbdbd"
  },
  {
    "url": "assets/js/20.0d959288.js",
    "revision": "08043bf7ce5bd34e4b72dda81960f728"
  },
  {
    "url": "assets/js/21.0f4447a7.js",
    "revision": "e77e74d94b1546b32d3d956097771241"
  },
  {
    "url": "assets/js/22.318e76dc.js",
    "revision": "94c6416d23f7eda235e821d7d909e5a3"
  },
  {
    "url": "assets/js/23.68549475.js",
    "revision": "846d2c39f137072df7f65a8ca62bc8ec"
  },
  {
    "url": "assets/js/24.c294c6b6.js",
    "revision": "d80611bbb2acbeb88933e35dfc8de1f2"
  },
  {
    "url": "assets/js/25.1ea98d22.js",
    "revision": "d982049243f67b08bb2d94cf72cda874"
  },
  {
    "url": "assets/js/26.c4d4e09d.js",
    "revision": "a0e66fa04955b0938acca61ad4cfe6e7"
  },
  {
    "url": "assets/js/27.a55b4b79.js",
    "revision": "fb4b8c8be70a25265036218413a18fc9"
  },
  {
    "url": "assets/js/28.fb33f918.js",
    "revision": "373f4df922291ce8d39a232aa34d3278"
  },
  {
    "url": "assets/js/29.67036f90.js",
    "revision": "0db7add6a48e5bfc0d736b4509e4413b"
  },
  {
    "url": "assets/js/3.8d998568.js",
    "revision": "33fc9c8ae4b8ebd37c982eacec6ae0b9"
  },
  {
    "url": "assets/js/30.8ac7aa4b.js",
    "revision": "535858ad0df6638c2ece7e56107b1138"
  },
  {
    "url": "assets/js/31.1c21120b.js",
    "revision": "ed0b03dd000a0b2e730dccdfa482b3ff"
  },
  {
    "url": "assets/js/32.f7f3a789.js",
    "revision": "6b53250042fd6b110d22437ee816b964"
  },
  {
    "url": "assets/js/33.b3743538.js",
    "revision": "b8d3b7aca10c8c6200b8aee3cf7a8202"
  },
  {
    "url": "assets/js/34.fa03596f.js",
    "revision": "40633e7901a862241195f8bbad9a9636"
  },
  {
    "url": "assets/js/35.b8e26439.js",
    "revision": "7d60495f4d460782a07124a8bbc5d0fa"
  },
  {
    "url": "assets/js/36.5d07c426.js",
    "revision": "2647d627d9a7d44040ca25674359c7c3"
  },
  {
    "url": "assets/js/37.63b9daa8.js",
    "revision": "2c51936a8f605bbb6db40192cc7b308c"
  },
  {
    "url": "assets/js/38.0f06d4ea.js",
    "revision": "92d051ba2bf2b3de46e37d3637408ca1"
  },
  {
    "url": "assets/js/39.e07d4572.js",
    "revision": "e2fed2b4d97e145559fc62c09c4186fe"
  },
  {
    "url": "assets/js/4.66807596.js",
    "revision": "532212b5be6cdb8f52e2fafac2534606"
  },
  {
    "url": "assets/js/40.164fae90.js",
    "revision": "33baf3d1e95daced922ccb896ab4cb10"
  },
  {
    "url": "assets/js/41.65132c3a.js",
    "revision": "4694ecc9c022173eec8ecabb16d6245f"
  },
  {
    "url": "assets/js/42.e9660598.js",
    "revision": "722faad5e9b6b177b154384a56a9b9e3"
  },
  {
    "url": "assets/js/43.5002241a.js",
    "revision": "d1a55bea2ea44e89c14a2355c6989c98"
  },
  {
    "url": "assets/js/44.bc2af983.js",
    "revision": "b18553ff613eb2742fd52a166f0b9050"
  },
  {
    "url": "assets/js/45.49088a5f.js",
    "revision": "e8f3ea3732d247c481aaa2524333a057"
  },
  {
    "url": "assets/js/46.3073a531.js",
    "revision": "4edfbb1677ce52d0829cbd6bbc6b138c"
  },
  {
    "url": "assets/js/47.586d84f2.js",
    "revision": "bdb2eccc6335e7566546d813a96431a3"
  },
  {
    "url": "assets/js/5.c7114d47.js",
    "revision": "9882ce7b8831345532c80cce38e4b8e9"
  },
  {
    "url": "assets/js/6.87bf1999.js",
    "revision": "105ecca8244dc930f63f54ff5e5f0fbd"
  },
  {
    "url": "assets/js/7.6af8861a.js",
    "revision": "d6d3fa6e01e169d6a8e1cd74e8a240a3"
  },
  {
    "url": "assets/js/8.cde45b70.js",
    "revision": "31304cddd02a01950df56b5eeef9eee2"
  },
  {
    "url": "assets/js/9.83ecdb5c.js",
    "revision": "74cadb40647f7a5a344d71c6f3c4d5fb"
  },
  {
    "url": "assets/js/app.efd27dcb.js",
    "revision": "3bb621f12e735166cef1d85caad44926"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "a8cd7570b30c047383e42691e6b4922d"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "b985ae77166493d772eaa88160cbf0b9"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "31825adc1d7105ea8f7dd38a3ad390c2"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "8387a36e41c0dd61708be7f9b937f4c7"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "07f8bb9c66a05260fd7e70c60ec6b470"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "5628f42749898b0ae03276c950c3b817"
  },
  {
    "url": "guides/index.html",
    "revision": "8da9eb08b75445281b939de1cca6e846"
  },
  {
    "url": "index.html",
    "revision": "929e2bb70730c495bf3fc680e756a42c"
  },
  {
    "url": "tips.html",
    "revision": "51f3c9f10230155719cd8b09faf9bae2"
  },
  {
    "url": "tools/browsers.html",
    "revision": "18089fb581290cf8444216815504f044"
  },
  {
    "url": "tools/cli.html",
    "revision": "96c59f14ebf858d214b63818e9614287"
  },
  {
    "url": "tools/db.html",
    "revision": "d7e447e3c8a286eb6e75a391a75723bf"
  },
  {
    "url": "tools/documentation.html",
    "revision": "8eaa20966bc2eff7733f056306014433"
  },
  {
    "url": "tools/index.html",
    "revision": "bb5fe82a73c7ca575f8e2472853d28b1"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "242dc0fac85cdc442d20115314c340d7"
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
