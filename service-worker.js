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
    "revision": "3dcc908ac0e3851666708c18bfca257a"
  },
  {
    "url": "about/contact.html",
    "revision": "93a1c6442850b3f44e1df0bc93c56a18"
  },
  {
    "url": "about/contributing.html",
    "revision": "ad8f29d02fc7a050b0b1cc7f1edf0ffb"
  },
  {
    "url": "about/index.html",
    "revision": "d482547898e5dec6bf9da8927d46f148"
  },
  {
    "url": "about/license.html",
    "revision": "353ac78fd0dc0d8ec7ffa10ce98b6e80"
  },
  {
    "url": "about/roadmap.html",
    "revision": "0c0072a5bc7f92f050e2a3e4feee4395"
  },
  {
    "url": "api/index.html",
    "revision": "edbc56c56853bbb2b52e6af885d19366"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "98af478b501f4a5b4832dfaebdfb8e29"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "f49236de0212bf81cee412a06b2d35cc"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "4c104d9936374e5d4c453fdeed5ee7ee"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "ca8e946cdb9751609a5dec1141d81193"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "9361d85c3292435b16c7368fad36a868"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "50dcea82e59eed1eb13f91c6cf3c174c"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "5c64d9252a57cd511a5676aacf2b8450"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "89b35dc8093272601b117cdc68190af2"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "32a7581a0ccc234f1ec1e7a8d405c0cf"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "ed32faf1a964b80b22ba268cd3a8d61b"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "4e0a6d11471da84442934532f825c67a"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "41471d8448e039291d990c974b0e235d"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "889ba1fdc5b6c070f1bf48c8fa6652a5"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "e4b3996ead4a625279d6629526cd8660"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "a972867381da25749525cb1d91946f8b"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "0bf5cd4a86e87b08354cd8359e8c7ea7"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "8e4a9a33e8cc1f6b6d0921f28fb758e7"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "df50c9b42a7ffde532bb6804b399261f"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "875c59116aae88bba737dabfec43bdb7"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "7553b1d5fd96ad4382aebd2d4fa899eb"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "e9a278a6b2802e7a682799242448f50f"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "651c04587b35a6703b0469dcaa3a75e5"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "c8b4d0d163adcd0debde59fa73ab13c2"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "df505ddbffba6c2a85f9b300ce7f5f96"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "c2d0e9037c578b88f03289caf6246f55"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "be85b82f91c87042f6f46cde68d8bdf8"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "f06a00cdbfd2f23a0bcb9bdf5317d350"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "27e611d9abe953c509f70f77c19be7f6"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "23a394c1310f65f3310d57163d453d58"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "1fd40a01b85f55edbb33cd1da59b9402"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "5a9c9889654963019644b4433d7234a2"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "5bd1b04b98fa0163e8debdfa0592f0bd"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "1c2ee0ba7efafba80c11a1b615e36038"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "d448ceec708aa6d6f5dec2b24be7c690"
  },
  {
    "url": "architecture/index.html",
    "revision": "c97d8646443872bca67257b125aa1cfa"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "dc8f7dc904cc6daddda5a2594fba9d1c"
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
    "url": "assets/js/54.99feed97.js",
    "revision": "b50b0e0f983a83dc47a2a46627a0716f"
  },
  {
    "url": "assets/js/55.7d1f1489.js",
    "revision": "ef198fb9e085ce6385a3a6c661f33262"
  },
  {
    "url": "assets/js/56.1932e4a2.js",
    "revision": "31c3ecc8790c13e45f61905d297272fa"
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
    "url": "assets/js/app.b768670c.js",
    "revision": "e41e8b1662ce8fe27ba6af99d843cd03"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "abdb2edf79c77863627ac4f965729953"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "811af4f1fe6eb4d330dcb568e6fcb0a8"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "da0b94175eeab864148940ded51a2997"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "436174a6113bc35a2716556e22f0245c"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "b8d01e219b89f690ae2900b21edd4b0b"
  },
  {
    "url": "guides/index.html",
    "revision": "5900922a09418871ced6975ed8b8bf37"
  },
  {
    "url": "index.html",
    "revision": "466e6056cf1b9325d424d32621f26a99"
  },
  {
    "url": "tips.html",
    "revision": "1a5c9e31349927f57591fff29ccfe5cc"
  },
  {
    "url": "tools/browsers.html",
    "revision": "26060445f2490a9acb0592c3642e9070"
  },
  {
    "url": "tools/cli.html",
    "revision": "7936197bdb847b3b01b810f0d2749b88"
  },
  {
    "url": "tools/documentation.html",
    "revision": "2e8d4813a825fad52a5ae274f9d05050"
  },
  {
    "url": "tools/index.html",
    "revision": "4900bb73616edc2fb21075830a4136f4"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "c5e159b6675bcd043902fd1a8de2eb59"
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
