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
    "revision": "82f963226ffc50010ede3afede6a8652"
  },
  {
    "url": "about/contact.html",
    "revision": "9ad3af898c3eb818b5598fa5c7e2e528"
  },
  {
    "url": "about/contributing.html",
    "revision": "1a19c55986d3d45061cd53746f340301"
  },
  {
    "url": "about/index.html",
    "revision": "6d8061c14e9a398e1b7ff6384055927a"
  },
  {
    "url": "about/license.html",
    "revision": "26bdb96b5cd78c2e4880ecd298465724"
  },
  {
    "url": "about/roadmap.html",
    "revision": "b07171388822f2c42a14248c207f478e"
  },
  {
    "url": "api/core/application.html",
    "revision": "1751c2e52228dbe29ebd57fc35d92025"
  },
  {
    "url": "api/core/components.html",
    "revision": "4ee8c0553d995fafdd5fc8d70ccdced4"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "7d310306de47ce0750976cf875289bac"
  },
  {
    "url": "api/core/index.html",
    "revision": "b3bf127fc78095956c39d0a8e3ccec93"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "961b0aa91da9c0d6d6eee40b387e0476"
  },
  {
    "url": "api/core/services.html",
    "revision": "d0bede7c950be9738396c8e0539abae4"
  },
  {
    "url": "api/index.html",
    "revision": "994f7b3c64a20dc32af05f6c7919cf99"
  },
  {
    "url": "api/map/components.html",
    "revision": "72fcd4b52ff7c06f8bed4bc089193cef"
  },
  {
    "url": "api/map/globe-mixins.html",
    "revision": "d81cbbb3899241fa5976e5a812fb2463"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "75edf0b8e3e7bda6969693c525424532"
  },
  {
    "url": "api/map/index.html",
    "revision": "fc575ad7b84c46022941aa4732d3f490"
  },
  {
    "url": "api/map/map-mixins.html",
    "revision": "ed49bd2e027abad04c2995df68ffe096"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "eab65212e369acba3ccb7f0d52eed8f8"
  },
  {
    "url": "api/map/services.html",
    "revision": "4e373bc8c69dccd1f127166de1d87502"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "e8bc5a62a29a1395d01ea18a252dbfed"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "2817fc1a138501f126408271fb7dd1e3"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "3faf37f869179c33c69cd211fee89b54"
  },
  {
    "url": "architecture/index.html",
    "revision": "84ec6b609e9faf71c16432c7f3458692"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "bdefbc2310674a3fdc5e5415e3e1285b"
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
    "url": "assets/js/10.781be977.js",
    "revision": "0745c0b62b38b14507e06552502ce98c"
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
    "url": "assets/js/13.f15b4a74.js",
    "revision": "a84b431cb0fa955ac0e5c5f364031706"
  },
  {
    "url": "assets/js/14.47c0a2b4.js",
    "revision": "e9736765cfa7767a90e1a05fb4273628"
  },
  {
    "url": "assets/js/15.86609f25.js",
    "revision": "3f83672cc3f123734936762705987c0e"
  },
  {
    "url": "assets/js/16.b87407a6.js",
    "revision": "ceff437232873b6bfba1d6b2ba8fd525"
  },
  {
    "url": "assets/js/17.8cf5bdb8.js",
    "revision": "790f8415bd98645d14785e92fd773ccd"
  },
  {
    "url": "assets/js/18.76c98707.js",
    "revision": "c87c316a83dd35f73b56155606ddce53"
  },
  {
    "url": "assets/js/19.5917d645.js",
    "revision": "e08f7eeb8f3101f51092c4d3004aa2ba"
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
    "url": "assets/js/21.6c0b61a8.js",
    "revision": "9e064e92a17d099e92a4eca3f8e682de"
  },
  {
    "url": "assets/js/22.6b73cedb.js",
    "revision": "d6240acad7f652b469ba1cecbcd8571a"
  },
  {
    "url": "assets/js/23.ec6c0ed6.js",
    "revision": "801cb50c397a3bb9c0db49fd15fab952"
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
    "url": "assets/js/30.8441cf9c.js",
    "revision": "ee4e2630a2595b8677f319390bd92dc4"
  },
  {
    "url": "assets/js/31.8c36ca54.js",
    "revision": "aff3e515054035b60eb31a64c4bbcc92"
  },
  {
    "url": "assets/js/32.856e5399.js",
    "revision": "1d4dd5ce87c3b30be41a8c0e1085b6b3"
  },
  {
    "url": "assets/js/33.42b7fe7f.js",
    "revision": "5af46a182aacb734bb2261f4934ecab5"
  },
  {
    "url": "assets/js/34.97fee52f.js",
    "revision": "d8671874fd8bda4066cd1cdab0384a7b"
  },
  {
    "url": "assets/js/35.688cf2ca.js",
    "revision": "832e9855c360ac81f5136219a2c40f57"
  },
  {
    "url": "assets/js/36.7a31460b.js",
    "revision": "1abe70e3fd2536c616afba2ca0271c2d"
  },
  {
    "url": "assets/js/37.629ed788.js",
    "revision": "42e6932e10c1cea543f82aae5062fe08"
  },
  {
    "url": "assets/js/38.d6cd5458.js",
    "revision": "cadc5f4c0beb4ab49687898d042e791d"
  },
  {
    "url": "assets/js/39.7b6f7f65.js",
    "revision": "9316b49753d54d3c660ce33324cc56b0"
  },
  {
    "url": "assets/js/4.60240ba6.js",
    "revision": "d39a323aebb582878b9dabe291646f00"
  },
  {
    "url": "assets/js/40.60db0d6f.js",
    "revision": "165a93c7801dc0ffb06bc32ec2da1429"
  },
  {
    "url": "assets/js/41.4d5f8ab9.js",
    "revision": "03663b3d067925a03e9530a083c13e45"
  },
  {
    "url": "assets/js/42.29546cf0.js",
    "revision": "45f710c1602a2f1d17e6c29a4eaaae85"
  },
  {
    "url": "assets/js/43.9f35bcfe.js",
    "revision": "48f0b86e93da256eb9d6d207bf827177"
  },
  {
    "url": "assets/js/44.902e6282.js",
    "revision": "b1c126ef8d1d058adf1ee9bf6877d6ec"
  },
  {
    "url": "assets/js/45.1c3a7e67.js",
    "revision": "04de173abf191f3e6d41fbb41fabcfea"
  },
  {
    "url": "assets/js/46.d59b3c45.js",
    "revision": "549a8ccde061839b08e801d7882657a0"
  },
  {
    "url": "assets/js/47.751b78a9.js",
    "revision": "150da83e934ebd11fab4572493e09d5c"
  },
  {
    "url": "assets/js/48.be5bc7b9.js",
    "revision": "710282276affbab3f0a6c35aeae1f9db"
  },
  {
    "url": "assets/js/49.66e92c9c.js",
    "revision": "de1e432c87838d98c8c2c663b96e8da1"
  },
  {
    "url": "assets/js/5.f5339f58.js",
    "revision": "56f3dd2e9db10262486a7e18dca91152"
  },
  {
    "url": "assets/js/50.ca7da09f.js",
    "revision": "b375229e3083437782d6017f8a186cfa"
  },
  {
    "url": "assets/js/51.089071a0.js",
    "revision": "95c12db380e8e96529741becfda69b11"
  },
  {
    "url": "assets/js/52.7b16b2ec.js",
    "revision": "3e4b3ac1730cf50a331aba99dec162a2"
  },
  {
    "url": "assets/js/53.4a50cfb1.js",
    "revision": "8b7fbd71529805975c3910f503c68bcc"
  },
  {
    "url": "assets/js/54.cae0b269.js",
    "revision": "f577577b030c445a12a231903aba5999"
  },
  {
    "url": "assets/js/55.96396b6a.js",
    "revision": "1a6571e2bcf4bf41eac77caf169e035e"
  },
  {
    "url": "assets/js/6.15a398e1.js",
    "revision": "53f234f1bf2265582e30a83cf62b43f5"
  },
  {
    "url": "assets/js/7.dbcb153c.js",
    "revision": "32b673558962f0b92c6ce965e9609483"
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
    "url": "assets/js/app.3d1c4bb2.js",
    "revision": "cb93246252fd7c85cd1a2ffe3c2da67f"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "478da0ce08930795bd0151e54ad8c5d3"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "603d9ee94aaadef22d2561d0b8c21c44"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "617daff60b29fcfb851c6b5b85f74710"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "2783c71be7b608c341e902b2c9cb2acd"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "9eb915648b5efcff4475cbecb3cafbe3"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "e6601deae980059da8cada0acf3ce1b5"
  },
  {
    "url": "guides/development/test.html",
    "revision": "bc2abb0d84237d0106d8a7e2943a7283"
  },
  {
    "url": "guides/index.html",
    "revision": "cdb7341f6ca9715c737bd15ab0e1754e"
  },
  {
    "url": "index.html",
    "revision": "66b824e46152dd5ec8a7025073c4a760"
  },
  {
    "url": "tips/app-development.html",
    "revision": "cadd3979e4a25d38fba619fef87538dc"
  },
  {
    "url": "tips/index.html",
    "revision": "3245f26511678160cbdea9a2082a13a7"
  },
  {
    "url": "tips/mobile-configuration.html",
    "revision": "c90be303a367d683a98d47cac2848bff"
  },
  {
    "url": "tools/browsers.html",
    "revision": "c1ae0df82317a20aef4f30a29c95b8fb"
  },
  {
    "url": "tools/cli.html",
    "revision": "12d46a901aa0cccdd8091a982afff3d2"
  },
  {
    "url": "tools/db.html",
    "revision": "3d686555d4c97512838e4b36bd18be1f"
  },
  {
    "url": "tools/documentation.html",
    "revision": "14240302a31828d8dd07903dcf7aaf9f"
  },
  {
    "url": "tools/index.html",
    "revision": "a9a3a0b8e109e211608efe1594fa240e"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "9cde59db6452b51884b3b7314ce6c1bf"
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
