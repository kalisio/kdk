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
    "revision": "0ad0364018df3226146cc562e1ce12ca"
  },
  {
    "url": "about/contact.html",
    "revision": "304ddbfb653dce1db276ab0312396b6f"
  },
  {
    "url": "about/contributing.html",
    "revision": "71354d53b9683aa22a58567458364588"
  },
  {
    "url": "about/index.html",
    "revision": "e0e8689b815a6cecf9c2d73ba859cb95"
  },
  {
    "url": "about/license.html",
    "revision": "e7e1a906ec7a0aede3e00c2e96457d90"
  },
  {
    "url": "about/roadmap.html",
    "revision": "b166f40552e7d74dfde0b401837eacc5"
  },
  {
    "url": "api/index.html",
    "revision": "d529682f42c1faee762364a73db28e3b"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "6ac0ead50728a6f4cb615155fd84a2f2"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "50b18c005c760111568394b08094c90b"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "f844d81ad99525bfe4c23e3fc413b189"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "94b4bdcb6dddc2fe4f12ba031c4492fb"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "ed49827acb4da2974643d491629eee85"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "a19599eb75e238a6a6da504bf7cdd999"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "370bbe3c772144db345535c2ac4486c4"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "ca05abb18e45d263d876cb7a6825cc91"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "2ec6905ba76fc2dd7264114d78b2c206"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "1df76016ce6b428391bf1dad4d237f01"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "339dfdda040300c8a358a6d507545483"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "00db43de32db80cf54eb46f7f355d90a"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "90b41ea34298c72e80a7f01bc9c18ff4"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "0fc8a3fdde7ed5a5f6aed032ba3a0e32"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "40e2bff845b839a442dac906b7ca2154"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "775f6c8df64838316f9d58f55ea75805"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "b720da0663fe52364392bf7ac64027f1"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "5059a13a0e72fb61a8fc479c06272be6"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "d4b58a8e45260328b706a925e218cb29"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "5d073346eb7658fe20b7f9bb61a391cc"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "a872c465f9051d21848babb9ad6b5eb3"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "4acdc9a001962c0a930662152b2d88ce"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "49719f0d7f32229f3a9178a6814a62f1"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "9c05f6f931bf0677a22480bb0fd166ec"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "98174f03c14d5f2d057695d7a51e2071"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "2bcd9237e097fb9c866a62dfc5251834"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "9afba6b1b4b71dc40c3020f0478cbfb7"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "2157e7a0b4bc97fdae6521065db962e6"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "614febea37aeff22c251f92848f7a0a0"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "8d17dfd0cc8f7eaab2106f338c0d55c6"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "daa9afe492deaa22e4a872df14e351a4"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "8590add7179c96a9dcba6333e1124a1c"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "57af05e9c90218d9e59130618194dd41"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "972356a67f085fbf07b5e42f6198fa07"
  },
  {
    "url": "architecture/index.html",
    "revision": "a816f6e3a76c339f188c7e6fe9bd4c8e"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "dc234d83ea0feeb9d9765498cfe755d4"
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
    "url": "assets/js/11.5abb5e6d.js",
    "revision": "d856604ecd0395fc296c4b45510e0ab7"
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
    "url": "assets/js/20.21f9278b.js",
    "revision": "8639476cd5cced22e90f9294a410bda8"
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
    "url": "assets/js/27.16afb931.js",
    "revision": "b4f6a9efd6083a6b00a8d5e191e7d19e"
  },
  {
    "url": "assets/js/28.79984ecc.js",
    "revision": "c3a9cc3955ae6affcdb38cc9f38384f3"
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
    "url": "assets/js/33.da17fbca.js",
    "revision": "76782419cc29501f21988fd3c13fcf3f"
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
    "url": "assets/js/37.51a8b902.js",
    "revision": "186824e8be709a940dfaa569d890529a"
  },
  {
    "url": "assets/js/38.e4525f92.js",
    "revision": "3a2eeeb236a08f298324d1e2bc8b9d47"
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
    "url": "assets/js/49.4fe332ca.js",
    "revision": "4167465da9f0de916d27b14da58a35b4"
  },
  {
    "url": "assets/js/5.9a6b1310.js",
    "revision": "ff14c81e7c99d1fd513d03e5b51b2479"
  },
  {
    "url": "assets/js/50.e8557c2d.js",
    "revision": "45e800ad9a571d64cb5f76046d4527fe"
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
    "url": "assets/js/54.a0534692.js",
    "revision": "6c153349cc55745d455a161faf496eb5"
  },
  {
    "url": "assets/js/55.73d32943.js",
    "revision": "f18a8fb22587779be4e6c81225db754e"
  },
  {
    "url": "assets/js/56.eaf76464.js",
    "revision": "b2cc6a222b077c0d419e8afb327744a2"
  },
  {
    "url": "assets/js/57.feeb316f.js",
    "revision": "9e555603d4162742f6c0f2005eb082d4"
  },
  {
    "url": "assets/js/58.12241b96.js",
    "revision": "2b266a9357c0082cdb2a055300a572c6"
  },
  {
    "url": "assets/js/59.d24162c9.js",
    "revision": "fa71b8a06441c0983975d14334a96167"
  },
  {
    "url": "assets/js/6.25ec3b52.js",
    "revision": "3d32520bfbe3d343abbaede6bfbd111d"
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
    "url": "assets/js/app.c5403d78.js",
    "revision": "e660173a94ba2f0cd66c7c6ebf248b19"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "5473ca1e8d4ba30b4c721e9296e2fa21"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "5eb0caa446ed5ff8ece5782d8e85d681"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "7bac25fdf91e4c4950ca975cb330c808"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "14add44333a113cb5a71cdd06d1e3ecb"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "dbc25ff783509ed52f1966b58680ceef"
  },
  {
    "url": "guides/index.html",
    "revision": "a0df49d2fbbfbc75ece57050e3748c2d"
  },
  {
    "url": "index.html",
    "revision": "89f17ee61a4f45265df9904f38fcee1a"
  },
  {
    "url": "tips.html",
    "revision": "0ab50c3a0bbcf931bbd3964d1b700247"
  },
  {
    "url": "tools/browsers.html",
    "revision": "7a3bd1d6094e61f86e0e73631954758c"
  },
  {
    "url": "tools/cli.html",
    "revision": "0ee676d18a7640330e915e24fa42e7d4"
  },
  {
    "url": "tools/documentation.html",
    "revision": "b145c85f864816dacabaf4710a0f1c29"
  },
  {
    "url": "tools/index.html",
    "revision": "246b0fdddf58383b4a6c6e21f9d4ee30"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "da8ef3c78f34c4445c6772e15bd7b65a"
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
