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
    "revision": "ac030e33ac0be4cec18d72bc854adc2f"
  },
  {
    "url": "about/contact.html",
    "revision": "a1f31b618aeda67a30a7a6edb42f160a"
  },
  {
    "url": "about/contributing.html",
    "revision": "f79fe0fcc7a3ceb35f8f10c83f4e8480"
  },
  {
    "url": "about/index.html",
    "revision": "964b10cabacfd3ec59c5ce12e0d42594"
  },
  {
    "url": "about/license.html",
    "revision": "20ddeee7ad6cae864e8143315d65019b"
  },
  {
    "url": "about/roadmap.html",
    "revision": "45e0d156ef36e8dd621afd60135348ce"
  },
  {
    "url": "api/core/application.html",
    "revision": "3acd84fccc8ffcabcc20adddad95c471"
  },
  {
    "url": "api/core/components.html",
    "revision": "67cccc35072f9e88660dc050c4fa1ef6"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "d7801d577f938287b5f5f8c3571778cc"
  },
  {
    "url": "api/core/index.html",
    "revision": "44d0244ffb0fad10a7633b8c075e616d"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "89dcab09c6b0edabdbed5a30b7eec347"
  },
  {
    "url": "api/core/services.html",
    "revision": "fd432083a65ee2a6ec2c98048e63d22f"
  },
  {
    "url": "api/index.html",
    "revision": "bdf6b9ae70cf1616d28610899b87fc61"
  },
  {
    "url": "api/map/components.html",
    "revision": "51f856817884c496face10b978e91642"
  },
  {
    "url": "api/map/globe-mixins.html",
    "revision": "81297a1f0a87fb701dfd656b017ec6f1"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "5e8f6927852f97542a6c6f463810c9a6"
  },
  {
    "url": "api/map/index.html",
    "revision": "f5014d1bf5eaa4cbf31afe201cb657bf"
  },
  {
    "url": "api/map/map-mixins.html",
    "revision": "26e84f8bd06d21d5e3530091ca9ac16b"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "2f63fcd009d361791830d1e9a4af0ae6"
  },
  {
    "url": "api/map/services.html",
    "revision": "644e35e0244b0939114c10a4c9baa153"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "fb806a22613c68d303524f99d9c8a026"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "8d2cae3a26dd318a4f3f9d0071cf8281"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "ecc17ac3760ebb3c9fc4d19e534095ec"
  },
  {
    "url": "architecture/index.html",
    "revision": "0b76dfaf63230c46026b6a298decc4f8"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "6d93da638699ecc5f9f1e48445b65993"
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
    "url": "assets/js/13.8f308100.js",
    "revision": "922e019ce1b61aa43472d3ec1e1195ba"
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
    "url": "assets/js/16.cf048341.js",
    "revision": "5529ac57e2695e5bb8c5baac0fcb328a"
  },
  {
    "url": "assets/js/17.a50dd065.js",
    "revision": "809d3448a0f22f971131818b420bc860"
  },
  {
    "url": "assets/js/18.ea51a0da.js",
    "revision": "c8c893faf14180d493d502b42fe79945"
  },
  {
    "url": "assets/js/19.fe4d8be1.js",
    "revision": "07aa5792c1782a86a003e0f33e884491"
  },
  {
    "url": "assets/js/2.74a99991.js",
    "revision": "522673154cf75e829fb76625aa205833"
  },
  {
    "url": "assets/js/20.813b16ff.js",
    "revision": "6e5fcf10aa1dfd02967d77b182b606a7"
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
    "url": "assets/js/32.571e4ca9.js",
    "revision": "cf7084dce594769debe0bbe4d06cfa66"
  },
  {
    "url": "assets/js/33.4b38a62b.js",
    "revision": "92a336c74a902c01728fb982a935fc2a"
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
    "url": "assets/js/38.9b24e162.js",
    "revision": "97ba0f8cc263431f15cfb30f895aee63"
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
    "url": "assets/js/40.c6d28aff.js",
    "revision": "821018d3b220e80c3e6184012d64c50c"
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
    "url": "assets/js/6.cf465dca.js",
    "revision": "6ef7993dc0fcd72e2c6d69c2dcb5d5bd"
  },
  {
    "url": "assets/js/7.a434787a.js",
    "revision": "88ee2bcb8f0730ef995cf504c60d1b63"
  },
  {
    "url": "assets/js/8.63952efe.js",
    "revision": "a0ea7d86215a372c23c14314773105f9"
  },
  {
    "url": "assets/js/9.07565a82.js",
    "revision": "e20f64a28b807e3ba0a525f968ea10c2"
  },
  {
    "url": "assets/js/app.78490a01.js",
    "revision": "f7d9d5d691d0430d49ca1183613218da"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "4336c27a8ea4a455c9170475b7e3adfb"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "468cc1109b5bc5fb70ddff716959dff9"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "d443182e9f771be431b9d0ca76310c6c"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "bfb9d1c655616e54850b289dec52e90b"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "13adea91e7650920ea5e8e0dee228d79"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "34aed032a61f6b8ce301b7809f9780f6"
  },
  {
    "url": "guides/index.html",
    "revision": "f568ed702ae3291593e1381db9a6b0cd"
  },
  {
    "url": "index.html",
    "revision": "cc4f7b96ba9dfd1fce2220b4fd02b12a"
  },
  {
    "url": "tips.html",
    "revision": "6e240df74821caec9d6de990bd1642ae"
  },
  {
    "url": "tools/browsers.html",
    "revision": "715f036f8794aa7abae850d47d9a388d"
  },
  {
    "url": "tools/cli.html",
    "revision": "8da5337f10589dc9e27a03a19c2f0f77"
  },
  {
    "url": "tools/db.html",
    "revision": "6ae6dc181209fca475c0a0bf70d38ad2"
  },
  {
    "url": "tools/documentation.html",
    "revision": "fa52dba5601d6fb5840d23b52f536bcb"
  },
  {
    "url": "tools/index.html",
    "revision": "38f50d154ee511e6bda7a801e006e11d"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "000fa1a125c18f647ef39e692b5e07c8"
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
