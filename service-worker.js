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
    "revision": "74c76617acd0b647df5d7cfb93729406"
  },
  {
    "url": "about/contact.html",
    "revision": "fef3235c2dc42a2a26f6e002dfb5e7cb"
  },
  {
    "url": "about/contributing.html",
    "revision": "f91a4176fb52baadc0574aec1259eb1d"
  },
  {
    "url": "about/index.html",
    "revision": "18d29044481412da8c37a06838bc023e"
  },
  {
    "url": "about/license.html",
    "revision": "6587d47a4f7f7d71dba8e94066354dea"
  },
  {
    "url": "about/roadmap.html",
    "revision": "415906e7c275c72893d6ba4c30f1ad21"
  },
  {
    "url": "api/core/application.html",
    "revision": "1126c344f0a4761f01b226c46bc98ed5"
  },
  {
    "url": "api/core/components.html",
    "revision": "91e0db959551a6dfe6559dc2e1f305c1"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "a3e2767af27e571f544e2a9767796835"
  },
  {
    "url": "api/core/index.html",
    "revision": "9fc85f2a9ad9b952e28af3998e142c53"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "d16d36ed3ecc01bceeee4dc7fc4b6503"
  },
  {
    "url": "api/core/services.html",
    "revision": "968fa6ef86891636d29dc8b4c71e3fad"
  },
  {
    "url": "api/index.html",
    "revision": "6e499819ba967f0ccb5aeceb6894cbbf"
  },
  {
    "url": "api/map/components.html",
    "revision": "3df7fb5f70492c4f0df55b27ad3ba2ea"
  },
  {
    "url": "api/map/globe-mixins.html",
    "revision": "82c7dc03e38ec339a2dbd56c4f3555db"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "4c89d7abe782f1dfa6c71578d7beb1ae"
  },
  {
    "url": "api/map/index.html",
    "revision": "d1e1f8007d343a9f6244fa965dda6cfc"
  },
  {
    "url": "api/map/map-mixins.html",
    "revision": "19902a0082d1609d23231ef1312fb028"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "e8acfb45313d37c80714a7de4903a0d5"
  },
  {
    "url": "api/map/services.html",
    "revision": "6f6d07a6dd58142a43e4520f3a4da2b3"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "aaa4e44de1b931c3dede947e2df3b1c1"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "e780112b567686f254d74a904ea39bf8"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "5a6a4afe973fb8f37cb485aae79a4a02"
  },
  {
    "url": "architecture/index.html",
    "revision": "d852e50512e0557eab34e5fb94abb973"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "1048f4e31e92ab6c9cd4e839747eca3d"
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
    "url": "assets/js/13.2258bc6b.js",
    "revision": "89fe2364a40d7dd8571f5039b5e1692e"
  },
  {
    "url": "assets/js/14.b19ccb10.js",
    "revision": "36d908fc9e6c3716d750f1154a814292"
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
    "url": "assets/js/24.24d4c5a6.js",
    "revision": "28f7b3762abc8c891c6cb52ec8a43c9f"
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
    "url": "assets/js/49.6176b4ca.js",
    "revision": "4d1134d26cb592cb1522eabe0fa3ffcf"
  },
  {
    "url": "assets/js/5.6ae4889a.js",
    "revision": "0c7935c0e0fa94f79dcc46b7f61f8d18"
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
    "url": "assets/js/app.a24fd86a.js",
    "revision": "1f4e5d1623ea771a433c63fa5b33ff9e"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "b4d779eea1e94ad0ac49489601ac0602"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "ad7667c91547c8646271dd4aae21aced"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "025e822cce714ed74ce453f310e574b7"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "4e8be84dc6a6ebc6e15296a5ccabef08"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "6053523decf78cbe9d2d30916f2d207e"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "f92335c2b70c082191defeabb69069d5"
  },
  {
    "url": "guides/index.html",
    "revision": "183b8159ce7207fe37c9587691e6d821"
  },
  {
    "url": "index.html",
    "revision": "39b022164aa3a64baea1c337708daabe"
  },
  {
    "url": "tips.html",
    "revision": "1c3afa6d12e40584a7a8156e9062e927"
  },
  {
    "url": "tools/browsers.html",
    "revision": "0affbb846357caf576eaf77f329dd310"
  },
  {
    "url": "tools/cli.html",
    "revision": "3d9d42c252189aee01ea1bd0cbbe92d4"
  },
  {
    "url": "tools/db.html",
    "revision": "80a46d92bab4f96152f205ec85c6d541"
  },
  {
    "url": "tools/documentation.html",
    "revision": "9563eae0bcfa035ea22ad8404ec14559"
  },
  {
    "url": "tools/index.html",
    "revision": "dc0066c0750fcefe6cf99ee35304aa7a"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "47030711750ef6ff819352b0898d24da"
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
