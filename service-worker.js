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
    "revision": "61a0a0f466c0da7d5830673f35fec2e0"
  },
  {
    "url": "about/contact.html",
    "revision": "9b35a46e970475b85d6a7552cc12b239"
  },
  {
    "url": "about/contributing.html",
    "revision": "89bd11f680e2edae7bee718a4710aef5"
  },
  {
    "url": "about/index.html",
    "revision": "d19a19ce1bfb1b39c21fd5c42d4586ff"
  },
  {
    "url": "about/license.html",
    "revision": "d631d533cf16921b4e6635e045e846cb"
  },
  {
    "url": "about/roadmap.html",
    "revision": "543473ce8c5c865fcae7d3a80d128205"
  },
  {
    "url": "api/index.html",
    "revision": "f9fbfc1878a010ad8f61b008b024a38a"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "0520c31b80d18a0d554507a15b94af36"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "84fd05495e95779d70476e3008093bf0"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "7736f08822d6b9313cb465ca38d4c093"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "9c951f2637a548db0b022487caa77734"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "b6c3cd4d0ad933a8d9f988c3b99f1248"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "617116d399a4cfdc06f86449c7de98c9"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "90512dc96ec1e691d4d70edc2ce61690"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "658ffc21d57c93b8a39a4989ee006c98"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "a4b93becc2c5fbbbd419d8482f1cc767"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "798ff094e945f98c41d32bc297864d3e"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "35d64f243310bfb4ad922a0b43f1b8fa"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "73540e32f4c88e362ad2e68fc2dad4e9"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "b0587f09377795eecb914cb4b44b65e8"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "84306a54ee22a1913a184b032a8d53df"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "6d564026d21f48c66f275e6d065d2625"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "142cb93b91ee3c2b23cd72523ae7ed53"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "98e1a80959f8fb5d0baf9678fbf08fa7"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "3cdf87841fd06dd112a854814179881f"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "513984ebad6b188d104c632e6c70cf07"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "b9970f9226e9e18f8af47147ac1f38ba"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "1a0b91ac632d0ca49fc17c171685b60c"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "edc0e254cc7d49f294b3ebca0bc55e53"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "b668f6dd281fc008fcbf3ca5a7a0021a"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "315e79ab1b2881b5c6edfcf15e2924af"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "fe1c1ba095179d81c12f01f70e01748d"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "022e5802a54d175040cd291c9cdc1b80"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "9bee245a942da3039c52ff3d2f8f9013"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "295aa1693319a0ac67a381b368814028"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "a8647d1d8711dcd11c6c2b0d1259a94d"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "b4e00905bdac5c819d6bf24ac52f7b7c"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "b11da6b07aacef19de284f6f1802aee1"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "6e88d9c736d5be21b4cccedec377ecfa"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "a4634f7660adcf081ada6a0f4a748e02"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "2013c442b72febc8056136ca8f5908c2"
  },
  {
    "url": "architecture/index.html",
    "revision": "2ebde98edcc252456ad13fff635f8534"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "03b41902823305affd5dcc5006ee0556"
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
    "url": "assets/js/15.518dd8e5.js",
    "revision": "879b409ea7f8316235c942668f27a39e"
  },
  {
    "url": "assets/js/16.28e315cc.js",
    "revision": "191548684ebd04f79fdbe6906bb6dc7f"
  },
  {
    "url": "assets/js/17.71dab417.js",
    "revision": "5b0347e6be70b2387082b3d85877b69a"
  },
  {
    "url": "assets/js/18.351df8e2.js",
    "revision": "8db7fd423457b21f965a8c31300dd0bf"
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
    "url": "assets/js/24.7b3243fa.js",
    "revision": "7fa28c813c319c3caee86947e7f0fa4b"
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
    "url": "assets/js/29.843276ff.js",
    "revision": "55d32cbb582ad02101718d4f57850a2e"
  },
  {
    "url": "assets/js/3.3355429d.js",
    "revision": "3a776af63e5f78b2fa731032c1820364"
  },
  {
    "url": "assets/js/30.51d9a20c.js",
    "revision": "96d2445db494b9ddacdf3dbc7f4b013b"
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
    "url": "assets/js/33.6b1d6306.js",
    "revision": "47933deb755087f015fb2106e2be2df5"
  },
  {
    "url": "assets/js/34.1cbbee40.js",
    "revision": "88a15b79b97702d155337879a6da46d5"
  },
  {
    "url": "assets/js/35.43101a30.js",
    "revision": "9b0183ce2bd30069c6d3d5aecc46f30f"
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
    "url": "assets/js/4.05e1e30d.js",
    "revision": "4ec0a97fe5a3cf524ed6154ae05643a0"
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
    "url": "assets/js/53.aae6472b.js",
    "revision": "e4bf2b15785f3823195499b4ec11bf2c"
  },
  {
    "url": "assets/js/54.a0534692.js",
    "revision": "6c153349cc55745d455a161faf496eb5"
  },
  {
    "url": "assets/js/55.baec9aab.js",
    "revision": "5a9e22b2847d4188770bdade57ad6e82"
  },
  {
    "url": "assets/js/56.f7f3db84.js",
    "revision": "648e21f9740f264c9af2d57e9f3fb8f2"
  },
  {
    "url": "assets/js/57.feeb316f.js",
    "revision": "9e555603d4162742f6c0f2005eb082d4"
  },
  {
    "url": "assets/js/58.5b6f64c0.js",
    "revision": "991e3373273fbc1b3a39a8ce9c6053be"
  },
  {
    "url": "assets/js/59.8f83f031.js",
    "revision": "c1ef620c4e0c3ff86da548409811756d"
  },
  {
    "url": "assets/js/6.38e32613.js",
    "revision": "2d72e6b6bce0ac50ff94ec10fb2d82bd"
  },
  {
    "url": "assets/js/60.091bbf83.js",
    "revision": "f74e0b9edb4d491d7acc9a48722949bc"
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
    "url": "assets/js/app.5ea0a3de.js",
    "revision": "cf18e1af7cb31bf3ece4e899d417b4e9"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "488fb77de9ebddbe38f0f7fc347b4fe6"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "356d3ba7ae91b4210d152c6c9841844b"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "939281e0a6f1ebd2dfbc618bf2be1563"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "7dab36f6050a618eec7f01adc4d85236"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "b6f579daf821548f949e782ad65b7c49"
  },
  {
    "url": "guides/index.html",
    "revision": "112cf03e94537b177251f726cab1e091"
  },
  {
    "url": "index.html",
    "revision": "a363bedbdca4c59204f1bb55da232dc7"
  },
  {
    "url": "tips.html",
    "revision": "f92013fc24d84cb8d6057d65ae3ddb60"
  },
  {
    "url": "tools/browsers.html",
    "revision": "59799e57daeccd1845a765c0d7b6d59b"
  },
  {
    "url": "tools/cli.html",
    "revision": "fc34df3ae4774e4fc45b76fd6d56607a"
  },
  {
    "url": "tools/documentation.html",
    "revision": "e3fbb8b522133ad2914950b6f228f009"
  },
  {
    "url": "tools/index.html",
    "revision": "f971ac0a04f750ed2cb44238fc10c224"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "fb356acab4061a833174d86432c6fe4f"
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
