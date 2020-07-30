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
    "revision": "f7a2b12d39f583fa6d3aa7b48ebfd9fb"
  },
  {
    "url": "about/contact.html",
    "revision": "4d2447859d91293682ab3c7dc99fbd0e"
  },
  {
    "url": "about/contributing.html",
    "revision": "c7e56bead88814cd3d23c840a6fb8fe1"
  },
  {
    "url": "about/index.html",
    "revision": "c6cda232d93c899baf786668e34eb64b"
  },
  {
    "url": "about/license.html",
    "revision": "72b90dcc15863331f88fa43b51bc1924"
  },
  {
    "url": "about/roadmap.html",
    "revision": "62525525d306fd104a6c24ec2cf2a8eb"
  },
  {
    "url": "api/core/application.html",
    "revision": "f9ffb3b02137b6e889914d9dbb029d1d"
  },
  {
    "url": "api/core/components.html",
    "revision": "5c5ef80aa4f956409eaca041a5e03aec"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "5abe2b6f3aa4d6da5b66c58f7bd34d7d"
  },
  {
    "url": "api/core/index.html",
    "revision": "1fa348b31ef85f359deb9b9cc361edac"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "e86973f2a199003be692d5c377bac92a"
  },
  {
    "url": "api/core/services.html",
    "revision": "0ba0abae4631040731a98d30525fbe8d"
  },
  {
    "url": "api/index.html",
    "revision": "6dc8aff84a49d0c19ae155ba9b350766"
  },
  {
    "url": "api/map/components.html",
    "revision": "e6588b4017024f29cd7693d19fb65ac4"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "33235a611cd3baff1f04fdc86b6c3bbe"
  },
  {
    "url": "api/map/index.html",
    "revision": "6dc405ccaff276732f4374b2bd1a2bf6"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "6fc25e79dfbee7d7f3bda655b64fc15e"
  },
  {
    "url": "api/map/services.html",
    "revision": "f31e2d1dc36efba01c9f65c6922e2273"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "013e3f3e7da7258cdb2666c96eb5e48a"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "7ce516dd35b4330451e0187d5ee5538e"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "86e76b51ddc086e8262286ae2db15afc"
  },
  {
    "url": "architecture/index.html",
    "revision": "4330c91db77189fe4852812c4bbe8f0f"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "1df62158bb713f0f20e0d54b297e6c07"
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
    "url": "assets/js/10.9a7a60d0.js",
    "revision": "b98964b320e72df8258d37d4c86486c7"
  },
  {
    "url": "assets/js/11.f547d344.js",
    "revision": "ebc807f7259125c0bbb2e109b37d9b1e"
  },
  {
    "url": "assets/js/12.202b719d.js",
    "revision": "629497688424a444b4b65f48c20b3d0e"
  },
  {
    "url": "assets/js/13.c04d3589.js",
    "revision": "29116afc0efc394634f6d2aae8f51d38"
  },
  {
    "url": "assets/js/14.2d9b4973.js",
    "revision": "15c469d8dfd6d13c966aa9f7d228e8a5"
  },
  {
    "url": "assets/js/15.b3e46354.js",
    "revision": "8a9375fd8876a3da292ccc920dcb495e"
  },
  {
    "url": "assets/js/16.85bb4331.js",
    "revision": "a5da87552e6a378768658d4c94f34869"
  },
  {
    "url": "assets/js/17.55762bcd.js",
    "revision": "bc25fe42a3f678d607e76994483a3d48"
  },
  {
    "url": "assets/js/18.c2630b84.js",
    "revision": "2dfffe3bd4f568150188b42ebb5b3fbd"
  },
  {
    "url": "assets/js/19.3ce75162.js",
    "revision": "14a635a7727f77311e70386e90fa7122"
  },
  {
    "url": "assets/js/2.b84e3a27.js",
    "revision": "01ed428ce1af7ebd09023f223959a755"
  },
  {
    "url": "assets/js/20.fc6d40c8.js",
    "revision": "500c7b73eb03f90ba85f18f629a3cf55"
  },
  {
    "url": "assets/js/21.4a5cd3aa.js",
    "revision": "ded282b001fa55d272c8abc3ddcdc204"
  },
  {
    "url": "assets/js/22.84ae16c2.js",
    "revision": "36d16d649de16cd6d5654949a8d6a3fd"
  },
  {
    "url": "assets/js/23.219edd51.js",
    "revision": "04d96b1f65f929a681ab5c90ccd98c24"
  },
  {
    "url": "assets/js/24.bf7b406a.js",
    "revision": "8fa55cfe437bf0525749e69407f74813"
  },
  {
    "url": "assets/js/25.28829694.js",
    "revision": "c4729eda18ff0d2978d0e1df9a64a0e1"
  },
  {
    "url": "assets/js/26.09c0d336.js",
    "revision": "cdbe69bf8eacf0bb8053871000764b09"
  },
  {
    "url": "assets/js/27.2eddd959.js",
    "revision": "5e485f84c03e881da4630a6fa4649e2b"
  },
  {
    "url": "assets/js/28.cdce61b4.js",
    "revision": "fc3859d87bcfd9a598888492ac22c89e"
  },
  {
    "url": "assets/js/29.bc29f96c.js",
    "revision": "4f8e0c45a20d8ed9c558bc3f46bc100a"
  },
  {
    "url": "assets/js/3.038ace67.js",
    "revision": "d8a939a97a635a1aa5a74444ed70602e"
  },
  {
    "url": "assets/js/30.bcd6bb80.js",
    "revision": "a5543cd89e89275115659a7cb65865a0"
  },
  {
    "url": "assets/js/31.55925014.js",
    "revision": "af44678d923af2a6c6f1981a35910dad"
  },
  {
    "url": "assets/js/32.e80a9c46.js",
    "revision": "cd042808747d433d1890b242bcf20148"
  },
  {
    "url": "assets/js/33.d70f888c.js",
    "revision": "e0af3e4c1a122740ab9c598b519e0dbf"
  },
  {
    "url": "assets/js/34.567e6f74.js",
    "revision": "482d8e4f263aae77ac54609c350e48bd"
  },
  {
    "url": "assets/js/35.b9f2d41b.js",
    "revision": "7f21b95f52be24ce291b245b24964152"
  },
  {
    "url": "assets/js/36.e9606c59.js",
    "revision": "73cba767d8ec49a9a61c77fc8032fb73"
  },
  {
    "url": "assets/js/37.124afb38.js",
    "revision": "6d1daa0ac76f35a82866ded9a05896c7"
  },
  {
    "url": "assets/js/38.85aa41ac.js",
    "revision": "65e117871c38c127e31b623958bd7a80"
  },
  {
    "url": "assets/js/39.a15e6c89.js",
    "revision": "08f50444075db08788f1b65cff144c31"
  },
  {
    "url": "assets/js/4.aafc6d9f.js",
    "revision": "61b9e82ee23c581563c1141b5401ed51"
  },
  {
    "url": "assets/js/40.06e1995a.js",
    "revision": "c0ea865013b593f3616b85069fa25ed3"
  },
  {
    "url": "assets/js/41.08627c68.js",
    "revision": "498206aa0df75f4ce158660fc2a42efc"
  },
  {
    "url": "assets/js/42.4b84ac28.js",
    "revision": "b2977ce201466169fee1cad8a3506fb0"
  },
  {
    "url": "assets/js/43.62e892a4.js",
    "revision": "2612a7f219355725fe8d39cbd9c8cb1e"
  },
  {
    "url": "assets/js/44.d038a9e8.js",
    "revision": "a36dd3f21eedc91d251e5a5606111fa1"
  },
  {
    "url": "assets/js/5.182fa82f.js",
    "revision": "1a81baa11ab94dd89bbd645732b1448b"
  },
  {
    "url": "assets/js/6.b89c564d.js",
    "revision": "a06d18e65ee4c3ab2406e6d82a893df6"
  },
  {
    "url": "assets/js/7.565ed12c.js",
    "revision": "92d1dd3fd1f1f2af59621b9bb9610816"
  },
  {
    "url": "assets/js/8.307fa4dc.js",
    "revision": "a1752c30a75d0d48fe9d3cb43e685c76"
  },
  {
    "url": "assets/js/9.6a1d0cd9.js",
    "revision": "03d3e007d30a9f5eae44207d25fdc5a1"
  },
  {
    "url": "assets/js/app.2979533d.js",
    "revision": "4b31dab7be90333bcc800c0015a04993"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "4641530461a5770f0d77a49315b4d50c"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "a96ab5320a3a4d15f54f3f620e6c1ff5"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "6b8f12a0faa9127e563a5d23186d648a"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "d09f8ed067e10e5a2b198e80c9999baa"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "0fab274617fa1736b38adb736fb0acd7"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "43ce9b44073319f2dcb0aae5d82ae64a"
  },
  {
    "url": "guides/index.html",
    "revision": "70a766eddf23f14457d1a079a6e5158d"
  },
  {
    "url": "index.html",
    "revision": "a362f07ff9c135c8068fe4264a22c386"
  },
  {
    "url": "tips.html",
    "revision": "981cf5eecee036b4482f4506e580d066"
  },
  {
    "url": "tools/browsers.html",
    "revision": "15128d11e757f6848730d45fd704ef77"
  },
  {
    "url": "tools/cli.html",
    "revision": "1aff10036532da9e36584ef7ddec2e5b"
  },
  {
    "url": "tools/documentation.html",
    "revision": "42df54d37d4eb85fc10c3e123cd87fe0"
  },
  {
    "url": "tools/index.html",
    "revision": "8b70b44807dd4780fc961a84cb102eba"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "222b8c8832dc03e9bba931a9181bc5f6"
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
