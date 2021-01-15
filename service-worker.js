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
    "revision": "0fa64a398b419b0445ba909a8869d4c9"
  },
  {
    "url": "about/contact.html",
    "revision": "2241b7d78c3bdb18866eb2f24be0ceff"
  },
  {
    "url": "about/contributing.html",
    "revision": "80131ed242fc644a9d5660b5cfda9733"
  },
  {
    "url": "about/index.html",
    "revision": "71ed83c417c1b53e5a2203b51d5aaff4"
  },
  {
    "url": "about/license.html",
    "revision": "32982245fb72c29a0aa0208193de98d2"
  },
  {
    "url": "about/roadmap.html",
    "revision": "8b5dd5d765c3adb44100126a28518161"
  },
  {
    "url": "api/core/application.html",
    "revision": "69b7e9990ff2de1182ffd04d56da6b64"
  },
  {
    "url": "api/core/components.html",
    "revision": "1cb0a1a7bd8c5755cb21162aceb1cf84"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "30f7971d97d7a28294a39452776db206"
  },
  {
    "url": "api/core/index.html",
    "revision": "a90bc2b5c8f8b9d1f493cdf424b7bbfc"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "e6c2e14da8486d8114ad75cd01ba7f6e"
  },
  {
    "url": "api/core/services.html",
    "revision": "d4808e1776e2c4d67808d9ef3e0e8888"
  },
  {
    "url": "api/index.html",
    "revision": "70c5d101dfd6da93acec877d2525a0fc"
  },
  {
    "url": "api/map/components.html",
    "revision": "f901105356b8ebdcf6adc2114910cfc5"
  },
  {
    "url": "api/map/globe-mixins.html",
    "revision": "895f455935cabc8d39e5f2e8e232b377"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "2a8501052ad59df91789c2c634faf869"
  },
  {
    "url": "api/map/index.html",
    "revision": "fa355bd269a197f9c606c07e60a35c4c"
  },
  {
    "url": "api/map/map-mixins.html",
    "revision": "d869f36116f32b789a036c96f68ff74e"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "d739644bbaa2bd60704edc124828471e"
  },
  {
    "url": "api/map/services.html",
    "revision": "0672de250408f741f38ffc91a2df16eb"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "a58d51d0885a8bc0243b83b0bb5b5a0a"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "5ca6b8bb9aa970fe07c71eafe06c334e"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "e3843047dad556f6e74b108aa308cb3d"
  },
  {
    "url": "architecture/index.html",
    "revision": "68fa7ee72b9b1c1ff02373c5efe933ce"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "40d50ecdf19e796b2483e65f6799974a"
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
    "url": "assets/js/14.8506331e.js",
    "revision": "df898a2b6f518f076a328819c3a2c1bc"
  },
  {
    "url": "assets/js/15.2ea31af5.js",
    "revision": "32585f5c65cd5df046b05a0cada8b624"
  },
  {
    "url": "assets/js/16.2977ba82.js",
    "revision": "3251f3492a597f14d01ff5fd8a5a7a59"
  },
  {
    "url": "assets/js/17.3fe0b8bf.js",
    "revision": "7858c47bbba63ccf6a13f9324120f009"
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
    "url": "assets/js/25.827fc808.js",
    "revision": "3908f49b9a392a37317531107011a0a5"
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
    "url": "assets/js/29.aa538e8c.js",
    "revision": "164d1b27113cbf72ad39ce005a245b92"
  },
  {
    "url": "assets/js/3.e14f8819.js",
    "revision": "a9a0f89e46443e92ba377667e4bec978"
  },
  {
    "url": "assets/js/30.7462068d.js",
    "revision": "64aa095c1eb85cccb7a2c2bf5c45016d"
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
    "url": "assets/js/33.14022522.js",
    "revision": "c021f3ddd33819b23bd34547168c5807"
  },
  {
    "url": "assets/js/34.e5301dab.js",
    "revision": "e93946a72ea3124b8c163c8be0ac0b34"
  },
  {
    "url": "assets/js/35.1635ae4d.js",
    "revision": "eddc9af3f7082e9bac025d6e7133b2bb"
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
    "url": "assets/js/38.943cd4d1.js",
    "revision": "f19a3af739914040b0344b22bcd99ff3"
  },
  {
    "url": "assets/js/39.aff3867c.js",
    "revision": "e838c18381afb6981926f01a8e08b690"
  },
  {
    "url": "assets/js/4.f9ee2bfb.js",
    "revision": "0c62c4479d5a964d8672f40b36027bd9"
  },
  {
    "url": "assets/js/40.1368678f.js",
    "revision": "00fde4924bd47759ee0f40ff3497b46f"
  },
  {
    "url": "assets/js/41.a50ad738.js",
    "revision": "6f720273d7b435b9b5b070d56250dcb1"
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
    "url": "assets/js/46.1829f01b.js",
    "revision": "2d17df1b7e09aed4c15c4e0968f68df1"
  },
  {
    "url": "assets/js/47.65a69d15.js",
    "revision": "f6e1371b3ce3832b25ec2989f70ccb5f"
  },
  {
    "url": "assets/js/48.27d99b86.js",
    "revision": "ad24f0e3a9a7a75b99d2c7137ba503a7"
  },
  {
    "url": "assets/js/49.feaf7c96.js",
    "revision": "6513ca4a19646bb504e33a3cd52a7b1e"
  },
  {
    "url": "assets/js/5.70125bb4.js",
    "revision": "4b98f0ed7a89fbb4054c4a747e96afae"
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
    "url": "assets/js/6.79d871bb.js",
    "revision": "6d790b982d02d82ab6ad894d500de100"
  },
  {
    "url": "assets/js/7.53dc5e32.js",
    "revision": "3fa197f9c6e1bd148e24d20afbc59582"
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
    "url": "assets/js/app.aa9fcb28.js",
    "revision": "acee34f0439be43dac623a0f61cb36f5"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "e1ba7b39994e15fec912c2ce565eb4e5"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "dff9f27b94ee549e2dfe67201ee732fb"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "53e13f5531bc2c629c850b5f17098ad3"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "35bf2f1c2ab6b670a92658cfdce47958"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "871f989beb9526432b6be7e1b04ee6fb"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "9f525e5cc479c3e84ba625bcb685ffb8"
  },
  {
    "url": "guides/index.html",
    "revision": "32ec172992d8fd9d389915e160c35c90"
  },
  {
    "url": "index.html",
    "revision": "454d8b4fb6318bdd6acea28e6faad6c0"
  },
  {
    "url": "tips.html",
    "revision": "59a9b01d15cd9dc9209d3f1c9334ff0e"
  },
  {
    "url": "tools/browsers.html",
    "revision": "b7df044b1cae264e8fa468e89c19880a"
  },
  {
    "url": "tools/cli.html",
    "revision": "e46952072675f7e5be8f4d63a0131151"
  },
  {
    "url": "tools/db.html",
    "revision": "c220a4e1a3201a8f7551f3394df36f1c"
  },
  {
    "url": "tools/documentation.html",
    "revision": "a3306de94e3e08f39721b3bb584121fc"
  },
  {
    "url": "tools/index.html",
    "revision": "972bfbd064fe5b3cb42e4c6ffc804a4e"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "7f25d15817dfaec5e459ed9015b701d9"
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
