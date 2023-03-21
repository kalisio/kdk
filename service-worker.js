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
    "revision": "da3d3a93c3b173deefc90265ceb510ee"
  },
  {
    "url": "about/contact.html",
    "revision": "4e8b848979357836a751e5ab799ce491"
  },
  {
    "url": "about/contributing.html",
    "revision": "d657f8b54f60e9b7fac315bf6178a51c"
  },
  {
    "url": "about/index.html",
    "revision": "299222c031ab981be15a2d7db611d8a3"
  },
  {
    "url": "about/license.html",
    "revision": "f168a359da34681e5f1732916f5d0ed0"
  },
  {
    "url": "about/roadmap.html",
    "revision": "4e3feb8aa695cec3994746b660c0da0f"
  },
  {
    "url": "api/core/application.html",
    "revision": "c68d797ab090d6325cefd135163234be"
  },
  {
    "url": "api/core/components.html",
    "revision": "1d889e19b1b44da1f365192dac36a536"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "a4fbee76ca77f5e6bc074f3cca3f6c11"
  },
  {
    "url": "api/core/index.html",
    "revision": "ed3f732bd3c769bc9a5e1d2bf12e4c12"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "52055b672ea741337723e4bec9cda38e"
  },
  {
    "url": "api/core/services.html",
    "revision": "2e21d288b55f54d823d10335dda6d188"
  },
  {
    "url": "api/index.html",
    "revision": "913c2988d0dcc20e25e4711238673e76"
  },
  {
    "url": "api/map/components.html",
    "revision": "9cc06828eb01e956d025e1a3e401e77c"
  },
  {
    "url": "api/map/globe-mixins.html",
    "revision": "ebad9686edc6e17be282900ace9b7727"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "b348d3b2ab8dcc6ea9c78f3fd7d34fea"
  },
  {
    "url": "api/map/index.html",
    "revision": "78cd027c5586b8c184f7c5bb3060ab3d"
  },
  {
    "url": "api/map/map-mixins.html",
    "revision": "5ab93c75371d7fc3fa2823a3a876e2fe"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "45fde65c38236f3fbdba08f559d5327d"
  },
  {
    "url": "api/map/services.html",
    "revision": "c06b3c7694bb6da340bccbd84f0b5b78"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "591c17f97f2d324fe2e83ac33373a28e"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "6c3ca8fd9cc1d6a48758952618386c89"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "2b9bcc6a99311e15e94f2932918a56fd"
  },
  {
    "url": "architecture/index.html",
    "revision": "4768c32731c6aa3c5fe4b17ae599e71c"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "3b697411a98d646b9ad8a9aae199de1a"
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
    "url": "assets/js/10.12661d4d.js",
    "revision": "0745c0b62b38b14507e06552502ce98c"
  },
  {
    "url": "assets/js/11.c3785e50.js",
    "revision": "3cd35376c7b7ba78706f4b73c05ec4fd"
  },
  {
    "url": "assets/js/12.bc9d229a.js",
    "revision": "8b6ba157491ce5846ae47056cfd388b8"
  },
  {
    "url": "assets/js/13.db97246f.js",
    "revision": "53831b9a15d7eac67d33f71746ab21e1"
  },
  {
    "url": "assets/js/14.a496ce46.js",
    "revision": "e9736765cfa7767a90e1a05fb4273628"
  },
  {
    "url": "assets/js/15.127694ab.js",
    "revision": "3f83672cc3f123734936762705987c0e"
  },
  {
    "url": "assets/js/16.f84303f9.js",
    "revision": "ceff437232873b6bfba1d6b2ba8fd525"
  },
  {
    "url": "assets/js/17.3c43be07.js",
    "revision": "790f8415bd98645d14785e92fd773ccd"
  },
  {
    "url": "assets/js/18.2b395f3f.js",
    "revision": "c87c316a83dd35f73b56155606ddce53"
  },
  {
    "url": "assets/js/19.b7461ecb.js",
    "revision": "e08f7eeb8f3101f51092c4d3004aa2ba"
  },
  {
    "url": "assets/js/2.9502fc22.js",
    "revision": "e77e9327f094db4e6afaa28c96907b1e"
  },
  {
    "url": "assets/js/20.8aa4bfe0.js",
    "revision": "f94ef1c750c92e976530af5634eeac6d"
  },
  {
    "url": "assets/js/21.3ed94c19.js",
    "revision": "64b2482d108ca2595d8e96d256fac6e4"
  },
  {
    "url": "assets/js/22.9440fba5.js",
    "revision": "d6240acad7f652b469ba1cecbcd8571a"
  },
  {
    "url": "assets/js/23.f0b796c1.js",
    "revision": "801cb50c397a3bb9c0db49fd15fab952"
  },
  {
    "url": "assets/js/24.443e3e46.js",
    "revision": "c99a9dcef9a7701de928c0d680e929b3"
  },
  {
    "url": "assets/js/25.ac4022a4.js",
    "revision": "4ef10725ce8598c49f4ba029cbb9fbd5"
  },
  {
    "url": "assets/js/26.ff383a26.js",
    "revision": "89e764f114e9bff48eb4e3a0f0728d7a"
  },
  {
    "url": "assets/js/27.155903ac.js",
    "revision": "ec5af62c22a9e76e1ab102d89839db98"
  },
  {
    "url": "assets/js/28.1c58c4e5.js",
    "revision": "e783ff8d35ad0a5a54eb3584a33f7fde"
  },
  {
    "url": "assets/js/29.a1a966ae.js",
    "revision": "583f522fc9c7d4ef80852b87e5d14493"
  },
  {
    "url": "assets/js/3.9c11f5a4.js",
    "revision": "33264f39df6989a342e57bde90548778"
  },
  {
    "url": "assets/js/30.29c26579.js",
    "revision": "ee4e2630a2595b8677f319390bd92dc4"
  },
  {
    "url": "assets/js/31.903dfab9.js",
    "revision": "aff3e515054035b60eb31a64c4bbcc92"
  },
  {
    "url": "assets/js/32.f3bdf58a.js",
    "revision": "4894d65b8bf3d92e94c26df390b7448e"
  },
  {
    "url": "assets/js/33.d9aab068.js",
    "revision": "8b43722ef4427b06970a407a25a851f3"
  },
  {
    "url": "assets/js/34.e5ce9fb8.js",
    "revision": "d8671874fd8bda4066cd1cdab0384a7b"
  },
  {
    "url": "assets/js/35.035c456d.js",
    "revision": "832e9855c360ac81f5136219a2c40f57"
  },
  {
    "url": "assets/js/36.93eb42e0.js",
    "revision": "1abe70e3fd2536c616afba2ca0271c2d"
  },
  {
    "url": "assets/js/37.c64eff96.js",
    "revision": "42e6932e10c1cea543f82aae5062fe08"
  },
  {
    "url": "assets/js/38.27b622e3.js",
    "revision": "65a9dafe52a931dbbffb542a26be19ca"
  },
  {
    "url": "assets/js/39.267b5042.js",
    "revision": "9316b49753d54d3c660ce33324cc56b0"
  },
  {
    "url": "assets/js/4.92f4a175.js",
    "revision": "d39a323aebb582878b9dabe291646f00"
  },
  {
    "url": "assets/js/40.8517680d.js",
    "revision": "165a93c7801dc0ffb06bc32ec2da1429"
  },
  {
    "url": "assets/js/41.d6e8a0b6.js",
    "revision": "03663b3d067925a03e9530a083c13e45"
  },
  {
    "url": "assets/js/42.a9f72ce3.js",
    "revision": "d4393fe1f93689f4451eb7d5b1ee2ecc"
  },
  {
    "url": "assets/js/43.6ed48108.js",
    "revision": "48f0b86e93da256eb9d6d207bf827177"
  },
  {
    "url": "assets/js/44.21fe2b23.js",
    "revision": "b1c126ef8d1d058adf1ee9bf6877d6ec"
  },
  {
    "url": "assets/js/45.622089ae.js",
    "revision": "42508be6353fca9a553e813745be0a1c"
  },
  {
    "url": "assets/js/46.8357005f.js",
    "revision": "a02850d09d8ff706396bee852f1ff385"
  },
  {
    "url": "assets/js/47.e1e8f0e5.js",
    "revision": "150da83e934ebd11fab4572493e09d5c"
  },
  {
    "url": "assets/js/48.84268427.js",
    "revision": "710282276affbab3f0a6c35aeae1f9db"
  },
  {
    "url": "assets/js/49.d1b0e8f2.js",
    "revision": "3478508f43ca7d4923fbc4558cd41cfc"
  },
  {
    "url": "assets/js/5.b13e647c.js",
    "revision": "dba9fffe3b6f663a447165687f7c4dfb"
  },
  {
    "url": "assets/js/50.070f40f6.js",
    "revision": "b375229e3083437782d6017f8a186cfa"
  },
  {
    "url": "assets/js/51.8fc9e45d.js",
    "revision": "95c12db380e8e96529741becfda69b11"
  },
  {
    "url": "assets/js/52.0ab46074.js",
    "revision": "3e4b3ac1730cf50a331aba99dec162a2"
  },
  {
    "url": "assets/js/53.a57f1c16.js",
    "revision": "8b7fbd71529805975c3910f503c68bcc"
  },
  {
    "url": "assets/js/54.97cb6069.js",
    "revision": "f577577b030c445a12a231903aba5999"
  },
  {
    "url": "assets/js/55.9d36ae05.js",
    "revision": "1a6571e2bcf4bf41eac77caf169e035e"
  },
  {
    "url": "assets/js/6.456666ab.js",
    "revision": "53f234f1bf2265582e30a83cf62b43f5"
  },
  {
    "url": "assets/js/7.39cf7a32.js",
    "revision": "a8b58708ab5a918acab74d6579d5d462"
  },
  {
    "url": "assets/js/8.7de9a5c3.js",
    "revision": "96697deb6818888b61c74c1a9bc6c066"
  },
  {
    "url": "assets/js/9.76ccdbfc.js",
    "revision": "e20f64a28b807e3ba0a525f968ea10c2"
  },
  {
    "url": "assets/js/app.f93cfe76.js",
    "revision": "7e80fc4aa41e5a21ff0ccd73e4855d9c"
  },
  {
    "url": "guides/basics/introduction.html",
    "revision": "af8c6b91ea4248e850a743b870bb4dbd"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "dabe51f8e6ab95a35257b14bb7171b67"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "903a68e40f4df45745f2f6bc0470e50f"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "fa842b1323e96084dad3516a69456f1a"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "13e00c5b6d12adacb2febd26e2c26227"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "16c5b6f3984aff2960f16200cfb958f9"
  },
  {
    "url": "guides/development/test.html",
    "revision": "525e0931073c5f6aa6b40ea4c9956412"
  },
  {
    "url": "guides/index.html",
    "revision": "6d948967794ec2440b4a9431d7bdbbad"
  },
  {
    "url": "index.html",
    "revision": "1cbbaee555224daadd0f52377e795fc8"
  },
  {
    "url": "tips/app-development.html",
    "revision": "506450f600e07ae8d3c51d957cf84a5c"
  },
  {
    "url": "tips/index.html",
    "revision": "660021bace9e773c491a53a56217166b"
  },
  {
    "url": "tips/mobile-configuration.html",
    "revision": "8261a9bb2272c0c1fd5961608a2bf8df"
  },
  {
    "url": "tools/browsers.html",
    "revision": "bd1a8dc51ce0fd7306b61bf335a21e3f"
  },
  {
    "url": "tools/cli.html",
    "revision": "dd735f60958cd9e0a21e27c0a331458b"
  },
  {
    "url": "tools/db.html",
    "revision": "0c8376dfe1ce8d13ae4475078fedad0e"
  },
  {
    "url": "tools/documentation.html",
    "revision": "df1f94292b9f54ed86b33cd3db90a547"
  },
  {
    "url": "tools/index.html",
    "revision": "a47860f865bb896ffa01e84f17c72c53"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "516237d87f2ba2b4e1f20357bbd7d09d"
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
