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
    "revision": "012ea0ee9d280383c0d19bb1cc9730e2"
  },
  {
    "url": "about/contact.html",
    "revision": "edbb4a6d58b215921fd32775b6651524"
  },
  {
    "url": "about/contributing.html",
    "revision": "4ba89d33dbcfcd8dbeac860424e9b793"
  },
  {
    "url": "about/index.html",
    "revision": "9fb966fb6e6885d4f95999240ece4f48"
  },
  {
    "url": "about/license.html",
    "revision": "aaf9ec3296fae861d751d674eec68056"
  },
  {
    "url": "about/roadmap.html",
    "revision": "31c93b9da86ce2cfa0b27f617bcbb476"
  },
  {
    "url": "api/core/application.html",
    "revision": "35f75fc627465e26028b7c4c8d0c4179"
  },
  {
    "url": "api/core/components.html",
    "revision": "098a9d4a9f4fd46d518c1d96cd7c8e47"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "ba11f145f4a8db77c1a1c12fbc940c3c"
  },
  {
    "url": "api/core/index.html",
    "revision": "0f00b6febd28d3cae2ff8d1be65ef4d9"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "70e3541afecf9e64bfda5b4616f18a69"
  },
  {
    "url": "api/core/services.html",
    "revision": "6a67428ee76a2027dfac516a4c5ee2e0"
  },
  {
    "url": "api/index.html",
    "revision": "f40063cf95fc138167119b436d815193"
  },
  {
    "url": "api/map/components.html",
    "revision": "fd6c90d7ff407c4236d15f676c6d3514"
  },
  {
    "url": "api/map/globe-mixins.html",
    "revision": "e0fc6937986c65f496e01d174f890199"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "46cb078275eab7d99407c1b1dbdd10e8"
  },
  {
    "url": "api/map/index.html",
    "revision": "d8fa40bc8fdd400c400bc81e2d96d8c8"
  },
  {
    "url": "api/map/map-mixins.html",
    "revision": "915063f50f0eb267541a8989f219abfa"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "be565a2ef9c90748a2dde736c12c0f53"
  },
  {
    "url": "api/map/services.html",
    "revision": "55e8b76a138925181a06e2659018db92"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "5636d4da5d00ebfde4f1cca25086f040"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "1a14dab54bf3ced32daf78348f97ed82"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "65c4a988d0f56d439e69117a739fe426"
  },
  {
    "url": "architecture/index.html",
    "revision": "692c78e80f74ae6aaa60ede04d01d549"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "ffccccad1424630c4dc4e1004462e9fd"
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
    "url": "assets/js/45.ceca7bc0.js",
    "revision": "d0cc6f93bc09126434f96427ad110218"
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
    "url": "assets/js/app.b8f0a006.js",
    "revision": "4acb3e9b10c7b0a3031c4341b3bed4c4"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "7a5aa38f1d7e86212f4fe2e54c3c11a8"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "fda2edcea86d367e1b667127b971b288"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "3790b9c58bc904c314f6e2f10a03bfef"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "2af950ae1c7b5ec536214619b3a9f990"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "3a32d096edb8081c968cdff078cb995a"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "49126db13fcad0c2ab346067660a9267"
  },
  {
    "url": "guides/index.html",
    "revision": "33058fe02ac00ae2577e85db573c0252"
  },
  {
    "url": "index.html",
    "revision": "f6d0792fbb1b29c39fc05ae5ea42a2b1"
  },
  {
    "url": "tips/app-development.html",
    "revision": "2aa0b9f5ff58a556c064ce874ff10edf"
  },
  {
    "url": "tips/index.html",
    "revision": "5cb0b30c7c1181bc7191cb5f4d675955"
  },
  {
    "url": "tips/mobile-configuration.html",
    "revision": "accc308624e22cd7c31ecf018792bb75"
  },
  {
    "url": "tools/browsers.html",
    "revision": "47bba4ba14061c77a6b411adea8fef99"
  },
  {
    "url": "tools/cli.html",
    "revision": "92cb981f846c6e3f403ea054eafd5bf1"
  },
  {
    "url": "tools/db.html",
    "revision": "01a8806107b9d1749fe8aaf79b7c86fa"
  },
  {
    "url": "tools/documentation.html",
    "revision": "ea2c58da140a9e99096234838af1e7b8"
  },
  {
    "url": "tools/index.html",
    "revision": "0d6db4e497aa1f5476d49d68699ada8e"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "2755ceaf1bdf6f555f85f1bcda1f1dd4"
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
