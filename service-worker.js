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
    "revision": "ce89b136924fb0e4e92832fdc73a5efb"
  },
  {
    "url": "about/contact.html",
    "revision": "05e52e07f3ad815f7c4b1c8cdca71d34"
  },
  {
    "url": "about/contributing.html",
    "revision": "398b88e3ce8a74c54be10e2b8d6a8842"
  },
  {
    "url": "about/index.html",
    "revision": "56a15bbf58e22dfdd8129b323a2c71db"
  },
  {
    "url": "about/license.html",
    "revision": "19c1e56583294bb1bfee7ec1e59691ba"
  },
  {
    "url": "about/roadmap.html",
    "revision": "0a6cc0c95207a8c50c9685bc188056b8"
  },
  {
    "url": "api/core/application.html",
    "revision": "6b766978541ae7142c6fc292faee032f"
  },
  {
    "url": "api/core/components.html",
    "revision": "d4c6f2761174eec0009a14983b689035"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "0deb92b9694832e3cb8f482fae2765a2"
  },
  {
    "url": "api/core/index.html",
    "revision": "c8a8cd24744b02bbec19d8766b79412d"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "95a34b0e392ec2f96ea7c1c87d7e7835"
  },
  {
    "url": "api/core/services.html",
    "revision": "182e6c6fec0decc8f007931f8f23a226"
  },
  {
    "url": "api/index.html",
    "revision": "981c62dce72dab265d76d48fd4c7659e"
  },
  {
    "url": "api/map/components.html",
    "revision": "75bc0bcdfcff2fb06b5bd1d516318791"
  },
  {
    "url": "api/map/globe-mixins.html",
    "revision": "4a737b8f266c91fe15b7ee83dbc9d551"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "63021ea8fb4b0600f6d6d88f2e335a3c"
  },
  {
    "url": "api/map/index.html",
    "revision": "3143002d152ebd96794399575961a2aa"
  },
  {
    "url": "api/map/map-mixins.html",
    "revision": "b40b7051f664d2ba8b1f0e936cad1f1b"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "1f25fabe578d03058343d69ab96fb8f8"
  },
  {
    "url": "api/map/services.html",
    "revision": "776eb8ec82121701cebeb963ceab97e1"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "d950977fd089908c526a7edf1fb084b5"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "9b0b126baccc0c6e1ae0e9ed48fe8c93"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "048e8fd9b23d3b19329c9f33ed31f306"
  },
  {
    "url": "architecture/index.html",
    "revision": "7cd5b8b854154cbf3f4809fbc826b2a4"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "3dea60a0002e9aba36772b9ca0df5f79"
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
    "url": "assets/js/13.004accc5.js",
    "revision": "e3d00a094e9d2c3c2ae83084524553ee"
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
    "url": "assets/js/17.7dc92894.js",
    "revision": "b253801acbe5fa3e5d429f749881e24b"
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
    "url": "assets/js/21.6192c6ca.js",
    "revision": "1e58a094f252871a12212eac0c230329"
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
    "url": "assets/js/38.c9b8b8c1.js",
    "revision": "021ac9a3b0c968a480e9aac783637fd6"
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
    "url": "assets/js/43.830fd67c.js",
    "revision": "00752fd3ff0a6096be128c51ff0ce153"
  },
  {
    "url": "assets/js/44.902e6282.js",
    "revision": "b1c126ef8d1d058adf1ee9bf6877d6ec"
  },
  {
    "url": "assets/js/45.196413f4.js",
    "revision": "468460c166bb7540adfaae3dc60d0b4e"
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
    "url": "assets/js/49.83c79b33.js",
    "revision": "3c7e71b44f36dc458db04fe178373ce6"
  },
  {
    "url": "assets/js/5.e9941444.js",
    "revision": "04f27d408b70b629616027e4e0082d15"
  },
  {
    "url": "assets/js/50.ca7da09f.js",
    "revision": "b375229e3083437782d6017f8a186cfa"
  },
  {
    "url": "assets/js/51.b03dea6d.js",
    "revision": "f9336311d356dd21f4cdbb1dc1084edb"
  },
  {
    "url": "assets/js/52.7b16b2ec.js",
    "revision": "3e4b3ac1730cf50a331aba99dec162a2"
  },
  {
    "url": "assets/js/53.61fab3f5.js",
    "revision": "3391e60707332253bed3b8903e78dc71"
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
    "url": "assets/js/6.6c7d3e51.js",
    "revision": "e1b1b22d25f8e11b02cbb1638690bad5"
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
    "url": "assets/js/app.b7f42236.js",
    "revision": "d2f8036e7bc158852d62e2b51f61e2d9"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "1131b81b7fdeea61c7cc9191c352e535"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "057b2d41901c8cfabebc9b1ff370ad32"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "1aee65ea85e247b85c9c7964ea2d97c3"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "574be7fca205a9120df4791e60ba0136"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "ee6ca16e19a5758a232c8cebf6f5db8e"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "23e1ffcb903a145c1c6284e633cf4673"
  },
  {
    "url": "guides/development/testing.html",
    "revision": "9e4c4241433489b9c9c0b223b524e417"
  },
  {
    "url": "guides/index.html",
    "revision": "d569e2ddb87dbcc8c532d94e630f1142"
  },
  {
    "url": "index.html",
    "revision": "0e7dc7f913fef3282993aa0d1e8fe22c"
  },
  {
    "url": "tips/app-development.html",
    "revision": "86d18e662bea51cf24370219dd4a6288"
  },
  {
    "url": "tips/index.html",
    "revision": "b5b31d3ca0a51554347891a812f4f198"
  },
  {
    "url": "tips/mobile-configuration.html",
    "revision": "c92c29fbe1a987a5ba8c27c63c8600ed"
  },
  {
    "url": "tools/browsers.html",
    "revision": "5b069620877cb658dc9b21cf5dd0a8f4"
  },
  {
    "url": "tools/cli.html",
    "revision": "31010ae76f37863731c58770594fae42"
  },
  {
    "url": "tools/db.html",
    "revision": "10cc4823d9b1b1e440c012ebd8d04940"
  },
  {
    "url": "tools/documentation.html",
    "revision": "df03366c3442229d693bb112659c9f14"
  },
  {
    "url": "tools/index.html",
    "revision": "720254c581ef2436b92c000965d7c309"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "3119ffca8ac5e1c76ae1a3bc12d10cca"
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
