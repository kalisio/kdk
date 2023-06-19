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
    "revision": "2fd2849c4f5246c36fde9eae65c5e8dd"
  },
  {
    "url": "about/contact.html",
    "revision": "85bd0aeb81a9e2312fba62290c60f2b6"
  },
  {
    "url": "about/contributing.html",
    "revision": "3db868d8b8cfd36f1fe1ea4ff1c340f2"
  },
  {
    "url": "about/index.html",
    "revision": "6ac9d7d52fd3a4195b24eb279901c34e"
  },
  {
    "url": "about/license.html",
    "revision": "4cb87061541572ef5db7752a2e734554"
  },
  {
    "url": "about/roadmap.html",
    "revision": "01fb24e1b8e27166cd236e98b6393609"
  },
  {
    "url": "api/core/application.html",
    "revision": "bd3260e18d61f13d06870f5aaeaef489"
  },
  {
    "url": "api/core/components.html",
    "revision": "fb16b5ade82d91079efd624f36dd5f84"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "7dbbad1cb8dcc9e2083ce30731c9c5d7"
  },
  {
    "url": "api/core/index.html",
    "revision": "59898084d8e19abcf293cbfd9d2e6171"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "a9e83f9651eda84b78e96d83b252f9cb"
  },
  {
    "url": "api/core/services.html",
    "revision": "1fc1758b50f2d5051a55376d4eefc6e9"
  },
  {
    "url": "api/index.html",
    "revision": "855d31fb6e463f9903153c952073efe1"
  },
  {
    "url": "api/map/components.html",
    "revision": "c9a7716d216ac4ba72ede7eb1550a03d"
  },
  {
    "url": "api/map/globe-mixins.html",
    "revision": "e5d472b721b10427da59512f12b8c74a"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "d772177662fe897bf08ac5d5ae46814d"
  },
  {
    "url": "api/map/index.html",
    "revision": "17843a275bfc97e0d843d11e2c4565b1"
  },
  {
    "url": "api/map/map-mixins.html",
    "revision": "38f58b8e53dcc05ca8c069f445f53125"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "a115a4e402b8d43fa1e22e14aa8c2a8e"
  },
  {
    "url": "api/map/services.html",
    "revision": "7abb8fbfb083bf3816b9af086d8cf293"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "04db80c1d3bb0b7eff59f9a51a5fddbc"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "c8d6b36f8a61f2b1dc5ae7e5025ef270"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "62527813e2692e0aad8e7bd4ea6ccf9a"
  },
  {
    "url": "architecture/index.html",
    "revision": "84094f1adec632dac513fb85ade172fe"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "f3d1b509de26035c93b2fedb27a3ec91"
  },
  {
    "url": "assets/css/0.styles.1578d2ba.css",
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
    "url": "assets/js/10.713eef53.js",
    "revision": "0fb8c4ef4fbed5a0937878c26201c741"
  },
  {
    "url": "assets/js/11.3e65ed1e.js",
    "revision": "5b770efb2eaa548bf508a75c7a78f684"
  },
  {
    "url": "assets/js/12.b8198c72.js",
    "revision": "140e93e52349237ba77a1916517e7117"
  },
  {
    "url": "assets/js/13.01b090a1.js",
    "revision": "078cb061b1409e43e903f6b989f277ca"
  },
  {
    "url": "assets/js/14.b4e7c452.js",
    "revision": "ecd46714472f0ae53603017d19169291"
  },
  {
    "url": "assets/js/15.0a1f86ef.js",
    "revision": "b23cc6a0c884b41eff3c6e8c0823f636"
  },
  {
    "url": "assets/js/16.5055a791.js",
    "revision": "33eee2ae53989608c35f146dd856641b"
  },
  {
    "url": "assets/js/17.4002c5d9.js",
    "revision": "36d7df9e894c7f44e2e963f19b186217"
  },
  {
    "url": "assets/js/18.93e6efde.js",
    "revision": "d0c4f746bc5ab6bbe1441add0bb77dec"
  },
  {
    "url": "assets/js/19.4b3d5f35.js",
    "revision": "f299e039eeb6ddc1fb5aae6af7be533f"
  },
  {
    "url": "assets/js/2.d7186da2.js",
    "revision": "bce7576f20d7325a7557a7b4e189e171"
  },
  {
    "url": "assets/js/20.6add4da2.js",
    "revision": "d6a76ef6e41994781aeaff4af5a18b44"
  },
  {
    "url": "assets/js/21.17c05e26.js",
    "revision": "4ba8d4a19577c3194474840b06abbed1"
  },
  {
    "url": "assets/js/22.e1b84e2f.js",
    "revision": "50a2e846467618e199f787a76b19916b"
  },
  {
    "url": "assets/js/23.93ca1ead.js",
    "revision": "a299420e6c114b37a3f8e285e4a8db36"
  },
  {
    "url": "assets/js/24.7b1af4e5.js",
    "revision": "fdc8fd148df4b090aac6b98c619a896e"
  },
  {
    "url": "assets/js/25.afd7cc95.js",
    "revision": "d0a21a5a7c249aa95e3005f62e2529a8"
  },
  {
    "url": "assets/js/26.250c90cf.js",
    "revision": "1b2c485a94be39ee7f481f619914c379"
  },
  {
    "url": "assets/js/27.ed8db689.js",
    "revision": "a4b3ed84143150688d9891db8e214efa"
  },
  {
    "url": "assets/js/28.11695485.js",
    "revision": "25df1a580bb627f95ae283c2c2cf3e05"
  },
  {
    "url": "assets/js/29.af8b9095.js",
    "revision": "26ff0c1411ccebd343f6293771b34e2d"
  },
  {
    "url": "assets/js/3.80f5f304.js",
    "revision": "7ba9079d3e9f15e4c9a242880a053c58"
  },
  {
    "url": "assets/js/30.981e41e2.js",
    "revision": "f764bca0ab55bb7207c349ecee4c6125"
  },
  {
    "url": "assets/js/31.cb47d074.js",
    "revision": "b8aace1055d460af094439fb321265e7"
  },
  {
    "url": "assets/js/32.bbf98730.js",
    "revision": "b3a5bf164e317765958ea6ed905ceca5"
  },
  {
    "url": "assets/js/33.1bca6407.js",
    "revision": "1a6853b9c1fc27fbbb32918a261c314a"
  },
  {
    "url": "assets/js/34.9fe39276.js",
    "revision": "76804ae7101f753ad129d09ea6e7d625"
  },
  {
    "url": "assets/js/35.0a011e4f.js",
    "revision": "10f792fa2388b13d6bd385b22f23ef46"
  },
  {
    "url": "assets/js/36.e15b69e6.js",
    "revision": "884fa848b785e317da34f86851be80d9"
  },
  {
    "url": "assets/js/37.70275302.js",
    "revision": "caf832f7bc0d2c259d1a3e1a91566afc"
  },
  {
    "url": "assets/js/38.088556f5.js",
    "revision": "fa0c68b449e88f1552beffdb57b767b4"
  },
  {
    "url": "assets/js/39.d6eb67c0.js",
    "revision": "7a87e88cfc0e95b3678cfdda5744d71c"
  },
  {
    "url": "assets/js/4.92e69485.js",
    "revision": "dc4b89d1a58cf0d37faddbdfb77949d8"
  },
  {
    "url": "assets/js/40.be4754a0.js",
    "revision": "204c400e9da5a9656e444899cab9ea91"
  },
  {
    "url": "assets/js/41.e5ad8944.js",
    "revision": "ce3da9eef4c821f4d170e5241a08ee15"
  },
  {
    "url": "assets/js/42.9c2a9378.js",
    "revision": "2d199e75c8e9bd56ddc5e8453022331d"
  },
  {
    "url": "assets/js/43.a2d33547.js",
    "revision": "2751f8075b4ef84b6ff7b0b541d8e635"
  },
  {
    "url": "assets/js/44.826424da.js",
    "revision": "023bd85c203c142a28dbee555f6a7b4e"
  },
  {
    "url": "assets/js/45.4f4abe07.js",
    "revision": "006d5cc633f779ba221f0a17e96498b9"
  },
  {
    "url": "assets/js/46.b3a22b97.js",
    "revision": "bb60f492fa6ee1b7d384e17d42118109"
  },
  {
    "url": "assets/js/47.42691ed4.js",
    "revision": "2e318096f0c904e94f8abb1265d0fb34"
  },
  {
    "url": "assets/js/48.00300fe5.js",
    "revision": "bf5517b9d12ad84ac4c06742d678c43c"
  },
  {
    "url": "assets/js/49.098ea32d.js",
    "revision": "a05577f90ebdf5d5e086304452e28373"
  },
  {
    "url": "assets/js/5.0b70087f.js",
    "revision": "9901966c015d4ac6482e6fa7e989c180"
  },
  {
    "url": "assets/js/50.f3278f63.js",
    "revision": "daccc4169d4fd2bde71b4ff0094599e3"
  },
  {
    "url": "assets/js/51.bbf4ad2c.js",
    "revision": "32f8584e640becef355fc562a03dce42"
  },
  {
    "url": "assets/js/52.243ab128.js",
    "revision": "9ec7ab4b4b6f3ca6c7a90b423d017a1c"
  },
  {
    "url": "assets/js/53.853565fc.js",
    "revision": "6b7a77005dc8f4729f1c907eb6b5cb4a"
  },
  {
    "url": "assets/js/54.92ba700c.js",
    "revision": "330eb85abb6b1babb0fd54b9b656bda3"
  },
  {
    "url": "assets/js/55.6a97da67.js",
    "revision": "38c671ef95f14a49d6964dc2aa68c139"
  },
  {
    "url": "assets/js/6.85c60f0d.js",
    "revision": "a28ea45fe0dc0cae3343068d2cd4f208"
  },
  {
    "url": "assets/js/7.3383af26.js",
    "revision": "8942ad93bf92dfcd63fcbcd193d12710"
  },
  {
    "url": "assets/js/8.485d23dd.js",
    "revision": "dda8bcc224c5525d35eb2e6816d25b40"
  },
  {
    "url": "assets/js/9.5ff4a821.js",
    "revision": "cc0bac61c428a453af821bc1dcc37e84"
  },
  {
    "url": "assets/js/app.4fa91a9a.js",
    "revision": "70953c886115df8ccded3fcff32ff914"
  },
  {
    "url": "guides/basics/introduction.html",
    "revision": "6c3da3a178b078a57823f87d2353504e"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "692d102b216ea3367db2b4a06b7efb05"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "265972cdb41c92e990785b0246da5635"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "b86f854b13613c91637fede08fa49cc1"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "ea94a094514e1ef8921e4fefb80d45ff"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "1ae23d8b67d3b636a676620e85ef7b92"
  },
  {
    "url": "guides/development/test.html",
    "revision": "6403afd9bfe5b4c6dc0f7831efe8692d"
  },
  {
    "url": "guides/index.html",
    "revision": "eabf06d19a717a232a5c95f359d25870"
  },
  {
    "url": "index.html",
    "revision": "e37ecf4d63c9bcc1871bbc1afeeb0702"
  },
  {
    "url": "tips/app-development.html",
    "revision": "4c9be6803b188897c6ad88133d16a296"
  },
  {
    "url": "tips/index.html",
    "revision": "ae17b029af0f5883b29f3f11bae5f71d"
  },
  {
    "url": "tips/mobile-configuration.html",
    "revision": "403b163bf227f04d57bb12f9d024982a"
  },
  {
    "url": "tools/browsers.html",
    "revision": "e30ce067a0cfeef3ba85addf871286d2"
  },
  {
    "url": "tools/cli.html",
    "revision": "3e52dc8ff2b887bf3a69fab715a0e75e"
  },
  {
    "url": "tools/db.html",
    "revision": "45769e58f505279b5342a67a2f2f4849"
  },
  {
    "url": "tools/documentation.html",
    "revision": "2ff604ac70954846309b12dbb255e571"
  },
  {
    "url": "tools/index.html",
    "revision": "28d2a9edf6206cc5a924f5de0a7931f2"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "057f3c221f9fccca706c70088f021e56"
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
