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
    "revision": "8392c2388d5b4688be7aae92c1318cac"
  },
  {
    "url": "about/contact.html",
    "revision": "4eed5cedb237f0ebfaa15a59650a7f4a"
  },
  {
    "url": "about/contributing.html",
    "revision": "a0267632a96fe96a6745f36594d8f099"
  },
  {
    "url": "about/index.html",
    "revision": "009346dd7217d410bb44855042c26e7f"
  },
  {
    "url": "about/license.html",
    "revision": "1cdb7c31c692fd7c4351f00e2678bafd"
  },
  {
    "url": "about/roadmap.html",
    "revision": "58a6bf9b7770b153b4343959d78b10c1"
  },
  {
    "url": "api/core/application.html",
    "revision": "c1be20e0f24e7dfb1feda95af77a93f8"
  },
  {
    "url": "api/core/components.html",
    "revision": "9f5070979c6a737b05688b56fe97e39a"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "666ea06ebbcf93dae1c5637256ba7e72"
  },
  {
    "url": "api/core/index.html",
    "revision": "b5e74084036f68e6c3cfd12dea9b5cb7"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "4729785d8431e6a3056d31e58b5684de"
  },
  {
    "url": "api/core/services.html",
    "revision": "885005378764bba59de8897357cc7d24"
  },
  {
    "url": "api/index.html",
    "revision": "8e11338ffb780d780de95987a496daa4"
  },
  {
    "url": "api/map/components.html",
    "revision": "24b329e55e753acb6036d352094cfafd"
  },
  {
    "url": "api/map/globe-mixins.html",
    "revision": "867df1779f523f21190a523c56a3036b"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "581812b9e2824f8c72933bbdf1af54db"
  },
  {
    "url": "api/map/index.html",
    "revision": "e7027937284b67c7e8171ac1637fafd3"
  },
  {
    "url": "api/map/map-mixins.html",
    "revision": "91823c1319ecb1cdd67f4e2c43873631"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "b1d642bb4a51b88bb574bd869d2a3e7d"
  },
  {
    "url": "api/map/services.html",
    "revision": "22ec00e2bc8ab5e9fa5cac5cfca0f78c"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "d1a3c43342257780ab66462fd3281233"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "d2e582a92262011711be4daf37553ec7"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "9de028d277b5b8cf7f71ae9d8d298844"
  },
  {
    "url": "architecture/index.html",
    "revision": "3ac5d4c5731de2728e2dd7e9d49532dc"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "5fa9a0503e409cc2704468d8ec881173"
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
    "url": "assets/img/alert-hooks.a29b1547.png",
    "revision": "a29b154748a226fbbe8e6a589aa14012"
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
    "url": "assets/img/timeseries.370f7197.png",
    "revision": "370f7197130302dce62fdcd4d3be49ea"
  },
  {
    "url": "assets/img/users-data-model.e037f5f6.svg",
    "revision": "e037f5f6dd66241e355c8f7b559237e4"
  },
  {
    "url": "assets/js/10.422a18ba.js",
    "revision": "1e0a940ea3ba9b3e2f48e4e29545a80f"
  },
  {
    "url": "assets/js/11.6146572c.js",
    "revision": "b3ccd9df06e8e9887129d7e3da0d95a0"
  },
  {
    "url": "assets/js/12.ff944384.js",
    "revision": "461c72c3eb254308854e660ed336adac"
  },
  {
    "url": "assets/js/13.8361596c.js",
    "revision": "66cbd9724c52a871634cc3c86b4f9f0b"
  },
  {
    "url": "assets/js/14.e12a5d2f.js",
    "revision": "abc6cdc635b2f4c9735f103e0405d974"
  },
  {
    "url": "assets/js/15.5658cf4a.js",
    "revision": "83dc42b9dfa8f782883706c9cbf476d1"
  },
  {
    "url": "assets/js/16.d8ccdbd2.js",
    "revision": "f0b307055b026387cb3c6329217c0e87"
  },
  {
    "url": "assets/js/17.b5b4ded0.js",
    "revision": "383f9ddfed4e80a49d34bc3b15b25891"
  },
  {
    "url": "assets/js/18.c2264a79.js",
    "revision": "850fb75a3002b89bf30f107b1c412a14"
  },
  {
    "url": "assets/js/19.fa8fa9b6.js",
    "revision": "f46772fd570ea1028605e2f29497d9db"
  },
  {
    "url": "assets/js/2.51fc9f3f.js",
    "revision": "cf57a8b6bc0b510c8375289617b468ef"
  },
  {
    "url": "assets/js/20.4a84894e.js",
    "revision": "6ca8cb774aca34323c726a19658e54a1"
  },
  {
    "url": "assets/js/21.ec5cbeac.js",
    "revision": "a543a5558c9d8a342af88ba225ef8ada"
  },
  {
    "url": "assets/js/22.846467d8.js",
    "revision": "02765068534ac65805f5ae2403f14adc"
  },
  {
    "url": "assets/js/23.f81eb682.js",
    "revision": "8d5dd280502817dc377ccdc695de3af3"
  },
  {
    "url": "assets/js/24.824ae611.js",
    "revision": "c99a9dcef9a7701de928c0d680e929b3"
  },
  {
    "url": "assets/js/25.55fe4b6b.js",
    "revision": "b629b9d58701c9bc967ad1dd21935f58"
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
    "url": "assets/js/29.165b487e.js",
    "revision": "457a5690da5a51e36cf212f2d890479e"
  },
  {
    "url": "assets/js/3.4838e27f.js",
    "revision": "7ca753a97757570f2de85cd844cf7b5b"
  },
  {
    "url": "assets/js/30.d0d27f7a.js",
    "revision": "d8dc03dc64fdaa7ffc17440e8b8a54e9"
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
    "url": "assets/js/33.61796975.js",
    "revision": "5346379b6290cc233ee0e6fa1f52f086"
  },
  {
    "url": "assets/js/34.97fee52f.js",
    "revision": "d8671874fd8bda4066cd1cdab0384a7b"
  },
  {
    "url": "assets/js/35.96999543.js",
    "revision": "cabdcc00de64b364c7a6465696d0a867"
  },
  {
    "url": "assets/js/36.e5771da0.js",
    "revision": "a0034b6e41e9195eead1df1ef5ca6d2c"
  },
  {
    "url": "assets/js/37.343bdea5.js",
    "revision": "c9429b26cfc54045a9d5849022f92f5f"
  },
  {
    "url": "assets/js/38.1082baa0.js",
    "revision": "42512135badc5cf09f1f36c28e3cabb1"
  },
  {
    "url": "assets/js/39.d2ed77fe.js",
    "revision": "5aaafe086958e2e708fbc1de5bfa58a2"
  },
  {
    "url": "assets/js/4.73c0aebf.js",
    "revision": "be7003d0fb84d7cebcbbfba0b2813239"
  },
  {
    "url": "assets/js/40.fe50807b.js",
    "revision": "300217f84c29e9632a5dddee59b5901f"
  },
  {
    "url": "assets/js/41.e70cba05.js",
    "revision": "e884b6d84e9bb2dc4190632a4c860569"
  },
  {
    "url": "assets/js/42.b1984d22.js",
    "revision": "c551ec8adcf14560cb8af22f5a746c1e"
  },
  {
    "url": "assets/js/43.fb2709af.js",
    "revision": "bd5be12fddfb2b77c8c8ee6eb2e7e52c"
  },
  {
    "url": "assets/js/44.9873b3a3.js",
    "revision": "d01aae4ac27bee56a093ea586e803240"
  },
  {
    "url": "assets/js/45.3057494d.js",
    "revision": "1105e65224a68a2da49674b1ff66770c"
  },
  {
    "url": "assets/js/46.ed5fa649.js",
    "revision": "7014863a38a6610c8bf6a7b774969f75"
  },
  {
    "url": "assets/js/47.ebb9677f.js",
    "revision": "6a03e5040e394029920095a97d861cdc"
  },
  {
    "url": "assets/js/48.7245159d.js",
    "revision": "338ea3d1694eef1387287332da5f93af"
  },
  {
    "url": "assets/js/49.24eed01f.js",
    "revision": "4859175984bf97b9a78df7b4980da69e"
  },
  {
    "url": "assets/js/5.66b85194.js",
    "revision": "2df3ab491d43633f45b5c20bf804d3b3"
  },
  {
    "url": "assets/js/50.e4bc8a1e.js",
    "revision": "4611c5a335808360e60d74be6b6ba6e2"
  },
  {
    "url": "assets/js/51.916d8ef1.js",
    "revision": "92850af419c5d2e8ef17968bc15f4982"
  },
  {
    "url": "assets/js/52.f1def92b.js",
    "revision": "2d167cb11bd2a6490c5ff512cbec14d0"
  },
  {
    "url": "assets/js/6.9993cfdb.js",
    "revision": "dfb52480481c992188ce8ccacd8cf3de"
  },
  {
    "url": "assets/js/7.0eeb36e7.js",
    "revision": "93274881e91c27ac831ef010c0e4d72f"
  },
  {
    "url": "assets/js/8.e6c27f46.js",
    "revision": "a2c098aa231dea40a32920c10af0403f"
  },
  {
    "url": "assets/js/9.9b9d823c.js",
    "revision": "5893c8d5153f047aab350af87477c959"
  },
  {
    "url": "assets/js/app.a4477def.js",
    "revision": "d2b532ad54b96926978b99e462c00154"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "6c47fe379a45e253117c92bda4dafb76"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "d36b20a8b1874d45280a42972f7df4a1"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "2ea353a308ea8e760dcea042f7b257a5"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "52c50f8444685cfc45437ccd41d640da"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "d82d831d18dd0b02f1b50405427c9d9e"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "904d6aef0b26061e888d49b40a4cae76"
  },
  {
    "url": "guides/index.html",
    "revision": "17080480acef26a1cc292903203c5515"
  },
  {
    "url": "index.html",
    "revision": "e4cbc63a654feeecbaf3cc5d3d0dbc35"
  },
  {
    "url": "tips.html",
    "revision": "aed7c8ee9e0cbb8a5ad62e5e68d5c375"
  },
  {
    "url": "tools/browsers.html",
    "revision": "e48da24cd584d14ca59485c7fc145c3e"
  },
  {
    "url": "tools/cli.html",
    "revision": "30a2e576a9d755c95e71f44e57b7f640"
  },
  {
    "url": "tools/db.html",
    "revision": "cf16e915de9c814dfe504846d7688b2f"
  },
  {
    "url": "tools/documentation.html",
    "revision": "61675b51f36dc72de37de552e621e7f4"
  },
  {
    "url": "tools/index.html",
    "revision": "1f0efa9ee874dc5a53e5acba94d96276"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "078d8068a7589f4ad6326a64799a5e04"
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
