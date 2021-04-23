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
    "revision": "cec1071d0fd3a8ca22af19724cd76fc8"
  },
  {
    "url": "about/contact.html",
    "revision": "851975e7464e53febba0185adfba9f63"
  },
  {
    "url": "about/contributing.html",
    "revision": "925c28fb461b53b8264b03da4843a3b1"
  },
  {
    "url": "about/index.html",
    "revision": "9c2e3a68f28a19525a04296241845f7d"
  },
  {
    "url": "about/license.html",
    "revision": "7ab40933c3b501fc7cb808c55c89a9c5"
  },
  {
    "url": "about/roadmap.html",
    "revision": "7c4faace9ee54a7f029e365343bce526"
  },
  {
    "url": "api/core/application.html",
    "revision": "8bb6a723e1b68870334d1bb378483802"
  },
  {
    "url": "api/core/components.html",
    "revision": "5046f4af108dd520fcf374803acf255d"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "577a0b320d9c07f6ee75413754226e22"
  },
  {
    "url": "api/core/index.html",
    "revision": "35241e136dffabbfabf3980df773c165"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "687f4299adf562eb8316a9eab1ff6339"
  },
  {
    "url": "api/core/services.html",
    "revision": "972beef7eac18134745ccc037c165d44"
  },
  {
    "url": "api/index.html",
    "revision": "8ad76684e8df315ac36bd4acb54c0c4c"
  },
  {
    "url": "api/map/components.html",
    "revision": "b29db5b9b00e850478e15d7845b369a3"
  },
  {
    "url": "api/map/globe-mixins.html",
    "revision": "cad4fc54a643f454e6d2dc787f889d6a"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "486ecac1bf473dab9b83c141ad18406c"
  },
  {
    "url": "api/map/index.html",
    "revision": "1fccc500bd9c8c898c81a2ae02c6739d"
  },
  {
    "url": "api/map/map-mixins.html",
    "revision": "c4dbb25680af5d0ec74f21613c7d3644"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "4e7db26cdbcb687c74696613671b23fc"
  },
  {
    "url": "api/map/services.html",
    "revision": "671deae1efddd1ba8d0fea1d07b3da14"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "50842e0444329fa569663fa5b7f6530a"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "cafd1147864ab0ced394d8166332ebaf"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "7b0c53c4b6dfecc386a0277e37242695"
  },
  {
    "url": "architecture/index.html",
    "revision": "c78bedd6bc7d99348b3e72996e514dc4"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "5adcbff2cd530be9c205eedf6d756082"
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
    "url": "assets/js/app.6538e30c.js",
    "revision": "7033168b3260a92b16cee67d9d98fddf"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "2b34d6c9b86b5a09d407dc609fee60e0"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "7a4ac29c6df7b363e9433a7bacd1dedd"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "77acf124c0fca018e636adad3595baaa"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "42db69eaa59adfea852889163b7f41c4"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "bbbe8cfb67804adb6cb3bc658e00f428"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "afa9fcdb85faf1096fe2275bbdebd19c"
  },
  {
    "url": "guides/index.html",
    "revision": "3d4b0ddeefd4022cc59facb470f7c9d8"
  },
  {
    "url": "index.html",
    "revision": "d25fb4ec28b21d4fe0b3e1a7c5f36868"
  },
  {
    "url": "tips.html",
    "revision": "0c213b617a172480b0c8c27f7fb43823"
  },
  {
    "url": "tools/browsers.html",
    "revision": "4663bb4747c313fddf6e64b875f34e77"
  },
  {
    "url": "tools/cli.html",
    "revision": "7be4d4fc881232b33c0afa9b8fa81028"
  },
  {
    "url": "tools/db.html",
    "revision": "449c2767366ff6079607b8e4394d7ff6"
  },
  {
    "url": "tools/documentation.html",
    "revision": "b0d9a1df770ef1d5d77a714332cc8ae3"
  },
  {
    "url": "tools/index.html",
    "revision": "c7bd053f851ca8db42cb8f8aec1903f3"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "ec03da4cd12e8cd42655a37138344388"
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
