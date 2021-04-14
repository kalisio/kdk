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
    "revision": "eb0ff3a548aa26138d02b86370bf31d3"
  },
  {
    "url": "about/contact.html",
    "revision": "57be6618b2bd6d6c5da88baa4b18898e"
  },
  {
    "url": "about/contributing.html",
    "revision": "0225a2726e24b7f192a6dd6907d2bb4f"
  },
  {
    "url": "about/index.html",
    "revision": "10153d2d21943c468a4aaa14386c6af6"
  },
  {
    "url": "about/license.html",
    "revision": "a4f315c2e04ce25a66ec00491686023f"
  },
  {
    "url": "about/roadmap.html",
    "revision": "a550907582e0cae83f85425d5a0b13d7"
  },
  {
    "url": "api/core/application.html",
    "revision": "e00b1ee74c2c3f55c2b16b05486e93d0"
  },
  {
    "url": "api/core/components.html",
    "revision": "2205a4afa7720d5bf28c99cbd46dbe7d"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "f7bfb7a6d8f3fc45ab251cef273d2309"
  },
  {
    "url": "api/core/index.html",
    "revision": "aadc4c1d0fb5368344be91b22d6b227e"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "56c6cdf593a6dda5c3e6baf6a79df238"
  },
  {
    "url": "api/core/services.html",
    "revision": "80af1877f35768514f2e78a4b61221d6"
  },
  {
    "url": "api/index.html",
    "revision": "f4178a068cac7779c0cecc46158f023d"
  },
  {
    "url": "api/map/components.html",
    "revision": "e97f96fcb91eda0892d40847c4906cda"
  },
  {
    "url": "api/map/globe-mixins.html",
    "revision": "276db17d371d57a169ac2b1f4b580116"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "6b3324ded5d6eb2abaf9c86a97cb483c"
  },
  {
    "url": "api/map/index.html",
    "revision": "160ae44ee997cf1601fb7736213e1b4b"
  },
  {
    "url": "api/map/map-mixins.html",
    "revision": "e4dfe27b812cbc42883c0ea7c5b866ee"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "ae59e3300462e5108c4f0f66ad605df2"
  },
  {
    "url": "api/map/services.html",
    "revision": "303ab0c730346d30c8c0236cea7b37c5"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "9ce2fc4fa5cb4d376e69b92498729dcd"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "466c8443983c6ac2f2cea1a5d0de8b2b"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "35b4a81df1dc8a647974794d7d4cdaa1"
  },
  {
    "url": "architecture/index.html",
    "revision": "4f5150c1a39bf8048b7c18bb8064aa7e"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "eb7cceaad2cfe0e4006ef6e09abd98e3"
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
    "url": "assets/js/app.afd8209d.js",
    "revision": "b5ba345aba7a7a41194fe105547ece42"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "4b7dd1572c4dd60fd3b285752bba8dbe"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "962b1b1bef68c54eb6080414236f89e9"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "f34ad0c71ac1e494a09a1ca8d0685d78"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "a3a13d57ddbfa9a3c46a47b1fac5ca7b"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "3ee2fbcf473c12632e6adc5e1d6d0afc"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "6f1ca45999de707c5b31cc53cfaf5132"
  },
  {
    "url": "guides/index.html",
    "revision": "dd6ecdb16e14d50267051f48c9adc898"
  },
  {
    "url": "index.html",
    "revision": "f5827658c1e7af2ee6a39220aa54cc70"
  },
  {
    "url": "tips.html",
    "revision": "f4f922b1b38384cb945268270f249f6e"
  },
  {
    "url": "tools/browsers.html",
    "revision": "865dab1f311f6aaa6a4d4ff8e65e7633"
  },
  {
    "url": "tools/cli.html",
    "revision": "e78aaf6f9cbf6f1392dd186fd92cb203"
  },
  {
    "url": "tools/db.html",
    "revision": "f247615b0d414a5bf8f4d72d325bef4f"
  },
  {
    "url": "tools/documentation.html",
    "revision": "15a08882b455c2093dc53ae438dd704e"
  },
  {
    "url": "tools/index.html",
    "revision": "1e2ecdbff671da3a4d11577ccfba20a7"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "4dddf524f305dae5072a5b07b35dc98b"
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
