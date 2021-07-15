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
    "revision": "c6695d84f6837d3414b0042183187822"
  },
  {
    "url": "about/contact.html",
    "revision": "f1d1d448e8916ba62bf5415c158de535"
  },
  {
    "url": "about/contributing.html",
    "revision": "f88e8b65355b36dbdd29a901eca64724"
  },
  {
    "url": "about/index.html",
    "revision": "a2a330c3f40fd64bd923af08a98a585d"
  },
  {
    "url": "about/license.html",
    "revision": "73e5b18073a1b376c790e81f11959bd9"
  },
  {
    "url": "about/roadmap.html",
    "revision": "9c7be7731d44cc78a817cede1c429aa4"
  },
  {
    "url": "api/core/application.html",
    "revision": "3478cf668995593e9f490e9ecae4b1fc"
  },
  {
    "url": "api/core/components.html",
    "revision": "3a6a49313e7db224069de7651629f8e2"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "b558ab03c2b60e93646aa51b372b857f"
  },
  {
    "url": "api/core/index.html",
    "revision": "5351d18a0312ef3f8a246d320d977619"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "6972e582f37aba691aaa59f02d37356e"
  },
  {
    "url": "api/core/services.html",
    "revision": "01a2548a0823aa9957a4c819b1aa20b3"
  },
  {
    "url": "api/index.html",
    "revision": "77436a65bfe99c52bd520a00d3ad6fab"
  },
  {
    "url": "api/map/components.html",
    "revision": "98c33f14190428e114dba29b669df726"
  },
  {
    "url": "api/map/globe-mixins.html",
    "revision": "c7726ad44a1e38b4a19a3819618ecc13"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "7643e97704796887a8a939acf67671a1"
  },
  {
    "url": "api/map/index.html",
    "revision": "3cb02d5b756c4329363a290abf8ee239"
  },
  {
    "url": "api/map/map-mixins.html",
    "revision": "c7c9706481f8d2abe3c50ce0ae126257"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "e832d1048e9307b405506bcb100cc1ba"
  },
  {
    "url": "api/map/services.html",
    "revision": "5bbece46273e0db7c0f0d6e996e796a5"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "c8300179b2fa4b8577f3d30c294f15c7"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "1f6520a7337490576b6fa457787fcd16"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "500e64e709259e435ac9637006f2385e"
  },
  {
    "url": "architecture/index.html",
    "revision": "b6978474635535c3204d6eeedf8b0c63"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "4da5c664f8c58d55382bfcf6dcfafffc"
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
    "url": "assets/js/10.91a97710.js",
    "revision": "01421f38048d4667cfd4a4a3cc9a3bfb"
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
    "url": "assets/js/21.058e6600.js",
    "revision": "0690ca3f8a126736590c3d432ebc87dc"
  },
  {
    "url": "assets/js/22.6b73cedb.js",
    "revision": "d6240acad7f652b469ba1cecbcd8571a"
  },
  {
    "url": "assets/js/23.c8d636a2.js",
    "revision": "319a439c478b6dbe46a94a0f8f034293"
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
    "url": "assets/js/43.fa338655.js",
    "revision": "6b761af2683259aada3412efea002f8b"
  },
  {
    "url": "assets/js/44.69f83cd4.js",
    "revision": "4d2d04f98a906864b68c90642774f6fb"
  },
  {
    "url": "assets/js/45.a0053360.js",
    "revision": "363be42e3e59f4ed636779611e347e7a"
  },
  {
    "url": "assets/js/46.871cfa48.js",
    "revision": "209942a52517eeddffd252a45ebc9d7f"
  },
  {
    "url": "assets/js/47.78b39e2f.js",
    "revision": "83c118bc098c7e2c347100756e793c11"
  },
  {
    "url": "assets/js/48.95f85bc8.js",
    "revision": "f812efa951346c1ddd11e7f71eec3745"
  },
  {
    "url": "assets/js/49.e9f0d135.js",
    "revision": "8ac539d78d6551cf2a3d15f2b8eb5dc5"
  },
  {
    "url": "assets/js/5.e9941444.js",
    "revision": "04f27d408b70b629616027e4e0082d15"
  },
  {
    "url": "assets/js/50.2ef524a6.js",
    "revision": "b8cfc2b8590caa53183b4fafcd81706c"
  },
  {
    "url": "assets/js/51.d0560ad5.js",
    "revision": "3e2fee9f8ce717e0e50cd3b2b080e77b"
  },
  {
    "url": "assets/js/52.347eb381.js",
    "revision": "6819a2e23afe6bd6ee168729da3eca8c"
  },
  {
    "url": "assets/js/53.cab48ba8.js",
    "revision": "a7929425e32dc8c056e7a5e87e6e2e57"
  },
  {
    "url": "assets/js/54.c5162b90.js",
    "revision": "2a1e5083b1ed67dab0934146e9eb6d9a"
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
    "url": "assets/js/app.1ac1258b.js",
    "revision": "a970367bb46e9daba8a7242a61e2ef25"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "4d9e0defb11c95c570881f701d944674"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "868bd89298d64dc6c50e39be85e8797d"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "30ed4f8b7b4ea74af4385e2556ff44ec"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "0126f078d1ef085579c5da0b8177849d"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "b3c9e9a456ea44a9b2dbce0b7e595207"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "f47c84a76dae2437d076a614407c5219"
  },
  {
    "url": "guides/index.html",
    "revision": "d0566d807cc4a527dd9dfde0ad924ca3"
  },
  {
    "url": "index.html",
    "revision": "687aba53e6f34a9956ac184c0110c76c"
  },
  {
    "url": "tips/app-development.html",
    "revision": "459b4c3e70419e916446eaa8b3418f32"
  },
  {
    "url": "tips/index.html",
    "revision": "5f728d30bba63f4b042d6b5b4f1a4606"
  },
  {
    "url": "tips/mobile-configuration.html",
    "revision": "eca3835afd4264f72ee36fa36d3bbee3"
  },
  {
    "url": "tools/browsers.html",
    "revision": "946626d9cf4a5b57523fd7c595b2c607"
  },
  {
    "url": "tools/cli.html",
    "revision": "6cb1b3745532bd6f956047ce6be395ec"
  },
  {
    "url": "tools/db.html",
    "revision": "4a0833c9aa66ea0c9d38b34f465d5584"
  },
  {
    "url": "tools/documentation.html",
    "revision": "0aa18fffdd1851c5aed9899019580220"
  },
  {
    "url": "tools/index.html",
    "revision": "f5ad349337fc78fbfdf05ded2e8c4693"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "b607abb5b8920b1062c0f0b3a8a200ac"
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
