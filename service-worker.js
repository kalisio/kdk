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
    "revision": "b861a20ffa1002f4ec73d2f7d01103b4"
  },
  {
    "url": "about/contact.html",
    "revision": "62b16330abe9c2e8b60ab1b6f0f98be4"
  },
  {
    "url": "about/contributing.html",
    "revision": "76db05351d85096aae99b85162d02fe3"
  },
  {
    "url": "about/index.html",
    "revision": "15f9d36a5ed0085781809f3bfd0e4557"
  },
  {
    "url": "about/license.html",
    "revision": "7cc0a2a864eff21042dfd75860762075"
  },
  {
    "url": "about/roadmap.html",
    "revision": "3fbd5bb33e1b1e6091cdb70ebce82953"
  },
  {
    "url": "api/core/application.html",
    "revision": "0e7df1d367f80bc75577e2a4432ed82d"
  },
  {
    "url": "api/core/components.html",
    "revision": "2585100ab6fbea61e42aecdf6ad5ebb5"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "56008169643690bbe8ac5f4f2071e1b8"
  },
  {
    "url": "api/core/index.html",
    "revision": "8f9d23ac1e761652ceb2c197c9e82c47"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "8c7691e05edeaca99e846293e023bb2d"
  },
  {
    "url": "api/core/services.html",
    "revision": "7a9aa09d540040abd145a7441544f465"
  },
  {
    "url": "api/index.html",
    "revision": "dd0c8373f5383382751577e3642c358c"
  },
  {
    "url": "api/map/components.html",
    "revision": "1dfc0a4a6e0dd12d34ac989c50c0b6ab"
  },
  {
    "url": "api/map/globe-mixins.html",
    "revision": "5fbe6606fad066cbb3e2172fc6499941"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "86aa13700698cf39124cf066da0f835e"
  },
  {
    "url": "api/map/index.html",
    "revision": "34d2a7fc0198cb7820a5c2a79b1fa1e7"
  },
  {
    "url": "api/map/map-mixins.html",
    "revision": "546b902a053e753186cfdd40b9be89ae"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "a43e859144a20333fec98d3784de00a6"
  },
  {
    "url": "api/map/services.html",
    "revision": "72a42644f1a4d939238d7a1d77ed36b4"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "8a16a898cb00afc59a9e3e30db9d022c"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "63a7bfd4075b47d7c9ea3f64e7f3a61e"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "bc78b929a4ac241803ab5cb5244fce62"
  },
  {
    "url": "architecture/index.html",
    "revision": "44877169f29b7d5085b555438adecda9"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "d96c764b1598a0cef059859e06f7f677"
  },
  {
    "url": "assets/css/0.styles.50736a5c.css",
    "revision": "07f0c7f1dd0738a28c85c1c13077192c"
  },
  {
    "url": "assets/img/aggregated-feature-data-model.688823b1.png",
    "revision": "688823b1d38b25a2bf17ca95920def55"
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
    "url": "assets/img/component-view.431e6839.png",
    "revision": "431e683901e94ed0ebe528da009240a7"
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
    "url": "assets/img/global-architecture.5a28db5c.svg",
    "revision": "5a28db5c993709a5b933cebc97c02d33"
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
    "url": "assets/img/item-collections.18d3ce67.png",
    "revision": "18d3ce676d23d98e3ce1ee1218e79897"
  },
  {
    "url": "assets/img/kano-3D.85e3276b.png",
    "revision": "85e3276be51ac0a48f9f1d0fd995ab76"
  },
  {
    "url": "assets/img/kano-components.ad92b7e2.png",
    "revision": "ad92b7e2f4bf02c26bb9e24b67f19b11"
  },
  {
    "url": "assets/img/kano-layout-1.1317e52b.png",
    "revision": "1317e52bb4887d882d136ccd774f141c"
  },
  {
    "url": "assets/img/kano-layout-2.3b7a71a5.png",
    "revision": "3b7a71a526cacc636c6318f7cdb81660"
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
    "url": "assets/img/layers-panel.7f1ef39b.png",
    "revision": "7f1ef39bf07bf1fe116e649f2f702ce2"
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
    "url": "assets/js/10.9fe1dfa8.js",
    "revision": "dd025b9f7b7cb9527654f132481919b6"
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
    "url": "assets/js/13.2258bc6b.js",
    "revision": "89fe2364a40d7dd8571f5039b5e1692e"
  },
  {
    "url": "assets/js/14.47c0a2b4.js",
    "revision": "e9736765cfa7767a90e1a05fb4273628"
  },
  {
    "url": "assets/js/15.730c1fa7.js",
    "revision": "16265393f0174f59681e916c829641a5"
  },
  {
    "url": "assets/js/16.bd714368.js",
    "revision": "891977ee71e8e499f96b88cf50216304"
  },
  {
    "url": "assets/js/17.68ca87ca.js",
    "revision": "6013ad4520d47068951993a39341ff5c"
  },
  {
    "url": "assets/js/18.76c98707.js",
    "revision": "c87c316a83dd35f73b56155606ddce53"
  },
  {
    "url": "assets/js/19.6aa67e39.js",
    "revision": "2114dd685f965c1229948c87568007df"
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
    "url": "assets/js/21.11a6ed55.js",
    "revision": "4a0e3f8eb0d8e40576d9baaf936ecb05"
  },
  {
    "url": "assets/js/22.6b73cedb.js",
    "revision": "d6240acad7f652b469ba1cecbcd8571a"
  },
  {
    "url": "assets/js/23.60a6d1c2.js",
    "revision": "88f18d7cafe18cc9d1879fb5d86b21a2"
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
    "url": "assets/js/32.cd0afe38.js",
    "revision": "036ab0b23e6926d81450622dbc5a118d"
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
    "url": "assets/js/35.52c15a92.js",
    "revision": "b7be21cf73bbdba18980d5810cce2e59"
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
    "url": "assets/js/38.90400ea4.js",
    "revision": "35dd711669ce889433412c230482b7d3"
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
    "url": "assets/js/40.6befadbc.js",
    "revision": "4e9b8becaf3151cd6c07390932853c2c"
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
    "url": "assets/js/43.a834f147.js",
    "revision": "92e77889fbdb471920173040dcdffd4c"
  },
  {
    "url": "assets/js/44.4c0846e3.js",
    "revision": "9b29243b98d650ebdfc23630c074dc21"
  },
  {
    "url": "assets/js/45.8bee761d.js",
    "revision": "27e78ccc1782fc51951354ae20547e9e"
  },
  {
    "url": "assets/js/46.4cfc9a89.js",
    "revision": "17f492f4a5c69a469242cfbf5622312f"
  },
  {
    "url": "assets/js/47.8c537e7d.js",
    "revision": "cbea336625740ee878e0bd4ec7bb07a1"
  },
  {
    "url": "assets/js/48.ab45ede1.js",
    "revision": "6504db10b3d1dfb679eb26d239088047"
  },
  {
    "url": "assets/js/49.67edd362.js",
    "revision": "fa27e8bb36145b915ad6e1bac9c52abf"
  },
  {
    "url": "assets/js/5.e9941444.js",
    "revision": "04f27d408b70b629616027e4e0082d15"
  },
  {
    "url": "assets/js/50.b28af891.js",
    "revision": "c61be2e116618a5f97593dbef68d569b"
  },
  {
    "url": "assets/js/51.ee377ee0.js",
    "revision": "ccb82fc60dcbb995c01b0a93b8afe75c"
  },
  {
    "url": "assets/js/52.16b6bc3c.js",
    "revision": "86fd44e691c788ae3b0b286c1b8c8b0f"
  },
  {
    "url": "assets/js/53.e694aca6.js",
    "revision": "11e95a76c98a1c4c7ff2c9c8b34e90e3"
  },
  {
    "url": "assets/js/6.6c7d3e51.js",
    "revision": "e1b1b22d25f8e11b02cbb1638690bad5"
  },
  {
    "url": "assets/js/7.a434787a.js",
    "revision": "88ee2bcb8f0730ef995cf504c60d1b63"
  },
  {
    "url": "assets/js/8.41c50df0.js",
    "revision": "96697deb6818888b61c74c1a9bc6c066"
  },
  {
    "url": "assets/js/9.07565a82.js",
    "revision": "e20f64a28b807e3ba0a525f968ea10c2"
  },
  {
    "url": "assets/js/app.edb183d8.js",
    "revision": "fa68bdcfc7ac4a6bb6874e4f7e0e3fc4"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "20cd6c666344ca73c326a0668a531556"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "f8cdd7a868ce5cdae26ae43f02ab0b75"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "6ea91d4cca62f709212aace16e1c5d67"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "5a5ad2dab4798cd06c54ab34deeacce1"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "eaa46673423cd5ffcb855cae242ded1c"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "78e88338fabf7bfc8d224d1401d1b973"
  },
  {
    "url": "guides/index.html",
    "revision": "326905ab07bfd1bbd71404734ac3ded7"
  },
  {
    "url": "index.html",
    "revision": "e81b7374344276bced4c35d0a955a7d3"
  },
  {
    "url": "tips/app-development.html",
    "revision": "8ab3aeb850816ff551668d101b1a6234"
  },
  {
    "url": "tips/mobile-configuration.html",
    "revision": "90134271e04f54e405f0342922bec57f"
  },
  {
    "url": "tools/browsers.html",
    "revision": "5356a198827b75464ce131133cd09e46"
  },
  {
    "url": "tools/cli.html",
    "revision": "4635a83cd33103ec97f309dadc449105"
  },
  {
    "url": "tools/db.html",
    "revision": "41b38c1fb01a032be3ee178f86c12df3"
  },
  {
    "url": "tools/documentation.html",
    "revision": "69d791d07986ead50d7d8791b2347642"
  },
  {
    "url": "tools/index.html",
    "revision": "fd6a20b5fe9e5500a8a657eddbca07a1"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "385b16f578d1f9c8a5cc9de8c65264c3"
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
