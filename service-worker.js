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
    "revision": "fa3f1df728868ab1f2a2e1f0c03dc8fc"
  },
  {
    "url": "about/contact.html",
    "revision": "9cf4b8440e5e49e5bcb4f614d5a6508b"
  },
  {
    "url": "about/contributing.html",
    "revision": "79359157fa27cb6c90f2e11965fc796b"
  },
  {
    "url": "about/index.html",
    "revision": "9843eb0766176f3863d3ac3b4d4c7304"
  },
  {
    "url": "about/license.html",
    "revision": "96bb2ec6754f5435a3c8cc6bebf444aa"
  },
  {
    "url": "about/roadmap.html",
    "revision": "29b9b42cbcfad2a6a71209c1f9f654f0"
  },
  {
    "url": "api/core/application.html",
    "revision": "0587aa14c3b1999d65b949e236ee09ad"
  },
  {
    "url": "api/core/components.html",
    "revision": "f57de273e206071cb66bfc5e10dab33e"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "a06903f6d76d12fecf85710acbf53b63"
  },
  {
    "url": "api/core/index.html",
    "revision": "10ec9afb65d51f38c7db47e5409d3b7f"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "9801c139a1babc6e6784dc0fbfa10392"
  },
  {
    "url": "api/core/services.html",
    "revision": "a8eb8967bf9090c67a6d60b87c3f5f95"
  },
  {
    "url": "api/index.html",
    "revision": "1c828e277b2801188b27d38c078b6dfd"
  },
  {
    "url": "api/map/components.html",
    "revision": "e89abaedafc9dc86cfc3b8a90006018a"
  },
  {
    "url": "api/map/globe-mixins.html",
    "revision": "21ebdc158bd1972bb5df7866a9205459"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "bffc12433774f1451bcb925ca13c17b3"
  },
  {
    "url": "api/map/index.html",
    "revision": "88bb05744b0cf8fa24d8eed33d50c53a"
  },
  {
    "url": "api/map/map-mixins.html",
    "revision": "a236e786e7010c269304feb937f7aedd"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "d63e1a4ab1fd38ce2bc8b8198ff18b74"
  },
  {
    "url": "api/map/services.html",
    "revision": "5706f34d7888fe84cfb40aaadad3bbf4"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "ee76df5e668847d8e3b1c3e4773c6689"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "760d5e602c2459be5b7c34f61412720c"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "cea92f56f9723401df62f9e8d5c3162d"
  },
  {
    "url": "architecture/index.html",
    "revision": "1a5f13af8724c6704881201cd4685fa5"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "399b30aceb01ac552a8b1ddb07edbd67"
  },
  {
    "url": "assets/css/0.styles.d338d316.css",
    "revision": "6fc5034b17fcea0914076f16b2ba26aa"
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
    "url": "assets/img/application-hooks.e15ca2e0.svg",
    "revision": "e15ca2e0e0ce1b30ac2716348e14cc33"
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
    "url": "assets/img/theme-colors.ec8a03f5.svg",
    "revision": "ec8a03f53b122e079e9663f29ff9fe3d"
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
    "url": "assets/js/10.a08c8fa6.js",
    "revision": "c228013f6cafd43a35d912e5844a29d1"
  },
  {
    "url": "assets/js/11.31827355.js",
    "revision": "3cd35376c7b7ba78706f4b73c05ec4fd"
  },
  {
    "url": "assets/js/12.c9b0320b.js",
    "revision": "8b6ba157491ce5846ae47056cfd388b8"
  },
  {
    "url": "assets/js/13.8f308100.js",
    "revision": "922e019ce1b61aa43472d3ec1e1195ba"
  },
  {
    "url": "assets/js/14.47c0a2b4.js",
    "revision": "e9736765cfa7767a90e1a05fb4273628"
  },
  {
    "url": "assets/js/15.b1445e66.js",
    "revision": "71f29c6665decaf6adf3d6d2aae03410"
  },
  {
    "url": "assets/js/16.bd714368.js",
    "revision": "891977ee71e8e499f96b88cf50216304"
  },
  {
    "url": "assets/js/17.600f88a5.js",
    "revision": "94a3bf3f823dda32401f02a8252b549c"
  },
  {
    "url": "assets/js/18.44b2f764.js",
    "revision": "1edc005b382d62e11da9967d949dcfdc"
  },
  {
    "url": "assets/js/19.1aef3373.js",
    "revision": "44838c210d06335c1357521370a14f99"
  },
  {
    "url": "assets/js/2.74a99991.js",
    "revision": "522673154cf75e829fb76625aa205833"
  },
  {
    "url": "assets/js/20.0835256d.js",
    "revision": "f94ef1c750c92e976530af5634eeac6d"
  },
  {
    "url": "assets/js/21.d20c4ede.js",
    "revision": "14fad9633d34fa2d1e2033f8e0f3aead"
  },
  {
    "url": "assets/js/22.6b73cedb.js",
    "revision": "d6240acad7f652b469ba1cecbcd8571a"
  },
  {
    "url": "assets/js/23.7132113a.js",
    "revision": "5fab0d7c3f30f8c5af2de224762e9d7b"
  },
  {
    "url": "assets/js/24.824ae611.js",
    "revision": "c99a9dcef9a7701de928c0d680e929b3"
  },
  {
    "url": "assets/js/25.f5c8a13a.js",
    "revision": "4ef10725ce8598c49f4ba029cbb9fbd5"
  },
  {
    "url": "assets/js/26.6aa473d4.js",
    "revision": "89e764f114e9bff48eb4e3a0f0728d7a"
  },
  {
    "url": "assets/js/27.4654bd50.js",
    "revision": "53f020924919736ad939ddbac7b766f2"
  },
  {
    "url": "assets/js/28.99577333.js",
    "revision": "e783ff8d35ad0a5a54eb3584a33f7fde"
  },
  {
    "url": "assets/js/29.fbabc77c.js",
    "revision": "583f522fc9c7d4ef80852b87e5d14493"
  },
  {
    "url": "assets/js/3.934b6e1d.js",
    "revision": "33264f39df6989a342e57bde90548778"
  },
  {
    "url": "assets/js/30.e640f814.js",
    "revision": "60d3b90df61519c0085a22b197fccea1"
  },
  {
    "url": "assets/js/31.2ee15340.js",
    "revision": "c61dbdca92469b783e9854b166c886bf"
  },
  {
    "url": "assets/js/32.571e4ca9.js",
    "revision": "cf7084dce594769debe0bbe4d06cfa66"
  },
  {
    "url": "assets/js/33.4b38a62b.js",
    "revision": "92a336c74a902c01728fb982a935fc2a"
  },
  {
    "url": "assets/js/34.97fee52f.js",
    "revision": "d8671874fd8bda4066cd1cdab0384a7b"
  },
  {
    "url": "assets/js/35.60af735b.js",
    "revision": "e7f9653aa2b46af10d8d82a35a1441e1"
  },
  {
    "url": "assets/js/36.7a31460b.js",
    "revision": "1abe70e3fd2536c616afba2ca0271c2d"
  },
  {
    "url": "assets/js/37.c9ed3b37.js",
    "revision": "6fc760b0c831b01988c075919835b3a2"
  },
  {
    "url": "assets/js/38.b69401f7.js",
    "revision": "9a5edf6c1e6e3abeffd7325eed509abf"
  },
  {
    "url": "assets/js/39.f103ef3a.js",
    "revision": "f4329eb97733e6debcad1f242fbc0f15"
  },
  {
    "url": "assets/js/4.f12e5706.js",
    "revision": "86e81696d339e11d4888b0d7605b6291"
  },
  {
    "url": "assets/js/40.f531da64.js",
    "revision": "0024f4767ff7d593997e48df8a2659fa"
  },
  {
    "url": "assets/js/41.9ef837e1.js",
    "revision": "103a7c70d2ec665427574f17b7486505"
  },
  {
    "url": "assets/js/42.75d6a1ed.js",
    "revision": "de700645ef92782c4365e5338964f45b"
  },
  {
    "url": "assets/js/43.08ea7606.js",
    "revision": "c56d06ee17de4a104628f65da4c79ee1"
  },
  {
    "url": "assets/js/44.f60a931d.js",
    "revision": "893584455ca8ace1ed309f82c648dc6c"
  },
  {
    "url": "assets/js/45.36180ed1.js",
    "revision": "4553fbcd9fed9cae79bd90d635fda29f"
  },
  {
    "url": "assets/js/46.1ee07807.js",
    "revision": "8237f01f8d9002417435b3ebcfb998fa"
  },
  {
    "url": "assets/js/47.25ad3467.js",
    "revision": "2ebbf767d0f0da3458ddcd6413a5838c"
  },
  {
    "url": "assets/js/48.8eaed1f8.js",
    "revision": "05f0809535a3978bb0746d2992b0d46c"
  },
  {
    "url": "assets/js/49.6288f067.js",
    "revision": "ae5300d39368ef4fce1e9b9ac0e306aa"
  },
  {
    "url": "assets/js/5.481aa321.js",
    "revision": "f008a6592e75da0ac0f705fe0d6cc698"
  },
  {
    "url": "assets/js/50.e0b392d3.js",
    "revision": "922cd400f2ffa84c11ee2782f9bef11a"
  },
  {
    "url": "assets/js/51.5a7557d7.js",
    "revision": "c545193312d4815f329e9f54e1b1b3a9"
  },
  {
    "url": "assets/js/52.765ce3b8.js",
    "revision": "d8b0c3bb937479a32ded90565666a9dc"
  },
  {
    "url": "assets/js/6.6c7d3e51.js",
    "revision": "e1b1b22d25f8e11b02cbb1638690bad5"
  },
  {
    "url": "assets/js/7.39a11fd4.js",
    "revision": "8088d390539d9fadc51fc8a15ec17105"
  },
  {
    "url": "assets/js/8.95e18d53.js",
    "revision": "019be26dd2f0530a2f8d73142331527c"
  },
  {
    "url": "assets/js/9.07565a82.js",
    "revision": "e20f64a28b807e3ba0a525f968ea10c2"
  },
  {
    "url": "assets/js/app.de5714a5.js",
    "revision": "0823b8eb140dfa358b11839dcad49b01"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "470ce0f533798e869e61b01741970778"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "762a470db953c07dca9ddfe8aaa541fe"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "e16b3e8c9c49fb50cdafdf87907d5be9"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "22923877f6b483b7eae47b139b139298"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "c68acc59f3ae67d5c79ccddeb3f9a013"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "bf011041bd546fa5d766d227802d2e1a"
  },
  {
    "url": "guides/index.html",
    "revision": "b07e50b62d868264f1177c36bad6019b"
  },
  {
    "url": "index.html",
    "revision": "97cd10f58b63dfbe7f23300a9d42a2dc"
  },
  {
    "url": "tips.html",
    "revision": "829c30ccd74c03999e4f49a58d583e69"
  },
  {
    "url": "tools/browsers.html",
    "revision": "4f2f5f218e7dfcfaadd0ab894e21cb54"
  },
  {
    "url": "tools/cli.html",
    "revision": "6a89c3a198953bc81edf46cc0ade2151"
  },
  {
    "url": "tools/db.html",
    "revision": "d81cc34f7882ef4be2606193531573be"
  },
  {
    "url": "tools/documentation.html",
    "revision": "4148795b8eb166737dabbfdbd146139a"
  },
  {
    "url": "tools/index.html",
    "revision": "1a33b21e46ce357bfcc851b33ae6ce53"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "657664b768bfd24156a7944596ba38b1"
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
