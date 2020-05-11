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
    "revision": "950ada12ee5981e2ee313c08bd10668f"
  },
  {
    "url": "about/contact.html",
    "revision": "09482b8c3ec2f990bf95a7943c7dc358"
  },
  {
    "url": "about/contributing.html",
    "revision": "85628816058b887aa246a542b4919c05"
  },
  {
    "url": "about/index.html",
    "revision": "afc20292645e729849774c108eaa603c"
  },
  {
    "url": "about/license.html",
    "revision": "2b0956a5fa16cc1fabbac8a69eac1498"
  },
  {
    "url": "about/roadmap.html",
    "revision": "b2eb43c55629c06733f9a9b49fed886d"
  },
  {
    "url": "api/index.html",
    "revision": "d520c926c1e55c6e94f7650b7900a81e"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "a1359a57655604dec9127c6849c68ea7"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "ddb879e1ffe256d0b782759fc9659f2b"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "247d048bc69ff75c43ababe5a6313f9a"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "c8bbbdfc2f17f2df5ef172c50742f3e3"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "7aed4c8485c92415ff97d99664143b11"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "25cb2af7a8aaed8baa911c6f6bf61a9b"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "ee96f2d0cbc10a466c363440108686bb"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "5c9b20c2fc061571cb249b9f5263019f"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "51f30fdbf2c91352844f4b08add78fa5"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "1e69cc29cacf32c17a0816f0fa98e53a"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "b89fb02119fecb9c10a89607380ddd94"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "023e5fdb8533f327c1089878407bf222"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "fb866dd3366f6c6819bcb60293155a94"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "a1bdd6bc85b4b296d1bf71b05a8af642"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "70bd1a83207046124d9335d67ceb2420"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "a1ab499d1968cdd9759b3a103350956a"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "8876ac6fd318d7dc7bf8778179bc22b0"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "a9bf8a64e16ec1749b4313069f0920ff"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "5e8afb7f9191aed5e8beff5a591200db"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "d41121a53866c11997cb16da99eef95c"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "e50eee9921e424fcd5073464b5f3c070"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "600d1d6bd521ffd37c8e791086e22732"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "373fd000a746ff2995e427986ac128b9"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "f43eca9aed4063e7326e38c458ef0bf4"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "68e01dfee45be4b67d1d7d4e8b3aeaff"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "afc034ae83dba2f50da7dcac663dd96e"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "27a4cdf83390ea549c6740a6580f6780"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "7083fda8f108d2edc1e2995df6005148"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "aa763cd9a88a6976ea6aa9140e174b42"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "adfbfa37ef9dba4815292296a7465fa4"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "04888c83a2e4ef9db630e2c7b88de1c2"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "60000f2ac135bd91dde14e7abcec460f"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "665b1718cfde64817fae26c1b7cc67ee"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "f9a469e938fc4c4631045b5d6f60a76a"
  },
  {
    "url": "architecture/index.html",
    "revision": "164068a3d3e8429e9a3bfd8ef4e468ae"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "fc71403ca0c265521ec7f4fc19014491"
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
    "url": "assets/js/12.c326d659.js",
    "revision": "9ab5444759ce7e718ea58feef847cf24"
  },
  {
    "url": "assets/js/13.4ad58a80.js",
    "revision": "cb390add8584a4e49d884e8046b8834e"
  },
  {
    "url": "assets/js/14.b4b813ad.js",
    "revision": "e564f4facb27dc031f8b78144e9923c9"
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
    "url": "assets/js/18.33f1ee78.js",
    "revision": "07e652af817ffb33e49bae84904e1d91"
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
    "url": "assets/js/26.8703900d.js",
    "revision": "0fff593c95ec09e538dfddfb68693658"
  },
  {
    "url": "assets/js/27.8237e82f.js",
    "revision": "11aea278383baef4669233d3b03516b3"
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
    "url": "assets/js/3.28b3132e.js",
    "revision": "23112ec6743b4c2e00a87ef5e307fda3"
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
    "url": "assets/js/32.240022f4.js",
    "revision": "edb9c39581517346e2e5cab9dd5605f2"
  },
  {
    "url": "assets/js/33.531c8cb3.js",
    "revision": "806497853f4f5bb193fac0df3e2d79e0"
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
    "url": "assets/js/47.707c2ea7.js",
    "revision": "73529802e8a7982e47f6d6856e56dc3f"
  },
  {
    "url": "assets/js/48.3724f664.js",
    "revision": "20d078b90e046c017643553a9e31b362"
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
    "url": "assets/js/50.40673097.js",
    "revision": "daa314d40ec4d0ef36274492b6e8715f"
  },
  {
    "url": "assets/js/51.2583c975.js",
    "revision": "a8bd580989005cbf7b5f97f8d637fa89"
  },
  {
    "url": "assets/js/52.e8db8feb.js",
    "revision": "25418dafd9e56cd11c812df86d202355"
  },
  {
    "url": "assets/js/53.62166243.js",
    "revision": "160192f1c3e7ecb1f1099aee14baa2eb"
  },
  {
    "url": "assets/js/54.219da59b.js",
    "revision": "3cf15201b3d4c10656dabbe1e8c99ab1"
  },
  {
    "url": "assets/js/55.69806b1d.js",
    "revision": "8b7ff4e219beac1751aed538f363a574"
  },
  {
    "url": "assets/js/56.f4759c8d.js",
    "revision": "5acb573b4f0301dab49607c6a4552a62"
  },
  {
    "url": "assets/js/57.6732d989.js",
    "revision": "06a9dc4883c911798c65a4062b048e2c"
  },
  {
    "url": "assets/js/58.12241b96.js",
    "revision": "2b266a9357c0082cdb2a055300a572c6"
  },
  {
    "url": "assets/js/59.8715c455.js",
    "revision": "01a1c22916f0b8d221ef2dab78e2be46"
  },
  {
    "url": "assets/js/6.f5fe4e8c.js",
    "revision": "b71b3498fa7566336202675f57f14e76"
  },
  {
    "url": "assets/js/60.1213e009.js",
    "revision": "880ecfd1a74112eb996c81e72b8b735d"
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
    "url": "assets/js/app.799a369b.js",
    "revision": "917eea9c930276c7975655115a5bef54"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "0666257e0bb932958857a3f5464bbeca"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "52432f9f11c8346a2d16d5f6a8874db9"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "55fdb5eb9f39d36c20039aaecd508bd1"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "08e5d73c8925a084d3d4b3ee0bc5c0f7"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "bbda9c3bae850111a40a1e0cdadd0bed"
  },
  {
    "url": "guides/index.html",
    "revision": "4b28f38fb499799e54911bda3efda89d"
  },
  {
    "url": "index.html",
    "revision": "e25ef41bef3a0863f48ae7e28b74f305"
  },
  {
    "url": "tips.html",
    "revision": "d43e14ea0f0c5143b463fc9ce47bdc45"
  },
  {
    "url": "tools/browsers.html",
    "revision": "90e95bf7c0d05b56d9487d9fff72296d"
  },
  {
    "url": "tools/cli.html",
    "revision": "0c5c4e3e2d7a20d753c6c663aaed18bd"
  },
  {
    "url": "tools/documentation.html",
    "revision": "a4c782d293172bc844d0156723d21f90"
  },
  {
    "url": "tools/index.html",
    "revision": "11bcb8e8f284338d5dba041307a73ba4"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "dd96b1c61c4d62b452d28025c14cb5ea"
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
