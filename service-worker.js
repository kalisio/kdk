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
    "revision": "e9f65f7e6128762eefc6dc5ce2850fe7"
  },
  {
    "url": "about/contact.html",
    "revision": "85aa9702b105082ecd4cde689f2b26d4"
  },
  {
    "url": "about/contributing.html",
    "revision": "0c05e5078e2e901c4f54c6b478784b68"
  },
  {
    "url": "about/index.html",
    "revision": "7db4bd1182c3ec07e9083f89037f7262"
  },
  {
    "url": "about/license.html",
    "revision": "150cc0d4ae3c3267dfac36c6f79b1350"
  },
  {
    "url": "about/roadmap.html",
    "revision": "564309e3d4e58ad59d5c0001443a4163"
  },
  {
    "url": "api/core/application.html",
    "revision": "9944184af00c15698ebdc8b4eef8edb1"
  },
  {
    "url": "api/core/components.html",
    "revision": "0a2160d5df9d2b4efc6e8cf17c0a7a89"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "87565036be5814d5c102af82326d1415"
  },
  {
    "url": "api/core/index.html",
    "revision": "70971738bcdd69580f83eda8d9f09267"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "b0268744a75d295d99fd70e355bd2574"
  },
  {
    "url": "api/core/services.html",
    "revision": "f81212b6edd87f0c9004a91f42001086"
  },
  {
    "url": "api/index.html",
    "revision": "77b80f8030c46a9025f1cc90a9a78935"
  },
  {
    "url": "api/map/components.html",
    "revision": "54707474b4ed46390e5db78daa8392d4"
  },
  {
    "url": "api/map/globe-mixins.html",
    "revision": "e8a4b8ec13247c73f2b3cfe1a5d6ab32"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "05683e49b87444dd5a9a52864ac5930e"
  },
  {
    "url": "api/map/index.html",
    "revision": "5ee21aafebe17b2a7cfecf0c54908b42"
  },
  {
    "url": "api/map/map-mixins.html",
    "revision": "a900ea4f2c01a801e7d704533f22ff42"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "f97530d304e92d7ddebd655c58de21b8"
  },
  {
    "url": "api/map/services.html",
    "revision": "6433b75abd5c5394f750ebfe11f7886b"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "0c3208468ecbfc0015d6efe6d582a758"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "4894793924f499bd9434b42e28c02e0e"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "df63d1882f9163119921eb1ae42fee0b"
  },
  {
    "url": "architecture/index.html",
    "revision": "4602bacac35e2b54fba5959e75a79fc7"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "7727ab8c5ffb54b07b6a4cee0a7b4e20"
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
    "url": "assets/img/timeseries.370f7197.png",
    "revision": "370f7197130302dce62fdcd4d3be49ea"
  },
  {
    "url": "assets/img/users-data-model.e037f5f6.svg",
    "revision": "e037f5f6dd66241e355c8f7b559237e4"
  },
  {
    "url": "assets/js/10.4b367e32.js",
    "revision": "ba5a01eeb9aac05112e050574f9a482f"
  },
  {
    "url": "assets/js/11.efd8aceb.js",
    "revision": "17100ea435b6e4750086ebadf644556e"
  },
  {
    "url": "assets/js/12.3890906e.js",
    "revision": "2588849b16f011e3fd91bcd9cd72022d"
  },
  {
    "url": "assets/js/13.71728aab.js",
    "revision": "26110789a2ddf67f4fb5fd0c71095de3"
  },
  {
    "url": "assets/js/14.8f8ff4a8.js",
    "revision": "56a1ddbd31d807ee9a1da1c2b2d2c99c"
  },
  {
    "url": "assets/js/15.5041e92b.js",
    "revision": "503bf4c87ecb348c1ee8531b8915ecd3"
  },
  {
    "url": "assets/js/16.3294fe10.js",
    "revision": "362bd2215ee9f1507ac313bd5cd44f85"
  },
  {
    "url": "assets/js/17.8f96e38a.js",
    "revision": "83bf079774b83306c642e72e4b775e4c"
  },
  {
    "url": "assets/js/18.0878dbfa.js",
    "revision": "37f50d93649a21f5c0a7dbbe4d48e0e5"
  },
  {
    "url": "assets/js/19.1a6ccc4b.js",
    "revision": "9aa2b0e29cc2dcb29e06aeb151842acb"
  },
  {
    "url": "assets/js/2.deee2b8b.js",
    "revision": "ad87f5efdb57f9bc4e80a8542842d240"
  },
  {
    "url": "assets/js/20.813b16ff.js",
    "revision": "6e5fcf10aa1dfd02967d77b182b606a7"
  },
  {
    "url": "assets/js/21.22a499ee.js",
    "revision": "8f1845fa201860ece3cae9b5ca62de7c"
  },
  {
    "url": "assets/js/22.48a5d9c1.js",
    "revision": "3ce12084eb0ccd6a92b54b067633b51b"
  },
  {
    "url": "assets/js/23.4707dbff.js",
    "revision": "234a69426aa6d7a58c359c5e71890e47"
  },
  {
    "url": "assets/js/24.cb159dff.js",
    "revision": "b84d8facb91b44e0cf5e4aa29c698967"
  },
  {
    "url": "assets/js/25.18688935.js",
    "revision": "8be279d94766d99f66604f8a09c90540"
  },
  {
    "url": "assets/js/26.c1de103c.js",
    "revision": "b082266b052ceb3de9c6151b6a1bedc0"
  },
  {
    "url": "assets/js/27.f5f9d776.js",
    "revision": "fd4f70e195ed793c530e7edc9126a0ce"
  },
  {
    "url": "assets/js/28.eefe9272.js",
    "revision": "20f095949afea739865dc8769e5cd7bf"
  },
  {
    "url": "assets/js/29.f11e7882.js",
    "revision": "5de1a527a2716148a0c407c8e450a06d"
  },
  {
    "url": "assets/js/3.e14f8819.js",
    "revision": "a9a0f89e46443e92ba377667e4bec978"
  },
  {
    "url": "assets/js/30.efa925c4.js",
    "revision": "8a9fa81abd6e0891ab88e46171c52280"
  },
  {
    "url": "assets/js/31.e6033c0a.js",
    "revision": "00c06a29c6f21c4dfabbfea0441e8e30"
  },
  {
    "url": "assets/js/32.920a3c95.js",
    "revision": "593c804708ca9dac5301575cb92e4dc7"
  },
  {
    "url": "assets/js/33.a64efa74.js",
    "revision": "0c0e9229b7ca1bb3e96a4f279fae0434"
  },
  {
    "url": "assets/js/34.e5301dab.js",
    "revision": "e93946a72ea3124b8c163c8be0ac0b34"
  },
  {
    "url": "assets/js/35.58f8be71.js",
    "revision": "094616c496811c8f6db77fd0d941c66a"
  },
  {
    "url": "assets/js/36.95a163bd.js",
    "revision": "7fe6908f8c301c4dfadd3ac6c42c36de"
  },
  {
    "url": "assets/js/37.d2e8e7a1.js",
    "revision": "a78b2b7d57412839bca68d15288900c8"
  },
  {
    "url": "assets/js/38.b351dfac.js",
    "revision": "afed6d8421b5ba1326be80ca5fab7132"
  },
  {
    "url": "assets/js/39.79d9ea8a.js",
    "revision": "81f352e351f50449f42c53ed641e015e"
  },
  {
    "url": "assets/js/4.f9ee2bfb.js",
    "revision": "0c62c4479d5a964d8672f40b36027bd9"
  },
  {
    "url": "assets/js/40.da9fd38e.js",
    "revision": "68c426de6706f6a552176f26c968ab5c"
  },
  {
    "url": "assets/js/41.ae726b12.js",
    "revision": "3f734c31b79d469d7307b6886da631fb"
  },
  {
    "url": "assets/js/42.5dbd2b72.js",
    "revision": "20ad3d6c1057defb471290de06a9acf7"
  },
  {
    "url": "assets/js/43.07172685.js",
    "revision": "bd40b4cacdc28e193c3f665dffe2a278"
  },
  {
    "url": "assets/js/44.4fca58e6.js",
    "revision": "5b8e7d6edba59b4a7fab91061d374141"
  },
  {
    "url": "assets/js/45.568e2210.js",
    "revision": "60c863be546250964a89fc44d3ac8cad"
  },
  {
    "url": "assets/js/46.d5c83e51.js",
    "revision": "5024e8a962240f4272c831054f1e8500"
  },
  {
    "url": "assets/js/47.65a69d15.js",
    "revision": "f6e1371b3ce3832b25ec2989f70ccb5f"
  },
  {
    "url": "assets/js/48.8049299d.js",
    "revision": "5f2d5bae90832424eb27177efe31a889"
  },
  {
    "url": "assets/js/49.feaf7c96.js",
    "revision": "6513ca4a19646bb504e33a3cd52a7b1e"
  },
  {
    "url": "assets/js/5.990bbb57.js",
    "revision": "9a412b12a7733ac4e080b4f5cb090b43"
  },
  {
    "url": "assets/js/50.8494501e.js",
    "revision": "de283bb8775bc1e425c51813025bd2ee"
  },
  {
    "url": "assets/js/51.4e5a7213.js",
    "revision": "8e90daa6a1680780cb7dcd83d21111a6"
  },
  {
    "url": "assets/js/52.02579dd3.js",
    "revision": "7dce42bcc4e7eac616330282c2423474"
  },
  {
    "url": "assets/js/6.999e2de5.js",
    "revision": "ae0d862861d9b90eafd9ace72c969b7d"
  },
  {
    "url": "assets/js/7.0ed85780.js",
    "revision": "02e290d3260cc0d18a0a80d407319a68"
  },
  {
    "url": "assets/js/8.63952efe.js",
    "revision": "a0ea7d86215a372c23c14314773105f9"
  },
  {
    "url": "assets/js/9.cdfb28c3.js",
    "revision": "56da009fabcfd21503e7020a90278ce7"
  },
  {
    "url": "assets/js/app.a26fd56b.js",
    "revision": "d804396a11f4b8f7972948d56374cc2f"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "0e9d4f93f82073a5565c5b166408f1f1"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "86431d3f848c63644f5f63ac769fe6f8"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "2a9e1846d463893f29fb19a9553ece2a"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "14fe8d50ebeff7ad8f9715c9a4e1ecb1"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "5c1c87ab0a4d7cee923c214e3798539f"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "6051625eba28eb7a2328c8331f016aa5"
  },
  {
    "url": "guides/index.html",
    "revision": "ad12219a11f9a2cd94f13403a134cafd"
  },
  {
    "url": "index.html",
    "revision": "27bbb36b893d14ffec413d1048f092d5"
  },
  {
    "url": "tips.html",
    "revision": "42dca6017a92742a7d154dee0cc2ae67"
  },
  {
    "url": "tools/browsers.html",
    "revision": "ca2c91fba71aff39cc557f8fce1007f0"
  },
  {
    "url": "tools/cli.html",
    "revision": "79f484f91afcf8f200684c77934ff91b"
  },
  {
    "url": "tools/db.html",
    "revision": "5ac0f6bb95d46054fc3fe11d62add06d"
  },
  {
    "url": "tools/documentation.html",
    "revision": "f627489967584496de07b8fa1b4d5257"
  },
  {
    "url": "tools/index.html",
    "revision": "51d65187cc5d0f907fabe977bdaff394"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "64fdbd43c7e5fc3c20c9101ca91fef39"
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
