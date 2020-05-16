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
    "revision": "a7c72f2e5aaa2b63db86b5ce68ffcbc5"
  },
  {
    "url": "about/contact.html",
    "revision": "8cbff902067df1c2b95b564eb75632ad"
  },
  {
    "url": "about/contributing.html",
    "revision": "a2865802b2066748106887cbfaf2aa02"
  },
  {
    "url": "about/index.html",
    "revision": "78ea4e0c9fe3cf5fb976b8ce5001f3a8"
  },
  {
    "url": "about/license.html",
    "revision": "d46f20b65eff6490c59f9012c5b5b762"
  },
  {
    "url": "about/roadmap.html",
    "revision": "d7ee9ac65ee7fd1a32937f7a529ac7d5"
  },
  {
    "url": "api/index.html",
    "revision": "769200f9fabba7eba3125e9caf93399c"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "78df7a60ab74dba1ea927bb5a7328860"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "30255ac6f573d9ab1d9e16288a5d5319"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "8408b1cb877ee50b4f47a687319d4acc"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "a9a53eff70b7b7291cab84847d4b4abb"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "c2d7657c4552037e57f3bd4a01411c2c"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "353cf2db2e46c0c0e3e2455688add305"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "81dd88873f36f1794f7550c5f5893b8f"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "d6eff9c53b203387c10969e72ab0d21a"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "9e22e089a7884ae8928f65b96b861f85"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "53365d3d1a182712f6838a60adcbbe3a"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "d6c6ccc8db2a6c4f55b1699db3e1b391"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "4790c12906ae615b25fb88fc18453326"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "67be41540a6fba2fd315f13ab989500b"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "78fa7e58bf6c5b6cd38b2f13201e3a50"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "3ad249a98f1f14b11150b9e01b740a36"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "fcee3f9edceb0a17b905d6d6ef7c2e29"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "5e917bceec006aa18ca12648424aa515"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "e8cc4af105826dfc76516c1c60500dd8"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "bbe8094ddb986dd14bca6515cbd9864f"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "2d870e441a7fdee4236fac8df91e8b5b"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "00b26db8561400ea32f910be819762b4"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "556ca578263e94d260790ec2ddbcec03"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "38dea0c2b1e082c16173108c1c0b71f3"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "2d8f6f6d9ae40caa40e3718236ac56c4"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "b0c99ed00b44129ae3300ff7886ef5ee"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "1cc069f058dbd15b8d527d97a81b360c"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "13a44c52d0ef5a48cfd0fd92a9aefeae"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "43968bb37fde8627e7ad7faa540be4e2"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "b2a4a2c91d97405d634e6bbad514c21f"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "747c90240d87387531905f45819517d3"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "b38a6e2db9ba528c05638a4bfbfed787"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "b4c0df53a6e1e85f295c3a1f77f447ae"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "77eb0696976dcd3f6b3bb01fdfb39d64"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "3ae3d8cfc6b01863b6a8a01e424d3e05"
  },
  {
    "url": "architecture/index.html",
    "revision": "e50d0596c164782d8c6fa0be5486e92b"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "2030c52adfc9adc498463920783d2483"
  },
  {
    "url": "assets/css/0.styles.9fa317d1.css",
    "revision": "dddc7c0257a7b9d7f4a81f34694ba431"
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
    "url": "assets/img/application-hooks.e15ca2e0.svg",
    "revision": "e15ca2e0e0ce1b30ac2716348e14cc33"
  },
  {
    "url": "assets/img/authorisations-hooks.223455bf.png",
    "revision": "223455bfff7bf51dddf7721b4a40d5f6"
  },
  {
    "url": "assets/img/catalog-data-model.998b319c.png",
    "revision": "998b319c85f0c564838fe6886a1aa5b3"
  },
  {
    "url": "assets/img/cd-pipeline.79fa1089.svg",
    "revision": "79fa1089efa2822bd40f57e6c9e6c20f"
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
    "url": "assets/img/feature-hooks.c545f93a.png",
    "revision": "c545f93a07bb3da5d461aaf310813751"
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
    "url": "assets/img/storage-hooks.f7cd9bef.png",
    "revision": "f7cd9befe2f959dfbe39b009dcda2ea0"
  },
  {
    "url": "assets/img/tags-hooks.19298e57.png",
    "revision": "19298e5708cae740717b9063f3f8868c"
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
    "url": "assets/img/users-hooks.506d5935.png",
    "revision": "506d59353934862bbe3bb0fb5210ffdc"
  },
  {
    "url": "assets/js/10.0e9dbc41.js",
    "revision": "666bd55c2b7b6bed63ff6f3b4821712e"
  },
  {
    "url": "assets/js/11.38bbfcce.js",
    "revision": "1d9d03220c79137c0dfc3bb7bcc90f0a"
  },
  {
    "url": "assets/js/12.8b540f47.js",
    "revision": "8fc1c753c60da09802a83a438ec2fa14"
  },
  {
    "url": "assets/js/13.3148f7ac.js",
    "revision": "abb9606f438eb40137622e5ced511364"
  },
  {
    "url": "assets/js/14.a3e27be3.js",
    "revision": "02b7198165fc585eea6be0d3e1a8fd4f"
  },
  {
    "url": "assets/js/15.fd61017d.js",
    "revision": "dd112f62b97bf8e5e0fbb534455fc648"
  },
  {
    "url": "assets/js/16.910eb7ec.js",
    "revision": "bfa63706387026aaccbff7e20c843739"
  },
  {
    "url": "assets/js/17.71dab417.js",
    "revision": "5b0347e6be70b2387082b3d85877b69a"
  },
  {
    "url": "assets/js/18.c130f3a3.js",
    "revision": "a8a060a9d7ec3f36c2be719173ca9e3a"
  },
  {
    "url": "assets/js/19.76767d6c.js",
    "revision": "6cd4adf395148deaa8a3434b3249ce5e"
  },
  {
    "url": "assets/js/2.e6b7f245.js",
    "revision": "b784bc26b5a779e411e850bbebaf5a26"
  },
  {
    "url": "assets/js/20.5948d941.js",
    "revision": "16f05f7656ea98ea686ce7b3fe4541cd"
  },
  {
    "url": "assets/js/21.1396f9ec.js",
    "revision": "2ea865e6da115c0ec989884c5879dc6d"
  },
  {
    "url": "assets/js/22.bd960c42.js",
    "revision": "a6306135cfd44f4424196fc3c8445d3f"
  },
  {
    "url": "assets/js/23.e114edfe.js",
    "revision": "0bec44ef87f4c3779a0c65c584c680e8"
  },
  {
    "url": "assets/js/24.4615da69.js",
    "revision": "b11266bc7e26fa21a7c502fa7e1871af"
  },
  {
    "url": "assets/js/25.863b31f3.js",
    "revision": "7a5bb0f2c3765be2d8d3b36485f7cdf2"
  },
  {
    "url": "assets/js/26.e63f3e4a.js",
    "revision": "38130029ca079f863fd9b043ccc36281"
  },
  {
    "url": "assets/js/27.60b6127b.js",
    "revision": "0188d1bbbebf20e2e7ffc6c3a135b910"
  },
  {
    "url": "assets/js/28.a89f97e7.js",
    "revision": "e894c2936fad67c2a160e028f37f49cb"
  },
  {
    "url": "assets/js/29.47a5b60c.js",
    "revision": "2828c48d49903402df3bc89ece4a7228"
  },
  {
    "url": "assets/js/3.3355429d.js",
    "revision": "3a776af63e5f78b2fa731032c1820364"
  },
  {
    "url": "assets/js/30.46c5eea8.js",
    "revision": "03618045de0fbb4433b58cd596f123a2"
  },
  {
    "url": "assets/js/31.45c55b0f.js",
    "revision": "de5552701fbf82c1f9e76fbba8e4bc53"
  },
  {
    "url": "assets/js/32.124609b0.js",
    "revision": "8932ac1da31ee46f5e92d27de020f0a5"
  },
  {
    "url": "assets/js/33.da17fbca.js",
    "revision": "76782419cc29501f21988fd3c13fcf3f"
  },
  {
    "url": "assets/js/34.baf134a4.js",
    "revision": "78c02890d26d3408af39c05c711c3130"
  },
  {
    "url": "assets/js/35.0c845d3f.js",
    "revision": "925811ad0224d211ec9053331cca4755"
  },
  {
    "url": "assets/js/36.215bc388.js",
    "revision": "d6221417cdda74d87efd49d7f2e70088"
  },
  {
    "url": "assets/js/37.ca79bc7c.js",
    "revision": "7d5e0b329045f0ed264bd25d7bc83fc7"
  },
  {
    "url": "assets/js/38.d70c1093.js",
    "revision": "279575630afc61162334e0390af87cbd"
  },
  {
    "url": "assets/js/39.e7820f47.js",
    "revision": "8345cb2924e105a989911b372e6e9a43"
  },
  {
    "url": "assets/js/4.4bcc6c5e.js",
    "revision": "ce6cd542361fda4c1eb0272c9d52f192"
  },
  {
    "url": "assets/js/40.b82b1130.js",
    "revision": "1ec620f55fe9d7fe91cb75dae799bd9e"
  },
  {
    "url": "assets/js/41.7b37b3a6.js",
    "revision": "62b726cd3c74f87f3ae4a4662576e146"
  },
  {
    "url": "assets/js/42.a600f4f0.js",
    "revision": "5635f0b2c5cabb4787b3163140e271d7"
  },
  {
    "url": "assets/js/43.02234de3.js",
    "revision": "834161d58e3006f623322bf0e24a3e94"
  },
  {
    "url": "assets/js/44.5e0456de.js",
    "revision": "6afbc80dbf8d1a4a04e29422671c06e7"
  },
  {
    "url": "assets/js/45.5bcb9967.js",
    "revision": "cf78a55baa8553fabeac7d6ce3c4d0c3"
  },
  {
    "url": "assets/js/46.78c69694.js",
    "revision": "54e1f99cb982cc2ce6123b956cf052af"
  },
  {
    "url": "assets/js/47.0c71973a.js",
    "revision": "cfca678ef24e15e0a13eeb61cd622716"
  },
  {
    "url": "assets/js/48.4f7bfdb9.js",
    "revision": "16075e3ba218a0d30e2a698150a0424b"
  },
  {
    "url": "assets/js/49.5c7d3349.js",
    "revision": "d65659efcc9f0d980a80b32a034f6cc2"
  },
  {
    "url": "assets/js/5.9a6b1310.js",
    "revision": "ff14c81e7c99d1fd513d03e5b51b2479"
  },
  {
    "url": "assets/js/50.d36b07d1.js",
    "revision": "540d7bf7833573324721872a4720bbcd"
  },
  {
    "url": "assets/js/51.e080ef08.js",
    "revision": "7a75d38bb4700d8d6c80116e41bf7e0f"
  },
  {
    "url": "assets/js/52.2a1ef113.js",
    "revision": "56aec456f3e9fc31926bdfd17d47ad97"
  },
  {
    "url": "assets/js/53.62166243.js",
    "revision": "160192f1c3e7ecb1f1099aee14baa2eb"
  },
  {
    "url": "assets/js/54.8d27d371.js",
    "revision": "518315478c563818be132d89c32fce52"
  },
  {
    "url": "assets/js/55.73d32943.js",
    "revision": "f18a8fb22587779be4e6c81225db754e"
  },
  {
    "url": "assets/js/56.f4759c8d.js",
    "revision": "5acb573b4f0301dab49607c6a4552a62"
  },
  {
    "url": "assets/js/57.c11147ad.js",
    "revision": "79de565026303a045a082def6122220b"
  },
  {
    "url": "assets/js/58.5b6f64c0.js",
    "revision": "991e3373273fbc1b3a39a8ce9c6053be"
  },
  {
    "url": "assets/js/59.8715c455.js",
    "revision": "01a1c22916f0b8d221ef2dab78e2be46"
  },
  {
    "url": "assets/js/6.25ec3b52.js",
    "revision": "3d32520bfbe3d343abbaede6bfbd111d"
  },
  {
    "url": "assets/js/60.fde9de4a.js",
    "revision": "448f89474295dc9573c7af3195c88366"
  },
  {
    "url": "assets/js/61.9c935a85.js",
    "revision": "c7620be444870e5a2d46bac7e41aa3b9"
  },
  {
    "url": "assets/js/7.4c67a6e3.js",
    "revision": "c405d58fbd40163a1d1f334e93016622"
  },
  {
    "url": "assets/js/8.93a56dd8.js",
    "revision": "7917042f61dad2382c623fba3294aad4"
  },
  {
    "url": "assets/js/9.c80db7c7.js",
    "revision": "66aa02b12de9ef992b27b529758e4180"
  },
  {
    "url": "assets/js/app.38e403a9.js",
    "revision": "64fe83eddc6bcf20c6b35ef348fdcdf7"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "0769428c023b56c2e2dc4c55e26d0705"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "2508983013d7077a15f08a7ac8101e29"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "b6c24fd086c8507ff515aaccc8a4c384"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "4dc112e6d762316b65e84a351791dfe8"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "22af38ba3850ddced3dab76ec9a38678"
  },
  {
    "url": "guides/index.html",
    "revision": "9a43e85746e1dfc7c2b317b9c8752548"
  },
  {
    "url": "index.html",
    "revision": "119b81bc4bb61e89ea3df23a197f2a4d"
  },
  {
    "url": "tips.html",
    "revision": "e08a90e8a3948cef860c46d6e17b1d58"
  },
  {
    "url": "tools/browsers.html",
    "revision": "fbf8cc8f18289bd009308c70e2a1007e"
  },
  {
    "url": "tools/cli.html",
    "revision": "677e2ddb5f92c19aed7ede473544d846"
  },
  {
    "url": "tools/documentation.html",
    "revision": "a3788cb47deacce88f3844897f0b32c3"
  },
  {
    "url": "tools/index.html",
    "revision": "d4f3fdc9b020cc7283df9d1cdd4f5464"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "61b44f8f994b4f36fc06f2e57148b86d"
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
